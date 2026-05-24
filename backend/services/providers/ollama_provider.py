import base64
import httpx
from .base import PhotoProvider

OLLAMA_URL = "http://localhost:11434"

class OllamaProvider(PhotoProvider):
    def __init__(self, model: str = "moondream"):
        self.model = model

    async def identify(self, img_bytes: bytes) -> str | None:
        img_b64 = base64.b64encode(img_bytes).decode()
        payload = {
            "model": self.model,
            "prompt": "Identify the bird species in this image. Respond with ONLY the scientific name (genus and species), nothing else. Example: 'Ramphastos toco'",
            "images": [img_b64],
            "stream": False,
        }
        async with httpx.AsyncClient() as c:
            resp = await c.post(f"{OLLAMA_URL}/api/generate", json=payload, timeout=30)
        if resp.status_code != 200:
            return None
        data = resp.json()
        name = data.get("response", "").strip().strip('"').strip("'")
        return name or None
