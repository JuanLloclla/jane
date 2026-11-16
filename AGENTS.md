# AGENTS.md

Asistente de chat por terminal en un solo archivo (`main.py`). `openai` se usa solo como
cliente HTTP apuntado al endpoint compatible de Google, así que el modelo real es Gemini
(`gemini-3.5-flash-lite`), no un modelo de OpenAI. No hay paquetes, tests ni CI.

## Ejecutar / verificar

- No hay venv activado: llama al intérprete directamente.
  `.\.venv\Scripts\python.exe main.py` (Python 3.13)
- Es un bucle interactivo por stdin hasta `salir` / `exit` / `quit`, y bloquea en `input()`:
  no lo lances esperando que termine solo.
- Smoke test sin gastar API: `"salir" | .\.venv\Scripts\python.exe main.py`
- No existen tests, linter, formatter ni CI. Ejecutar `main.py` es la única verificación;
  no inventes comandos de `pytest`/`npm`.

## Configuración

- `.env` está en `.gitignore` y contiene una clave real: nunca imprimirlo, ni `git add`,
  ni copiar la clave a otros archivos o logs.
- `GEMINI_API_KEY` la lee `main.py` explícitamente (no es `OPENAI_API_KEY` del SDK).
- `OPENAI_BASE_URL` se pasa explícita a `OpenAI(...)`: si falta, el SDK cae en
  `api.openai.com` en silencio y una clave válida de Gemini falla como error de auth.
- `OPENAI_MODEL` vacío o ausente → fallback a `gemini-3.5-flash-lite` en el código.

## Rarezas

- La capa de compatibilidad de Gemini soporta `chat.completions`; no migrar a
  `client.responses` (no está disponible ahí).
- `requirements.txt` está en UTF-16LE: el lector de archivos y ripgrep lo ven como binario.
  Guardarlo en UTF-8 al editarlo; `pip install -r` sí lo interpreta bien.
- El historial (`messages`) vive en memoria y se reenvía completo en cada turno, así que
  el coste crece con la conversación; reiniciar lo borra.
- Los acentos pueden verse rotos en consolas de Windows PowerShell 5.1 (`Tú` → `T?`):
  es la página de códigos de la consola, no la codificación del código.

## Convenciones

- Textos de cara al usuario y system prompt en español; mantenerlos así.
- Commits: prefijo conventional + asunto en español (`feat: agrego ...`), sobre `develop`.
