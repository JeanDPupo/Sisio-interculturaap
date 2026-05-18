from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
import uuid

class AdminStatsResponse(BaseModel):
    total_users: int
    total_sightings: int
    total_birds_identified: int
    sightings_this_week: int
    species_distribution: Dict[str, int]
    ecosystem_risk_distribution: Dict[str, int]
    top_locations: Dict[str, int]
    user_engagement: Dict[str, Any]

class AdminSightingResponse(BaseModel):
    id: uuid.UUID
    user_name: Optional[str]
    bird_name: str
    location: Dict[str, Any]
    confidence: float
    ecosystem_risk: str
    timestamp: datetime
    is_approved: bool
    photo_url: Optional[str]

class ModerationItemResponse(BaseModel):
    id: uuid.UUID
    type: str
    content: str
    user_name: Optional[str]
    reason_flagged: Optional[str]
    created_at: datetime

class AdminActionResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None
