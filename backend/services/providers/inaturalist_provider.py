import httpx
from .base import PhotoProvider

class INaturalistProvider(PhotoProvider):
    async def identify(self, img_bytes: bytes) -> str | None:
        async with httpx.AsyncClient() as c:
            resp = await c.post(
                "https://api.inaturalist.org/v1/computervision/score_image",
                files={"image": ("photo.jpg", img_bytes, "image/jpeg")},
                timeout=15
            )
        if resp.status_code != 200:
            return None
        results = resp.json().get("results", [])
        if not results:
            return None
        return results[0].get("taxon", {}).get("name")
