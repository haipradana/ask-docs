import os
import requests

BASE_URL = os.getenv("BYTEPLUS_BASE_URL")
MODEL_NAME = os.getenv("BYTEPLUS_MODEL")
API_KEY = os.getenv("BYTEPLUS_API_KEY")

def generate_answer(question: str, context: str) -> str:
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }

    payload = {
        "model": MODEL_NAME,
        "messages": [
            {
                "role": "system",
                "content": (
                    "Kamu adalah asisten AI. "
                    "Jawab HANYA berdasarkan konteks. "
                    "Jika tidak ada di konteks, katakan tidak tahu."
                )
            },
            {
                "role": "user",
                "content": f"""
KONTEKS:
{context}

PERTANYAAN:
{question}
"""
            }
        ],
        "temperature": 0.2,
        "max_tokens": 400
    }

    resp = requests.post(BASE_URL, headers=headers, json=payload, timeout=30)
    resp.raise_for_status()
    return resp.json()["choices"][0]["message"]["content"]
