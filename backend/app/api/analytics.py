from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import Vehicle, Part
from app.schemas import PerformanceEstimateRequest, PerformanceEstimateResponse
from app.engine.fitment_engine import FitmentEngine
from app.api.garage import MOCK_GARAGE
from app.api.fitment_check import MOCK_PARTS_DB

router = APIRouter(prefix="/analytics", tags=["Analytics & Performance Estimator"])

@router.post("/estimate", response_model=PerformanceEstimateResponse)
def estimate_build_performance(payload: PerformanceEstimateRequest, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == payload.vehicle_id).first()
    if not vehicle:
        vehicle = next((v for v in MOCK_GARAGE if v.id == payload.vehicle_id), None)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    installed_parts = []
    for pid in payload.installed_part_ids:
        p = db.query(Part).filter(Part.id == pid).first() or MOCK_PARTS_DB.get(pid)
        if p:
            installed_parts.append(p)

    return FitmentEngine.calculate_performance(vehicle, installed_parts)
