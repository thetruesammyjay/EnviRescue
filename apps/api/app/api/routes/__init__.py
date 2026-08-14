from fastapi import APIRouter

from app.api.routes import admin, auth, categories, classifications, collections, dashboard, recycling, reports, users, waste

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(waste.router)
api_router.include_router(classifications.router)
api_router.include_router(categories.router)
api_router.include_router(recycling.router)
api_router.include_router(collections.router)
api_router.include_router(dashboard.router)
api_router.include_router(reports.router)
api_router.include_router(admin.router)
