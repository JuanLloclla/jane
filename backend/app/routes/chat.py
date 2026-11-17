from fastapi import APIRouter

from app.schemas import ChatRequest, ChatResponse, Message
from app.services.jane import Jane

router = APIRouter(prefix="/chat", tags=["chat"])

jane = Jane()  # una sola instancia por ahora


@router.post("", response_model=ChatResponse)
def enviar(req: ChatRequest):
    return ChatResponse(reply=jane.responder(req.message))


@router.get("", response_model=list[Message])
def obtener_historial():
    return jane.historial()


@router.post("/nuevo")
def nuevo_chat():
    jane.reiniciar()
    return {"ok": True}