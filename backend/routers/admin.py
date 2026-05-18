from fastapi import APIRouter, HTTPException, status, Depends, Query
from supabase import create_client, Client
import os
from typing import Optional, List
from dotenv import load_dotenv

from models.admin import (
    AdminStatsResponse, AdminSightingResponse, AdminActionResponse
)
from middleware.auth_middleware import get_current_admin

load_dotenv()

router = APIRouter(prefix="/admin", tags=["admin"])

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

def get_supabase_client() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_KEY)

async def check_is_admin(user_id: Optional[str]) -> bool:
    """
    Check if user is admin.
    """
    if user_id is None:
        return False

    supabase = get_supabase_client()

    result = supabase.table("users").select("is_admin").eq("id", user_id).execute()

    if not result.data:
        return False

    return result.data[0].get("is_admin", False)

@router.get("/stats", response_model=AdminStatsResponse)
async def get_admin_stats(
    user_id: Optional[str] = Depends(get_current_admin)
):
    """
    Get administrative statistics.
    Only accessible by admins.
    """
    if not await check_is_admin(user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    supabase = get_supabase_client()

    # Get total users
    users_result = supabase.table("users").select("id", count="exact").execute()
    total_users = users_result.count or 0

    # Get total sightings
    sightings_result = supabase.table("sightings").select("id", count="exact").execute()
    total_sightings = sightings_result.count or 0

    # Get sightings this week
    from datetime import datetime, timedelta
    week_ago = (datetime.utcnow() - timedelta(days=7)).isoformat()
    week_sightings = supabase.table("sightings").select(
        "id", count="exact"
    ).gte("created_at", week_ago).execute()
    sightings_this_week = week_sightings.count or 0

    # Get birds identified (unique)
    birds_result = supabase.table("sightings").select("bird_id").execute()
    unique_birds = len(set([b["bird_id"] for b in birds_result.data])) if birds_result.data else 0

    return AdminStatsResponse(
        total_users=total_users,
        total_sightings=total_sightings,
        total_birds_identified=unique_birds,
        sightings_this_week=sightings_this_week,
        species_distribution={},
        ecosystem_risk_distribution={},
        top_locations={},
        user_engagement={}
    )

@router.get("/sightings", response_model=List[AdminSightingResponse])
async def get_all_sightings_admin(
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    user_id: Optional[str] = Depends(get_current_admin)
):
    """
    Get all sightings for admin review.
    """
    if not await check_is_admin(user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    supabase = get_supabase_client()

    result = supabase.table("sightings").select(
        "*, users(name), aves(nombre_espanol)"
    ).order("created_at", desc=True).limit(limit).offset(offset).execute()

    if not result.data:
        return []

    return [
        AdminSightingResponse(
            id=s["id"],
            user_name=s.get("users", {}).get("name"),
            bird_name=s.get("aves", {}).get("nombre_espanol", "Unknown"),
            location=s["location"],
            confidence=s.get("confidence", 0),
            ecosystem_risk=s.get("ecosystem_risk", "unknown"),
            timestamp=s.get("timestamp"),
            is_approved=s.get("is_approved", False),
            photo_url=s.get("photo_url")
        )
        for s in result.data
    ]

@router.get("/sightings/map")
async def get_sightings_map_admin(
    user_id: Optional[str] = Depends(get_current_admin)
):
    """
    Get all sightings on map view for admin.
    """
    if not await check_is_admin(user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    supabase = get_supabase_client()

    result = supabase.table("sightings").select(
        "id, location, ecosystem_risk, bird_id, timestamp"
    ).execute()

    if not result.data:
        return []

    return [
        {
            "id": s["id"],
            "latitude": s["location"]["latitude"],
            "longitude": s["location"]["longitude"],
            "ecosystem_risk": s.get("ecosystem_risk"),
            "bird_id": s["bird_id"],
            "timestamp": s.get("timestamp"),
        }
        for s in result.data
    ]

@router.post("/moderate/{sighting_id}", response_model=AdminActionResponse)
async def moderate_sighting(
    sighting_id: str,
    action: str = Query(..., regex="^(approve|reject)$"),
    user_id: Optional[str] = Depends(get_current_admin)
):
    """
    Approve or reject a sighting.
    """
    if not await check_is_admin(user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    supabase = get_supabase_client()

    # Check if sighting exists
    sighting_result = supabase.table("sightings").select("*").eq(
        "id", sighting_id
    ).execute()

    if not sighting_result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sighting not found"
        )

    # Update approval status
    is_approved = action == "approve"

    try:
        supabase.table("sightings").update({
            "is_approved": is_approved
        }).eq("id", sighting_id).execute()

        # Log action
        supabase.table("admin_logs").insert({
            "action": f"sighting_{action}",
            "user_id": user_id,
            "target_id": sighting_id,
        }).execute()

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to moderate sighting: {str(e)}"
        )

    return AdminActionResponse(
        success=True,
        message=f"Sighting {action}ed successfully"
    )

@router.get("/moderation")
async def get_flagged_content(
    user_id: Optional[str] = Depends(get_current_admin)
):
    """
    Get flagged content for moderation.
    """
    if not await check_is_admin(user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    supabase = get_supabase_client()

    # Get unapproved sightings
    sightings_result = supabase.table("sightings").select(
        "id, user_id, bird_id, created_at, is_approved"
    ).eq("is_approved", False).execute()

    # Get unapproved comments
    comments_result = supabase.table("comments").select(
        "id, sighting_id, user_id, text, is_approved"
    ).eq("is_approved", False).execute()

    return {
        "flagged_sightings": sightings_result.data or [],
        "flagged_comments": comments_result.data or [],
        "total_flagged": len(sightings_result.data or []) + len(comments_result.data or [])
    }
