from fastapi import APIRouter, HTTPException, status, Depends, Query
import os
import uuid
from datetime import datetime, timedelta
from typing import Optional, List
from dotenv import load_dotenv

from models.sighting import (
    SightingCreate, SightingResponse, SightingUpdate,
    LocationData, SightingGrouped, SightingWithBirdResponse
)
from middleware.auth_middleware import get_current_user
from services.geolocation_service import (
    get_location_info, check_bird_belongs_to_location,
    calculate_ecosystem_risk
)

load_dotenv()

router = APIRouter(prefix="/sightings", tags=["sightings"])

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

from services.local_client import get_client

def get_supabase_client():
    return get_client()

@router.post("/", response_model=SightingResponse)
async def create_sighting(
    sighting_data: SightingCreate,
    user_id: Optional[str] = Depends(get_current_user)
):
    """
    Create a new sighting.
    Can be created by authenticated users or guests.
    """
    supabase = get_supabase_client()

    # Get location info
    location_info = await get_location_info(
        sighting_data.location.latitude,
        sighting_data.location.longitude
    )

    # Get bird info to check ecosystem risk
    bird_result = supabase.table("aves").select("*").eq(
        "id", str(sighting_data.bird_id)
    ).execute()

    if not bird_result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bird not found"
        )

    bird = bird_result.data[0]

    # Calculate ecosystem data
    belongs_to_location = check_bird_belongs_to_location(
        bird.get("zona_geografica"),
        sighting_data.location.latitude,
        sighting_data.location.longitude
    )

    ecosystem_risk = calculate_ecosystem_risk(
        bird.get("zona_geografica"),
        bird.get("es_migratoria", False),
        belongs_to_location
    )

    # Create sighting
    sighting_id = str(uuid.uuid4())

    try:
        result = supabase.table("sightings").insert({
            "id": sighting_id,
            "user_id": user_id,
            "bird_id": str(sighting_data.bird_id),
            "location": {
                "latitude": sighting_data.location.latitude,
                "longitude": sighting_data.location.longitude,
                "address": location_info["address"],
            },
            "photo_url": sighting_data.photo_url,
            "audio_url": sighting_data.audio_url,
            "description": sighting_data.description,
            "confidence": sighting_data.confidence,
            "ecosystem_risk": ecosystem_risk,
            "location_match": belongs_to_location,
        }).execute()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create sighting: {str(e)}"
        )

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create sighting"
        )

    sighting = result.data[0]

    return SightingResponse(
        id=sighting["id"],
        bird_id=sighting["bird_id"],
        location=sighting["location"],
        description=sighting.get("description"),
        confidence=sighting.get("confidence"),
        user_id=sighting.get("user_id"),
        photo_url=sighting.get("photo_url"),
        audio_url=sighting.get("audio_url"),
        ecosystem_risk=sighting.get("ecosystem_risk"),
        location_match=sighting.get("location_match"),
        is_approved=sighting.get("is_approved", False),
        timestamp=sighting.get("timestamp"),
        created_at=sighting.get("created_at"),
        updated_at=sighting.get("updated_at")
    )

@router.get("/", response_model=List[SightingResponse])
async def get_sightings(
    user_id: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    groupby: Optional[str] = Query(None, regex="^(day|bird|location)$"),
    user_auth: Optional[str] = Depends(get_current_user)
):
    """
    Get sightings with optional filtering and grouping.
    If user_id is provided, get sightings for that user.
    """
    supabase = get_supabase_client()

    query = supabase.table("sightings").select("*")

    if user_id:
        query = query.eq("user_id", user_id)

    query = query.order("timestamp", desc=True).limit(limit).offset(offset)

    result = query.execute()

    if not result.data:
        return []

    return [
        SightingResponse(
            id=s["id"],
            bird_id=s["bird_id"],
            location=s["location"],
            description=s.get("description"),
            confidence=s.get("confidence"),
            user_id=s.get("user_id"),
            photo_url=s.get("photo_url"),
            audio_url=s.get("audio_url"),
            ecosystem_risk=s.get("ecosystem_risk"),
            location_match=s.get("location_match"),
            is_approved=s.get("is_approved", False),
            timestamp=s.get("timestamp"),
            created_at=s.get("created_at"),
            updated_at=s.get("updated_at")
        )
        for s in result.data
    ]

