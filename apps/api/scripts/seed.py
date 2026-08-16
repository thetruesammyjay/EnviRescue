"""Seed the initial waste categories and explainable recycling guidance."""

import asyncio

from sqlalchemy import select

from app.core.database import SessionLocal
from app.models.category import RecyclingTip, WasteCategory

CATEGORIES = {
    "Plastic": (True, "Plastic containers and packaging."),
    "Paper": (True, "Paper and cardboard materials."),
    "Glass": (True, "Glass containers and materials."),
    "Metal": (True, "Metal cans and objects."),
    "Organic": (True, "Biological and compostable waste."),
    "Electronic waste": (True, "Batteries and electrical equipment."),
    "Hazardous waste": (False, "Materials that require controlled disposal."),
    "General or mixed waste": (False, "Waste that cannot currently be separated."),
}

TIPS = {
    "Plastic": ["Empty and rinse the item.", "Check the local resin-code rules."],
    "Paper": ["Keep paper clean and dry.", "Flatten cardboard before collection."],
    "Glass": ["Rinse containers.", "Separate broken glass according to local guidance."],
    "Metal": ["Rinse cans and remove food residue."],
    "Organic": ["Use an approved compost or organic-waste container."],
    "Electronic waste": ["Use an approved e-waste collection point."],
    "Hazardous waste": ["Use an authorized hazardous-waste facility."],
    "General or mixed waste": ["Separate recyclable components where it is safe to do so."],
}


async def seed() -> None:
    async with SessionLocal() as session:
        categories: dict[str, WasteCategory] = {}
        for name, (recyclable, description) in CATEGORIES.items():
            category = await session.scalar(select(WasteCategory).where(WasteCategory.name == name))
            if category is None:
                category = WasteCategory(name=name, recyclable=recyclable, description=description)
                session.add(category)
                await session.flush()
            categories[name] = category

        for name, guidance_items in TIPS.items():
            category = categories[name]
            existing = await session.scalars(
                select(RecyclingTip).where(RecyclingTip.category_id == category.id)
            )
            if not existing.first():
                session.add_all(
                    RecyclingTip(category_id=category.id, guidance=item) for item in guidance_items
                )
        await session.commit()


if __name__ == "__main__":
    asyncio.run(seed())
