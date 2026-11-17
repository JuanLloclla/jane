from openai import OpenAI

from app.config import API_KEY, BASE_URL, MODEL, SYSTEM_PROMPT


class Jane:
    def __init__(self):
        self.client = OpenAI(api_key=API_KEY, base_url=BASE_URL)
        self.messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    def responder(self, texto: str) -> str:
        self.messages.append({"role": "user", "content": texto})

        response = self.client.chat.completions.create(
            model=MODEL,
            messages=self.messages,
        )
        reply = response.choices[0].message.content

        self.messages.append({"role": "assistant", "content": reply})
        return reply

    def historial(self) -> list[dict]:
        # Sin el mensaje system: el frontend no lo necesita
        return [m for m in self.messages if m["role"] != "system"]

    def reiniciar(self) -> None:
        self.messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    def responder_stream(self, texto: str):
        self.messages.append({"role": "user", "content": texto})
        partes: list[str] = []
        try:
            stream = self.client.chat.completions.create(
                model=MODEL,
                messages=self.messages,
                stream=True,
            )
            for chunk in stream:
                if not chunk.choices:
                    continue
                delta = chunk.choices[0].delta.content
                if delta:
                    partes.append(delta)
                    yield delta
        except Exception:
            if not partes:
                self.messages.pop()  # no dejar un mensaje user sin respuesta
            raise
        finally:
            # Guarda la respuesta completa (o parcial si se cortó)
            if partes:
                self.messages.append({"role": "assistant", "content": "".join(partes)})