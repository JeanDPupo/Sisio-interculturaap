from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import JSONResponse
from supabase import create_client, Client
import os
import uuid
from datetime import timedelta
from dotenv import load_dotenv

from models.user import (
    UserCreate, LoginRequest, AuthResponse, UserResponse,
    GuestUserResponse, UserUpdate, UpgradeGuestRequest
)
from services.auth_service import (
    hash_password, verify_password, create_access_token,
    create_refresh_token, decode_token
)
from middleware.auth_middleware import get_current_user

load_dotenv()

router = APIRouter(prefix="/auth", tags=["auth"])

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", os.getenv("SUPABASE_KEY"))

def get_supabase_client() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_KEY)

@router.post("/register", response_model=AuthResponse)
async def register(user_data: UserCreate):
    """
    Register a new user with email and password.
    """
    supabase = get_supabase_client()

    # Check if user exists
    existing = supabase.table("users").select("*").eq("email", user_data.email).execute()
    if existing.data:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    # Create user
    user_id = str(uuid.uuid4())
    hashed_password = hash_password(user_data.password) if user_data.password else None

    try:
        result = supabase.table("users").insert({
            "id": user_id,
            "email": user_data.email,
            "name": user_data.name,
            "password_hash": hashed_password,
            "language": user_data.language or "es",
            "theme_preference": user_data.theme_preference or "light",
        }).execute()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create user: {str(e)}"
        )

    # Create tokens
    access_token = create_access_token({"sub": user_id})
    refresh_token = create_refresh_token({"sub": user_id})

    user_response = UserResponse(
        id=user_id,
        email=user_data.email,
        name=user_data.name,
        bio=None,
        language=user_data.language or "es",
        theme_preference=user_data.theme_preference or "light",
        profile_picture=None,
        is_admin=False,
        is_guest=False,
        created_at=None,
        updated_at=None
    )

    return AuthResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_response
    )

@router.post("/login", response_model=AuthResponse)
async def login(credentials: LoginRequest):
    """
    Login with email and password.
    """
    supabase = get_supabase_client()

    # Find user
    result = supabase.table("users").select("*").eq("email", credentials.email).execute()
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    user = result.data[0]

    # Verify password
    password_hash = user.get("password_hash")
    if not password_hash or not verify_password(credentials.password, password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    user_id = str(user["id"])

    # Create tokens
    access_token = create_access_token({"sub": user_id})
    refresh_token = create_refresh_token({"sub": user_id})

    user_response = UserResponse(
        id=user_id,
        email=user.get("email"),
        name=user.get("name"),
        bio=user.get("bio"),
        language=user.get("language", "es"),
        theme_preference=user.get("theme_preference", "light"),
        profile_picture=user.get("profile_picture"),
        is_admin=user.get("is_admin", False),
        is_guest=user.get("is_guest", False),
        created_at=user.get("created_at"),
        updated_at=user.get("updated_at")
    )

    return AuthResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_response
    )

@router.post("/guest", response_model=GuestUserResponse)
async def create_guest_user(name: str):
    """
    Create an anonymous guest user.
    """
    supabase = get_supabase_client()

    guest_id = str(uuid.uuid4())
    user_id = str(uuid.uuid4())

    try:
        result = supabase.table("users").insert({
            "id": user_id,
            "name": name,
            "is_guest": True,
            "guest_id": guest_id,
        }).execute()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create guest user: {str(e)}"
        )

    return GuestUserResponse(
        guest_id=guest_id,
        name=name,
        created_at=None
    )

@router.post("/upgrade-guest")
async def upgrade_guest_to_registered(data: UpgradeGuestRequest):
    """
    Convert a guest user to a registered user.
    """
    supabase = get_supabase_client()

    # Find guest user
    result = supabase.table("users").select("*").eq("guest_id", data.guest_id).execute()
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Guest user not found"
        )

    user = result.data[0]
    user_id = str(user["id"])

    hashed_password = hash_password(data.password)

    # Update user
    try:
        supabase.table("users").update({
            "email": data.email,
            "password_hash": hashed_password,
            "is_guest": False,
        }).eq("id", user_id).execute()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upgrade user: {str(e)}"
        )

    # Create tokens
    access_token = create_access_token({"sub": user_id})
    refresh_token = create_refresh_token({"sub": user_id})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "message": "Guest account upgraded successfully"
    }

@router.post("/refresh")
async def refresh_access_token(refresh_token: str):
    """
    Generate a new access token using a refresh token.
    """
    payload = decode_token(refresh_token)
    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

    user_id = payload.get("sub")
    new_access_token = create_access_token({"sub": user_id})

    return {
        "access_token": new_access_token,
        "token_type": "bearer"
    }

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(user_id: str = Depends(get_current_user)):
    """
    Get current user profile.
    """
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    supabase = get_supabase_client()

    result = supabase.table("users").select("*").eq("id", user_id).execute()
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    user = result.data[0]

    return UserResponse(
        id=user_id,
        email=user.get("email"),
        name=user.get("name"),
        bio=user.get("bio"),
        language=user.get("language", "es"),
        theme_preference=user.get("theme_preference", "light"),
        profile_picture=user.get("profile_picture"),
        is_admin=user.get("is_admin", False),
        is_guest=user.get("is_guest", False),
        created_at=user.get("created_at"),
        updated_at=user.get("updated_at")
    )

@router.patch("/me", response_model=UserResponse)
async def update_current_user(
    user_update: UserUpdate,
    user_id: str = Depends(get_current_user)
):
    """
    Update current user profile.
    """
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    supabase = get_supabase_client()

    update_data = user_update.dict(exclude_unset=True)

    try:
        result = supabase.table("users").update(update_data).eq("id", user_id).execute()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update user: {str(e)}"
        )

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    user = result.data[0]

    return UserResponse(
        id=user_id,
        email=user.get("email"),
        name=user.get("name"),
        bio=user.get("bio"),
        language=user.get("language", "es"),
        theme_preference=user.get("theme_preference", "light"),
        profile_picture=user.get("profile_picture"),
        is_admin=user.get("is_admin", False),
        is_guest=user.get("is_guest", False),
        created_at=user.get("created_at"),
        updated_at=user.get("updated_at")
    )

@router.post("/logout")
async def logout(user_id: str = Depends(get_current_user)):
    """
    Logout (client-side token invalidation).
    """
    return {"message": "Logged out successfully"}
