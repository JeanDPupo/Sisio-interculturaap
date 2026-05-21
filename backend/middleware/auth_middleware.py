from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from services.auth_service import verify_token
from typing import Optional

security = HTTPBearer(auto_error=False)

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> Optional[str]:
    """
    Extract and verify JWT token from Authorization header.
    Returns user_id if token is valid, None if no token provided.
    """
    if credentials is None:
        return None

    token = credentials.credentials

    user_id = verify_token(token)
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user_id

async def get_current_admin(
    user_id: Optional[str] = Depends(get_current_user),
) -> str:
    """
    Verify that current user is an admin.
    Raises 403 if not authenticated or not an admin.
    """
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    # TODO: Check user role in database
    # For now, assume admin check will be done in routes

    return user_id
