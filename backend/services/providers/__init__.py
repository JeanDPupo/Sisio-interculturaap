import os
import logging
from .base import PhotoProvider
from .gemini_provider import GeminiProvider
from .ollama_provider import OllamaProvider
from .inaturalist_provider import INaturalistProvider

logger = logging.getLogger(__name__)

PROVIDERS = {
    "gemini": GeminiProvider,
    "ollama": OllamaProvider,
    "inaturalist": INaturalistProvider,
}

_provider: PhotoProvider | None = None

def get_provider() -> PhotoProvider:
    global _provider
    if _provider is not None:
        return _provider

    name = os.getenv("AI_PHOTO_PROVIDER", "gemini").lower()
    cls = PROVIDERS.get(name)
    if cls is None:
        logger.warning("Unknown AI_PHOTO_PROVIDER '%s', falling back to gemini", name)
        cls = GeminiProvider

    try:
        _provider = cls()
        logger.info("Active photo provider: %s", name)
    except Exception as e:
        logger.error("Failed to init provider '%s': %s, falling back to inaturalist", name, e)
        _provider = INaturalistProvider()

    return _provider
