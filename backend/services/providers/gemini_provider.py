import os
import base64
from google import genai
from .base import PhotoProvider

class GeminiProvider(PhotoProvider):
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not set")
        self.client = genai.Client(api_key=api_key)

    async def identify(self, img_bytes: bytes) -> str | None:
        img_b64 = base64.b64encode(img_bytes).decode()
        response = self.client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[
                "Identify the bird species in this image. Respond with ONLY the scientific name (genus and species), nothing else. Example: 'Ramphastos toco'",
                {"inline_data": {"mime_type": "image/jpeg", "data": img_b64}}
            ]
        )
        name = response.text.strip().strip('"').strip("'")
        return name or None
