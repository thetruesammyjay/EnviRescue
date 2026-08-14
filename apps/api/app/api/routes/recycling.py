from fastapi import APIRouter

from app.services.recycling_service import DEFAULT_GUIDANCE, guidance_for

router = APIRouter(prefix="/recycling", tags=["recycling"])


@router.get("/tips")
async def all_tips() -> dict[str, list[str]]:
    return DEFAULT_GUIDANCE


@router.get("/tips/{category}")
async def category_tips(category: str) -> dict[str, object]:
    return {"category": category, "tips": guidance_for(category)}
