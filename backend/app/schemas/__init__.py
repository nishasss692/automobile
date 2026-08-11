from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any

class VehicleBase(BaseModel):
    make: str
    model: str
    year: int
    trim: Optional[str] = None
    drivetrain: str = "RWD"
    stock_hp: float = 200.0
    stock_torque: float = 200.0
    stock_weight_lbs: float = 3200.0
    bolt_pattern: str = "5x114.3"
    hub_bore_mm: float = 67.1
    max_offset_mm: float = 45.0
    min_offset_mm: float = 25.0

class VehicleCreate(VehicleBase):
    pass

class VehicleResponse(VehicleBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

class PartBase(BaseModel):
    sku: str
    name: str
    category: str
    brand: str
    price: float
    hp_gain: float = 0.0
    torque_gain: float = 0.0
    weight_gain_lbs: float = 0.0
    bolt_pattern: Optional[str] = None
    offset_mm: Optional[float] = None
    wheel_diameter: Optional[float] = None
    specifications: Optional[Dict[str, Any]] = Field(default_factory=dict)

class PartCreate(PartBase):
    pass

class PartResponse(PartBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

class FitmentCheckRequest(BaseModel):
    vehicle_id: int
    part_id: int
    existing_part_ids: List[int] = []

class FitmentCheckResponse(BaseModel):
    compatible: bool
    confidence_score: float
    reasons: List[str] = []
    warnings: List[str] = []
    clearance_status: str # "PERFECT", "TIGHT", "RUBBING_RISK", "INCOMPATIBLE"

class PerformanceEstimateRequest(BaseModel):
    vehicle_id: int
    installed_part_ids: List[int]

class RPMPoint(BaseModel):
    rpm: int
    hp: float
    torque: float

class PerformanceEstimateResponse(BaseModel):
    estimated_hp: float
    estimated_torque: float
    hp_delta: float
    torque_delta: float
    total_weight_lbs: float
    weight_delta_lbs: float
    total_cost: float
    power_to_weight_ratio: float # HP per 1000 lbs
    dyno_curve: List[RPMPoint]
