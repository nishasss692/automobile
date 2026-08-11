import pytest
from app.models import Vehicle, Part, CompatibilityRule
from app.engine.fitment_engine import FitmentEngine

@pytest.fixture
def sample_vehicle():
    return Vehicle(
        id=1,
        make="Toyota",
        model="GR Supra",
        year=2023,
        trim="3.0 Premium",
        drivetrain="RWD",
        stock_hp=382.0,
        stock_torque=368.0,
        stock_weight_lbs=3400.0,
        bolt_pattern="5x112",
        hub_bore_mm=66.6,
        min_offset_mm=25.0,
        max_offset_mm=40.0
    )

@pytest.fixture
def sample_wheel_compatible():
    return Part(
        id=101,
        sku="WHL-COMPAT",
        name="Forged Track Wheels 19x9.5",
        category="Wheels",
        brand="Titan7",
        price=2200.0,
        bolt_pattern="5x112",
        offset_mm=32.0
    )

@pytest.fixture
def sample_wheel_incompatible_pcd():
    return Part(
        id=102,
        sku="WHL-INCOMPAT",
        name="Custom Wheels 5x120",
        category="Wheels",
        brand="Apex",
        price=1800.0,
        bolt_pattern="5x120",
        offset_mm=35.0
    )

def test_evaluate_fitment_compatible_wheel(sample_vehicle, sample_wheel_compatible):
    res = FitmentEngine.evaluate_fitment(sample_vehicle, sample_wheel_compatible)
    assert res.compatible is True
    assert res.clearance_status == "PERFECT"
    assert res.confidence_score >= 0.9

def test_evaluate_fitment_incompatible_pcd(sample_vehicle, sample_wheel_incompatible_pcd):
    res = FitmentEngine.evaluate_fitment(sample_vehicle, sample_wheel_incompatible_pcd)
    assert res.compatible is False
    assert res.clearance_status == "INCOMPATIBLE"
    assert any("Bolt pattern mismatch" in reason for reason in res.reasons)

def test_calculate_performance(sample_vehicle):
    parts = [
        Part(id=1, sku="EXH-1", name="Exhaust System", category="Exhaust", brand="AWE", price=1500.0, hp_gain=18.0, torque_gain=20.0, weight_gain_lbs=-12.0),
        Part(id=2, sku="ECU-1", name="Stage 1 Tune", category="ECU", brand="MHD", price=500.0, hp_gain=45.0, torque_gain=55.0, weight_gain_lbs=0.0)
    ]
    res = FitmentEngine.calculate_performance(sample_vehicle, parts)
    
    assert res.estimated_hp > sample_vehicle.stock_hp
    assert res.hp_delta == round(res.estimated_hp - sample_vehicle.stock_hp, 1)
    assert len(res.dyno_curve) == 8
    assert res.dyno_curve[0].rpm == 1000
    assert res.dyno_curve[-1].rpm == 7500
