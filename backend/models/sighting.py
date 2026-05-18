from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime
import uuid

class LocationData(BaseModel):
    latitude: float
    longitude: float
    address: Optional[str] = None
    community: Optional[str] = None

class SightingBase(BaseModel):
    bird_id: uuid.UUID
    location: LocationData
    description: Optional[str] = None
    confidence: Optional[float] = None

class SightingCreate(SightingBase):
    photo_url: Optional[str] = None
    audio_url: Optional[str] = None

class SightingUpdate(BaseModel):
    description: Optional[str] = None
    is_approved: Optional[bool] = None

class SightingResponse(SightingBase):
    id: uuid.UUID
    user_id: Optional[uuid.UUID]
    photo_url: Optional[str]
    audio_url: Optional[str]
    ecosystem_risk: Optional[str]
    location_match: Optional[bool]
    is_approved: bool
    timestamp: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class SightingWithBirdResponse(SightingResponse):
    bird: Dict[str, Any]

class SightingGrouped(BaseModel):
    day: Optional[datetime] = None
    bird: Optional[str] = None
    location: Optional[str] = None
    sightings: List[SightingResponse]
    count: int

class CommentBase(BaseModel):
    text: str

class CommentCreate(CommentBase):
    pass

class CommentResponse(CommentBase):
    id: uuid.UUID
    sighting_id: uuid.UUID
    user_id: Optional[uuid.UUID]
    is_approved: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class CommentWithUserResponse(CommentResponse):
    user_name: Optional[str]
