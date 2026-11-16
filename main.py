import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    api_key=os.getenv("GEMINI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL"),
)
MODEL = os.getenv("OPENAI_MODEL") or "gemini-3.5-flash-lite"

messages = [
    {"role": "system", "content": "Eres Jane, una asistente amable y claro. Respondes en español y conciso con tus respuestas."}
]

while True:
    user_input = input("Tú: ").strip()
    if not user_input:
        continue

    if user_input.lower() in ("salir", "exit", "quit"):
        print("Hasta luego!")
        break

    # Agregar nuestros mensajes al historial
    messages.append({"role": "user", "content": user_input})

    response = client.chat.completions.create(
        model=MODEL,
        messages=messages,
    )

    jane_reply = response.choices[0].message.content

    messages.append({"role": "assistant", "content": jane_reply})

    print(f"Asistente: {jane_reply}\n")
