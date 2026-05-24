from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import uuid

class UserBase(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    bio: Optional[str] = None
    language: str = "es"
    theme_preference: str = "light"

class UpgradeGuestRequest(BaseModel):
    guest_id: str
    email: str
    password: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    language: Optional[str] = None
    theme_preference: Optional[str] = None
    profile_picture: Optional[str] = None

class UserResponse(UserBase):
    id: uuid.UUID
    profile_picture: Optional[str] = None
    is_admin: bool = False
    is_guest: bool = False
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class GuestUserResponse(BaseModel):
    guest_id: uuid.UUID
    name: str
    created_at: Optional[datetime] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class AuthResponse(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    user: UserResponse
