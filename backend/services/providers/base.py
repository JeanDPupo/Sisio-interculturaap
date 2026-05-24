from abc import ABC, abstractmethod

class PhotoProvider(ABC):
    @abstractmethod
    async def identify(self, img_bytes: bytes) -> str | None:
        ...
