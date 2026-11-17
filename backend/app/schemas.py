from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str


class Message(BaseModel):
    role: str
    content: str


class ChatResponse(BaseModel):
    reply: str