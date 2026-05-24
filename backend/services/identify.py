from .providers import get_provider

async def identify_photo(img_bytes: bytes) -> str | None:
    provider = get_provider()
    return await provider.identify(img_bytes)
