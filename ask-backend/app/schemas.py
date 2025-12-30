from pydantic import BaseModel

class IngestRequest(BaseModel):
    room:str
    text: str
    source:str | None = None

class SearchRequest(BaseModel):
    room:str
    question: str
    limit: int = 5

class ChatRequest(BaseModel):
    room:str
    question: str