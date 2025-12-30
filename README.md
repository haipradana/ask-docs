# ASK DOCS - ask.pradanayahya.me

Implementasi Hybrid Search dan Agentic RAG (Retrieval-Augmented Generation) dengan FastAPI backend dan React frontend. Menerapkan konsep Hybrid Search pada pencarian jawaban, dengan pendekatan semantic (dense vector) dengan embedding dan exact keyword (sparse vector) dengan algoritma BM25. Hasil bobot pada vector dan kata kunci lalu digabung dan diberi bobot oleh Reciprocal Rank Fusion (RRF), menghasilkan peringkat akhir yang lebih relevan terhadap query user.

Menggunakan embedding model all-MiniLM-L6-v2, kecil dan ramah cpu, dengan 384 dimensi. NOTE: buat collection dengan 384 dimensi! Bisa via REST, cek `ask-backend/howto.md`.

## Stack

### Backend
- FastAPI
- Qdrant - Vector database
- MinIO - Object storage
- all-MiniLM-L6-v2 embedding models
- LLM -> byteplus

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Bun

### 1. Setup Backend

```bash
cd ask-backend
pip install -r requirements.txt 
```

Buat `.env` atau copy `.env.example` dan rename jadi `.env` di `ask-backend/`:

Jalankan backend:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Setup Frontend

```bash
cd ask-frontend
bun install
```

Buat `.env` di `ask-frontend/`:
```env
VITE_API_URL=http://localhost:8000
```

Jalankan frontend:
```bash
bun run dev
```
## Rooms

Aplikasi mendukung multiple rooms untuk kategorisasi knowledge:

- **kampus** - Pertanyaan seputar kampus dan akademik
- -> tambahan, misal:
- **umum** 
- **internal** 
- **dokumentasi**

Konfigurasi rooms ada di `ask-frontend/src/config/rooms.ts`

### Akses Aplikasi (DEV)

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

## Koneksi Backend-Frontend

### Field Mapping

**Frontend → Backend:**
```typescript
// frontend sends
{ room: "kampus", message: "pertanyaan user" }

// mapped to backend format
{ room: "kampus", question: "pertanyaan user" }
```

**Backend → Frontend:**
```typescript
// backend returns
{
  answer: "jawaban AI",
  sources: [
    { room: "kampus", text: "...", filename: "file.pdf", ... }
  ]
}

// mapped to frontend format
{
  content: "jawaban AI",
  sources: ["file.pdf", ...]
}
```

### CORS Configuration

Backend menggunakan CORS middleware untuk menerima request dari frontend:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ubah untuk production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## API Endpoints

### POST /chat
Chat dengan AI menggunakan RAG

**Request:**
```json
{
  "room": "kampus",
  "question": "apa syarat seminar kerja praktik?"
}
```

**Response:**
```json
{
  "answer": "Syarat seminar kerja praktik adalah...",
  "sources": [
    {
      "room": "kampus",
      "text": "...",
      "source": "pdf",
      "filename": "panduan_akademik.pdf",
      "chunk_id": 0,
      "ts": 1234567890
    }
  ]
}
```

### POST /search
Search dokumen tanpa LLM

**Request:**
```json
{
  "room": "kampus",
  "question": "fakultas komputer terbaik",
  "limit": 5
}
```

### POST /ingest
Ingest text manual

**Request:**
```json
{
  "room": "informatika",
  "text": "Universitas Indonesia memiliki fakultas ilmu komputer yang sangat bagus",
  "source": "website"
}
```

### POST /ingest/minio
Ingest PDF dari MinIO

**Request:**
```json
{
  "object": "kampus/panduan_akademik.pdf"
}
```
