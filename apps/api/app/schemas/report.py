from datetime import date

from pydantic import BaseModel, Field


class CategoryTotal(BaseModel):
    category: str
    quantity_kg: float


class DashboardSummary(BaseModel):
    total_quantity_kg: float = 0
    report_count: int = 0
    recyclable_percentage: float = Field(default=0, ge=0, le=100)
    categories: list[CategoryTotal] = []


class ReportFilters(BaseModel):
    start_date: date | None = None
    end_date: date | None = None
    category: str | None = None


class WasteActivityReport(DashboardSummary):
    start_date: date | None = None
    end_date: date | None = None
