import pdfplumber
from pdf2image import convert_from_path
import pytesseract
import uuid
import os
from llama_cloud_services import LlamaParse
import re

def get_llamaparse_client():
    api_key= os.getenv("LLAMA_CLOUD_API_KEY")
    if not api_key:
        return None
    
    return LlamaParse(
        api_key=api_key,
        tier="agentic", # bisa agentic_plus #change to agentic if the files is not containing complex tables or diagram
        version="latest",
        high_res_ocr=True,
        adaptive_long_table=True,
        outlined_table_extraction=True,
        output_tables_as_HTML=False,
        precise_bounding_box=False,
        max_pages=0,
    )

def llamaparse_extract(path: str) -> str:
    try:
        parser = get_llamaparse_client()
        if not parser:
            print("API not found!")
            return None
        
        print("Trying LlamaParse...")
        result = parser.parse(path)
        
        # Get markdown documents
        markdown_docs = result.get_markdown_documents(split_by_page=False)
        
        # Combine all markdown text
        text = "\n\n".join([doc.text for doc in markdown_docs])

        #clean text before embeddings
        text = clean_text_for_embedding(text)
        
        if text and len(text.strip()) > 50:
            print(f"DONE! LlamaParse: Extracted {len(text)} characters")
            return text
        else:
            print("WARNING! LlamaParse: Insufficient text extracted")
            return None
            
    except Exception as e:
        print(f"FAILED! LlamaParse failed: {str(e)}")
        return None

def extract_text_pdf(path:str) -> str:
    text =""
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text+= page_text + "\n"
    
    text = clean_text_for_embedding(text)

    return text

def ocr_pdf(path: str) -> str:
    images = convert_from_path(path)
    text =""
    for img in images:
        text += pytesseract.image_to_string(img, lang="ind+eng")

    text = clean_text_for_embedding(text)
    return text

def extract_text_smart(path: str) -> str:
    # llama -> pdfplumber -> tesseract ocr
    text = llamaparse_extract(path)
    if text and len(text.strip()) > 50:
        print(f"success used llamaparse with {len(text)} chars")
        return text

    text = extract_text_pdf(path)
    if text and len(text.strip()) > 50:
        print(f"success used pdf plumber with {len(text)} chars")
        return text
        
    text = ocr_pdf(path)
    return text

def make_point_id(object_path: str, chunk_id: int) -> str:
    base = f"{object_path}::chunk_{chunk_id}"
    return str(uuid.uuid5(uuid.NAMESPACE_URL, base))

def clean_text_for_embedding(text: str) -> str:
    """
    Aggressive cleaning for small embedding models (384 dim).
    Remove noise while preserving semantic meaning.
    """
    
    # 0. Remove HTML tags
    text = re.sub(r'<br\s*/?>', ' ', text)  # <br> or <br/> → space
    text = re.sub(r'<[^>]+>', ' ', text)  # Remove all other HTML tags
    
    # Decode common HTML entities
    text = text.replace('&nbsp;', ' ')
    text = text.replace('&amp;', '&')
    text = text.replace('&lt;', '<')
    text = text.replace('&gt;', '>')
    text = text.replace('&quot;', '"')
    text = text.replace('&#39;', "'")
    
    # 1. Remove excessive pipes and replace with simple separator
    text = re.sub(r'\s*\|\s*\|\s*\|+', ' ', text)  # ||| → space
    text = re.sub(r'\s*\|\s*', ' ', text)  # | → space
    
    # 2. Clean table markers and formatting
    text = re.sub(r'\*\*Tabel\s+[\d.]+:\*\*', 'Tabel:', text)  # **Tabel 2.33:** → Tabel:
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)  # **bold** → bold
    
    # 3. Remove excessive dashes/separators
    text = re.sub(r'-{3,}', '', text)  # ------- → remove
    text = re.sub(r'_{3,}', '', text)  # _______ → remove
    text = re.sub(r'={3,}', '', text)  # ======= → remove
    
    # 4. Clean excessive whitespace
    text = re.sub(r'\s{2,}', ' ', text)  # multiple spaces → single space
    text = re.sub(r'\n\s*\n\s*\n+', '\n\n', text)  # multiple newlines → double newline
    
    # 5. Remove leading/trailing whitespace per line
    lines = [line.strip() for line in text.split('\n')]
    text = '\n'.join(lines)
    
    return text.strip()