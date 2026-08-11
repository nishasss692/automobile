from fastapi import APIRouter
from app.api.garage import router as garage_router
from app.api.fitment_check import router as fitment_router
from app.api.analytics import router as analytics_router
from app.api.catalog import router as catalog_router

api_router = APIRouter()
api_router.include_router(garage_router)
api_router.include_router(fitment_router)
api_router.include_router(analytics_router)
api_router.include_router(catalog_router)
