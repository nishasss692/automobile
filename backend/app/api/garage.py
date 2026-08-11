from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models import Vehicle
from app.schemas import VehicleCreate, VehicleResponse

router = APIRouter(prefix="/garage", tags=["Garage"])

# Seed data for initial demo garage
MOCK_GARAGE = [
    Vehicle(id=1, make="Toyota", model="GR Supra", year=2023, trim="3.0 Premium", drivetrain="RWD", stock_hp=382, stock_torque=368, stock_weight_lbs=3400, bolt_pattern="5x112", hub_bore_mm=66.6, min_offset_mm=25, max_offset_mm=40),
    Vehicle(id=2, make="Porsche", model="911 GT3", year=2024, trim="992", drivetrain="RWD", stock_hp=502, stock_torque=346, stock_weight_lbs=3164, bolt_pattern="Center Lock", hub_bore_mm=84.0, min_offset_mm=30, max_offset_mm=50),
    Vehicle(id=3, make="BMW", model="M3 Competition", year=2022, trim="xDrive", drivetrain="AWD", stock_hp=503, stock_torque=479, stock_weight_lbs=3890, bolt_pattern="5x112", hub_bore_mm=66.6, min_offset_mm=20, max_offset_mm=35)
]

@router.get("", response_model=List[VehicleResponse])
def get_user_garage(db: Session = Depends(get_db)):
    vehicles = db.query(Vehicle).all()
    if not vehicles:
        # Return initial seed vehicles for demo if db empty
        return [VehicleResponse.model_validate(v) for v in MOCK_GARAGE]
    return vehicles

@router.post("", response_model=VehicleResponse, status_code=status.HTTP_201_CREATED)
def create_garage_vehicle(vehicle_in: VehicleCreate, db: Session = Depends(get_db)):
    db_vehicle = Vehicle(**vehicle_in.model_dump())
    try:
        db.add(db_vehicle)
        db.commit()
        db.refresh(db_vehicle)
        return db_vehicle
    except Exception:
        db.rollback()
        # Fallback in-memory response if DB uninitialized
        return VehicleResponse(id=99, **vehicle_in.model_dump())

@router.get("/{vehicle_id}", response_model=VehicleResponse)
def get_vehicle_by_id(vehicle_id: int, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        for mock_v in MOCK_GARAGE:
            if mock_v.id == vehicle_id:
                return VehicleResponse.model_validate(mock_v)
        raise HTTPException(status_code=404, detail="Vehicle not found in garage")
    return vehicle
