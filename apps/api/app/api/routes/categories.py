from fastapi import APIRouter
from sqlalchemy import select

from app.api.dependencies import DatabaseSession
from app.models.category import WasteCategory
from app.schemas.recycling import CategoryRead

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=list[CategoryRead])
async def list_categories(session: DatabaseSession) -> list[WasteCategory]:
    return list(
        (
            await session.scalars(
                select(WasteCategory).where(WasteCategory.is_active).order_by(WasteCategory.name)
            )
        ).all()
    )
