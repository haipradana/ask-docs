## buuat collection qdrant
curl -X PUT "https://qdrant.pradanayahya.com/collections/ask_docs_e5" \
  -H "api-key: API-KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "vectors": {
      "dense": {
        "size": 384,
        "distance": "Cosine"
      }
    },
    "sparse_vectors": {
      "sparse": {}
    }
  }'

## ingest test
curl -X POST "http://localhost:8000/ingest" \
  -H "Content-Type: application/json" \
  -d '{
    "room": "informatika",
    "text": "Universitas Indonesia memiliki fakultas ilmu komputer yang sangat bagus",
    "source": "website"
  }'

## search test
curl -X POST "http://localhost:8000/search" \
  -H "Content-Type: application/json" \
  -d '{
    "room": "informatika",
    "question": "fakultas komputer terbaik",
    "limit": 5
  }'

#chat llm agentic rag
curl -X POST http://localhost:8000/chat -H "Content-Type: application/json" -d '{ "room": "kampus", "question": "apa syarat seminar kerja praktik?" }'

# hapus berdasarkan filter
curl -X POST "https://qdrant.pradanayahya.com/collections/ask_docs_e5/points/delete" \
  -H "Content-Type: application/json" \
  -H "api-key: API-KEY" \
  -d '{
        "filter": {
          "must": [
            {
              "key": "filename",
              "match": {
                "value": "buku_panduan_akademik_2023.pdf"
              }
            }
          ]
        }
      }'

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# fastAPI tahap 2
pip install pdfplumber boto3 pytesseract pdf2image pillow
sudo apt install tesseract-ocr poppler-utils
pip install llama-cloud-services