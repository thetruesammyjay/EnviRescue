from fastapi import APIRouter
from sqlalchemy import select

from app.api.dependencies import DatabaseSession
from app.core.cache import cache
from app.models.category import WasteCategory
from app.schemas.recycling import CategoryRead

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=list[CategoryRead])
async def list_categories(session: DatabaseSession) -> list[WasteCategory]:
    cached = cache.get_json("categories:all")
    if isinstance(cached, list):
        return [CategoryRead.model_validate(item) for item in cached]
    items = list(
        (
            await session.scalars(
                select(WasteCategory).where(WasteCategory.is_active).order_by(WasteCategory.name)
            )
        ).all()
    )
    cache.set_json(
        "categories:all",
        [CategoryRead.model_validate(item).model_dump(mode="json") for item in items],
        ttl_seconds=3600,
    )
    return items
