from fastapi import APIRouter
from sqlalchemy import select

from app.api.dependencies import DatabaseSession
from app.core.cache import cache
from app.models.category import RecyclingTip, WasteCategory
from app.services.recycling_service import DEFAULT_GUIDANCE, guidance_for

router = APIRouter(prefix="/recycling", tags=["recycling"])


@router.get("/tips")
async def all_tips(session: DatabaseSession) -> dict[str, list[str]]:
    cached = cache.get_json("recycling:all")
    if isinstance(cached, dict):
        return cached
    tips = list((await session.scalars(select(RecyclingTip))).all())
    response = DEFAULT_GUIDANCE
    if tips:
        response = {}
        for tip in tips:
            response.setdefault(str(tip.category_id), []).append(tip.guidance)
    cache.set_json("recycling:all", response, ttl_seconds=3600)
    return response


@router.get("/tips/{category}")
async def category_tips(category: str, session: DatabaseSession) -> dict[str, object]:
    item = await session.scalar(select(WasteCategory).where(WasteCategory.name.ilike(category)))
    if item is not None:
        tips = list(
            (
                await session.scalars(
                    select(RecyclingTip).where(RecyclingTip.category_id == item.id)
                )
            ).all()
        )
        if tips:
            return {"category": item.name, "tips": [tip.guidance for tip in tips]}
    return {"category": category, "tips": guidance_for(category)}
