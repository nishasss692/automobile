from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import Vehicle, Part, CompatibilityRule
from app.schemas import FitmentCheckRequest, FitmentCheckResponse
from app.engine.fitment_engine import FitmentEngine
from app.api.garage import MOCK_GARAGE

router = APIRouter(prefix="/fitment-check", tags=["Fitment Check"])

MOCK_PARTS_DB = {
    101: Part(id=101, sku="EXH-SUP-01", name="Armytrix Titanium Valvetronic Exhaust", category="Exhaust", brand="Armytrix", price=3450.0, hp_gain=24.5, torque_gain=28.0, weight_gain_lbs=-18.0, specifications={}),
    102: Part(id=102, sku="TUR-B58-02", name="Pure800 Upgraded Turbocharger", category="Turbocharger", brand="Pure Turbos", price=2600.0, hp_gain=110.0, torque_gain=95.0, weight_gain_lbs=2.0, specifications={}),
    103: Part(id=103, sku="WHL-FOR-03", name="Forgeline VX1R Monoblock Wheels 19x9.5", category="Wheels", brand="Forgeline", price=4200.0, hp_gain=0.0, torque_gain=0.0, weight_gain_lbs=-24.0, bolt_pattern="5x112", offset_mm=32.0, specifications={}),
    104: Part(id=104, sku="WHL-BAD-04", name="Rotiform LAS-R 20x10.5 (Off-Spec)", category="Wheels", brand="Rotiform", price=1800.0, hp_gain=0.0, torque_gain=0.0, weight_gain_lbs=5.0, bolt_pattern="5x120", offset_mm=15.0, specifications={}),
    105: Part(id=105, sku="ECU-MHT-05", name="bootmod3 Stage 2 Custom ECU Tune", category="ECU", brand="ProTuningFreaks", price=595.0, hp_gain=65.0, torque_gain=75.0, weight_gain_lbs=0.0, specifications={})
}

@router.post("", response_model=FitmentCheckResponse)
def check_part_fitment(payload: FitmentCheckRequest, db: Session = Depends(get_db)):
    # 1. Fetch Vehicle
    vehicle = db.query(Vehicle).filter(Vehicle.id == payload.vehicle_id).first()
    if not vehicle:
        vehicle = next((v for v in MOCK_GARAGE if v.id == payload.vehicle_id), None)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    # 2. Fetch Target Part
    part = db.query(Part).filter(Part.id == payload.part_id).first()
    if not part:
        part = MOCK_PARTS_DB.get(payload.part_id)
    if not part:
        raise HTTPException(status_code=404, detail="Part not found")

    # 3. Fetch Existing Installed Parts
    existing_parts = []
    if payload.existing_part_ids:
        for pid in payload.existing_part_ids:
            p = db.query(Part).filter(Part.id == pid).first() or MOCK_PARTS_DB.get(pid)
            if p:
                existing_parts.append(p)

    # 4. Fetch Compatibility Rules
    rules = db.query(CompatibilityRule).filter(CompatibilityRule.part_id == part.id).all()

    # 5. Evaluate via FitmentEngine
    return FitmentEngine.evaluate_fitment(vehicle, part, existing_parts, rules)
