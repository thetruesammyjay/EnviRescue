from fastapi import APIRouter

from app.api.dependencies import CurrentUser
from app.schemas.user import UserRead

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserRead)
async def current_profile(user: CurrentUser) -> UserRead:
    return UserRead.model_validate(user)
