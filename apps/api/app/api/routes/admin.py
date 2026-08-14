from fastapi import APIRouter

from app.api.dependencies import CurrentAdmin
from app.schemas.common import Message

router = APIRouter(prefix="/admin", tags=["administration"])


@router.get("/status", response_model=Message)
async def admin_status(_: CurrentAdmin) -> Message:
    return Message(message="Administrator access confirmed.")