@router.get("/map")
async def get_sightings_for_map(
    bounds: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=500)
):
    """
    Get sightings within geographic bounds for map display.
    Bounds format: "lat_min,lon_min,lat_max,lon_max"
    """
    supabase = get_supabase_client()

    result = supabase.table("sightings").select(
        "id, location, bird_id, ecosystem_risk, timestamp"
    ).eq("is_approved", True).limit(limit).execute()

    if not result.data:
        return []

    sightings = result.data

    # Filter by bounds if provided
    if bounds:
        try:
            lat_min, lon_min, lat_max, lon_max = map(float, bounds.split(","))
            sightings = [
                s for s in sightings
                if (lat_min <= s["location"]["latitude"] <= lat_max
                    and lon_min <= s["location"]["longitude"] <= lon_max)
            ]
        except (ValueError, IndexError):
            pass

    return [
        {
            "id": s["id"],
            "latitude": s["location"]["latitude"],
            "longitude": s["location"]["longitude"],
            "bird_id": s["bird_id"],
            "ecosystem_risk": s.get("ecosystem_risk"),
            "timestamp": s.get("timestamp"),
        }
        for s in sightings
    ]

@router.get("/{sighting_id}", response_model=SightingWithBirdResponse)
async def get_sighting(sighting_id: str):
    """
    Get a single sighting with bird details.
    """
    supabase = get_supabase_client()

    sighting_result = supabase.table("sightings").select(
        "*, aves(*)"
    ).eq("id", sighting_id).execute()

    if not sighting_result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sighting not found"
        )

    sighting = sighting_result.data[0]

    return SightingWithBirdResponse(
        id=sighting["id"],
        bird_id=sighting["bird_id"],
        bird=sighting.get("aves", {}),
        location=sighting["location"],
        description=sighting.get("description"),
        confidence=sighting.get("confidence"),
        user_id=sighting.get("user_id"),
        photo_url=sighting.get("photo_url"),
        audio_url=sighting.get("audio_url"),
        ecosystem_risk=sighting.get("ecosystem_risk"),
        location_match=sighting.get("location_match"),
        is_approved=sighting.get("is_approved", False),
        timestamp=sighting.get("timestamp"),
        created_at=sighting.get("created_at"),
        updated_at=sighting.get("updated_at")
    )

@router.patch("/{sighting_id}", response_model=SightingResponse)
async def update_sighting(
    sighting_id: str,
    sighting_update: SightingUpdate,
    user_id: Optional[str] = Depends(get_current_user)
):
    """
    Update a sighting (only by owner or admin).
    """
    supabase = get_supabase_client()

    # Check ownership
    sighting_result = supabase.table("sightings").select("*").eq(
        "id", sighting_id
    ).execute()

    if not sighting_result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sighting not found"
        )

    sighting = sighting_result.data[0]

    if sighting["user_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this sighting"
        )

    # Update sighting
    update_data = sighting_update.dict(exclude_unset=True)

    try:
        result = supabase.table("sightings").update(
            update_data
        ).eq("id", sighting_id).execute()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update sighting: {str(e)}"
        )

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update sighting"
        )

    updated_sighting = result.data[0]

    return SightingResponse(
        id=updated_sighting["id"],
        bird_id=updated_sighting["bird_id"],
        location=updated_sighting["location"],
        description=updated_sighting.get("description"),
        confidence=updated_sighting.get("confidence"),
        user_id=updated_sighting.get("user_id"),
        photo_url=updated_sighting.get("photo_url"),
        audio_url=updated_sighting.get("audio_url"),
        ecosystem_risk=updated_sighting.get("ecosystem_risk"),
        location_match=updated_sighting.get("location_match"),
        is_approved=updated_sighting.get("is_approved", False),
        timestamp=updated_sighting.get("timestamp"),
        created_at=updated_sighting.get("created_at"),
        updated_at=updated_sighting.get("updated_at")
    )

@router.delete("/{sighting_id}")
async def delete_sighting(
    sighting_id: str,
    user_id: Optional[str] = Depends(get_current_user)
):
    """
    Delete a sighting (only by owner or admin).
    """
    supabase = get_supabase_client()

    # Check ownership
    sighting_result = supabase.table("sightings").select("*").eq(
        "id", sighting_id
    ).execute()

    if not sighting_result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sighting not found"
        )

    sighting = sighting_result.data[0]

    if sighting["user_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this sighting"
        )

    try:
        supabase.table("sightings").delete().eq("id", sighting_id).execute()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete sighting: {str(e)}"
        )

    return {"message": "Sighting deleted successfully"}
