import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
BASE_URL = os.getenv("OPENAI_BASE_URL")
MODEL = os.getenv("OPENAI_MODEL") or "gemini-3.5-flash-lite"

SYSTEM_PROMPT = (
    "Eres Jane, una asistente amable y clara. "
    "Respondes en español y de forma concisa."
)