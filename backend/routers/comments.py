from fastapi import APIRouter, HTTPException, status, Depends
import os
import uuid
from typing import Optional, List
from dotenv import load_dotenv

from models.sighting import CommentCreate, CommentResponse, CommentWithUserResponse
from middleware.auth_middleware import get_current_user

load_dotenv()

router = APIRouter(prefix="/sightings", tags=["comments"])

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

from services.local_client import get_client

def get_supabase_client():
    return get_client()

@router.get("/{sighting_id}/comments", response_model=List[CommentWithUserResponse])
async def get_comments(sighting_id: str):
    """
    Get all comments for a sighting.
    """
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

    # Get comments
    comments_result = supabase.table("comments").select(
        "*, users(name)"
    ).eq("sighting_id", sighting_id).eq("is_approved", True).order(
        "created_at", desc=False
    ).execute()

    if not comments_result.data:
        return []

    return [
        CommentWithUserResponse(
            id=c["id"],
            sighting_id=c["sighting_id"],
            user_id=c.get("user_id"),
            text=c["text"],
            user_name=c.get("users", {}).get("name"),
            is_approved=c.get("is_approved", True),
            created_at=c.get("created_at"),
            updated_at=c.get("updated_at")
        )
        for c in comments_result.data
    ]

@router.post("/{sighting_id}/comments", response_model=CommentResponse)
async def create_comment(
    sighting_id: str,
    comment_data: CommentCreate,
    user_id: str = Depends(get_current_user)
):
    """
    Create a comment on a sighting.
    Requires authentication.
    """
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Must be logged in to comment"
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

    # Create comment
    comment_id = str(uuid.uuid4())

    try:
        result = supabase.table("comments").insert({
            "id": comment_id,
            "sighting_id": sighting_id,
            "user_id": user_id,
            "text": comment_data.text,
        }).execute()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create comment: {str(e)}"
        )

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create comment"
        )

    comment = result.data[0]

    return CommentResponse(
        id=comment["id"],
        sighting_id=comment["sighting_id"],
        user_id=comment.get("user_id"),
        text=comment["text"],
        is_approved=comment.get("is_approved", True),
        created_at=comment.get("created_at"),
        updated_at=comment.get("updated_at")
    )

@router.delete("/{sighting_id}/comments/{comment_id}")
async def delete_comment(
    sighting_id: str,
    comment_id: str,
    user_id: str = Depends(get_current_user)
):
    """
    Delete a comment (only by owner or admin).
    """
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    supabase = get_supabase_client()

    # Check if comment exists
    comment_result = supabase.table("comments").select("*").eq(
        "id", comment_id
    ).eq("sighting_id", sighting_id).execute()

    if not comment_result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )

    comment = comment_result.data[0]

    # Check ownership
    if comment["user_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this comment"
        )

    try:
        supabase.table("comments").delete().eq("id", comment_id).execute()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete comment: {str(e)}"
        )

    return {"message": "Comment deleted successfully"}
