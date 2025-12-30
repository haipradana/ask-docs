from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .schemas import IngestRequest, SearchRequest, ChatRequest
from .embed import (
    embed_dense,
    # embed_dense_passage,
    # embed_dense_query,
    embed_sparse
)
from .qdrant import upsert_point, hybrid_search
from .llm import generate_answer
from .minio_client import s3, BUCKET_NAME
from .pdf_utils import extract_text_smart, make_point_id
from .chunker import chunk_text

import tempfile, os, time, hashlib

app = FastAPI(title="Hybrid Search RAG API - ASK Docs E5")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def make_id(text: str)-> int:
    return int(hashlib.md5(text.encode()).hexdigest()[:8], 16)

@app.post("/ingest")
def ingest(req: IngestRequest):
    dense = embed_dense(req.text)
    sparse = embed_sparse(req.text)
    
    payload = {
        "room": req.room,
        "text": req.text,
        "source": req.source,
        "ts":int(time.time())
    }
    
    point_id = make_id(req.text)
    upsert_point(point_id, dense, sparse, payload)
    
    return {"status":"OK", "id": point_id}

@app.post("/search")
def search(req: SearchRequest):
    dense_q = embed_dense(req.question)
    sparse_q = embed_sparse(req.question)
    
    results = hybrid_search(
        dense_q, 
        sparse_q, 
        limit=req.limit, 
        room_filter=req.room
    )
    
    return {
        "results" : [
            {
                "id": r.id,
                "score" : r.score,
                "payload" : r.payload
            }
            for r in results
        ]
    }

@app.post("/chat")
def chat(req: ChatRequest):
    dense_q = embed_dense(req.question)
    sparse_q = embed_sparse(req.question)

    results = hybrid_search(
        dense=dense_q,
        sparse=sparse_q,
        room_filter=req.room,
        limit=5
    )

    context = "\n\n".join(
        r.payload["text"] for r in results
    )

    answer = generate_answer(req.question, context)

    return {
        "answer": answer,
        "sources": [r.payload for r in results]
    }

@app.post("/ingest/minio")
def ingest_minio(object: str):
    # 1. room dari folder bucket
    room = object.split("/")[0]
    filename = object.split("/")[-1]

    # 2.download ke tempfile
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")as tmp:
        s3.download_fileobj(BUCKET_NAME, object, tmp)
        pdf_path = tmp.name
    
    # 3. extract text
    text = extract_text_smart(pdf_path)
    os.remove(pdf_path)

    if not text.strip():
        return {"status": "failed", "reason": "no text extracted"}

    # 4 chunking
    chunks = chunk_text(text)

    # 5. ingest to Qdrant
    for i, chunk in enumerate(chunks):
        dense = embed_dense(chunk)
        sparse = embed_sparse(chunk)

        point_id = make_point_id(object, i)

        payload = {
            "room" : room,
            "text": chunk,
            "source": "pdf",
            "filename": filename,
            "chunk_id": i,
            "ts": int(time.time())
        }

        upsert_point(
            point_id=point_id,
            dense=dense,
            sparse=sparse,
            payload=payload
        )

    return {
        "status": "OK",
        "room": room,
        "chunks": len(chunks),
        "file": filename
    }
