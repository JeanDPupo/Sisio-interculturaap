import os
import base64
from google import genai

_client = None

def _get_client():
    global _client
    if _client is None:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not set in .env")
        _client = genai.Client(api_key=api_key)
    return _client

async def identify(img_bytes: bytes) -> str | None:
    """
    Identifica un ave desde una imagen usando Gemini Vision API.
    Retorna el nombre científico de la especie.
    """
    c = _get_client()
    img_b64 = base64.b64encode(img_bytes).decode()

    response = c.models.generate_content(
        model="gemini-2.0-flash",
        contents=[
            "Identify the bird species in this image. Respond with ONLY the scientific name (genus and species), nothing else. Example: 'Ramphastos toco'",
            {"inline_data": {"mime_type": "image/jpeg", "data": img_b64}}
        ]
    )

    name = response.text.strip().strip('"').strip("'")
    if not name:
        return None
    return name
