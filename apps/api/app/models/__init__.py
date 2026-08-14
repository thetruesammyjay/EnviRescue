from app.models.category import RecyclingTip, WasteCategory
from app.models.classification import Classification
from app.models.collection import CollectionSchedule, CollectionZone
from app.models.user import User
from app.models.waste_report import WasteReport

__all__ = [
    "Classification",
    "CollectionSchedule",
    "CollectionZone",
    "RecyclingTip",
    "User",
    "WasteCategory",
    "WasteReport",
]
