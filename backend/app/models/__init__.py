from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    make = Column(String(50), nullable=False)
    model = Column(String(50), nullable=False)
    year = Column(Integer, nullable=False)
    trim = Column(String(50), nullable=True)
    drivetrain = Column(String(20), default="RWD") # RWD, FWD, AWD
    stock_hp = Column(Float, default=200.0)
    stock_torque = Column(Float, default=200.0)
    stock_weight_lbs = Column(Float, default=3200.0)
    bolt_pattern = Column(String(20), default="5x114.3") # e.g. 5x114.3, 5x120
    hub_bore_mm = Column(Float, default=67.1)
    max_offset_mm = Column(Float, default=45.0)
    min_offset_mm = Column(Float, default=25.0)

    builds = relationship("Build", back_populates="vehicle")

class Part(Base):
    __tablename__ = "parts"

    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False) # Exhaust, Intake, Turbo, Wheels, Suspension, ECU
    brand = Column(String(50), nullable=False)
    price = Column(Float, nullable=False)
    hp_gain = Column(Float, default=0.0)
    torque_gain = Column(Float, default=0.0)
    weight_gain_lbs = Column(Float, default=0.0)
    
    # Wheel/Fitment Specs (if category == Wheels or Brakes)
    bolt_pattern = Column(String(20), nullable=True)
    offset_mm = Column(Float, nullable=True)
    wheel_diameter = Column(Float, nullable=True)

    # JSON Metadata for rule engine
    specifications = Column(JSON, default={})

class CompatibilityRule(Base):
    __tablename__ = "compatibility_rules"

    id = Column(Integer, primary_key=True, index=True)
    part_id = Column(Integer, ForeignKey("parts.id"), nullable=False)
    target_make = Column(String(50), nullable=True)
    target_model = Column(String(50), nullable=True)
    min_year = Column(Integer, nullable=True)
    max_year = Column(Integer, nullable=True)
    is_universal = Column(Boolean, default=False)
    required_part_category = Column(String(50), nullable=True) # e.g. Turbo requires ECU Tune
    conflicting_part_category = Column(String(50), nullable=True)

class Build(Base):
    __tablename__ = "builds"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False)
    created_at = Column(String(30), nullable=True)

    vehicle = relationship("Vehicle", back_populates="builds")
    parts = relationship("BuildPart", back_populates="build", cascade="all, delete-orphan")

class BuildPart(Base):
    __tablename__ = "build_parts"

    id = Column(Integer, primary_key=True, index=True)
    build_id = Column(Integer, ForeignKey("builds.id"), nullable=False)
    part_id = Column(Integer, ForeignKey("parts.id"), nullable=False)

    build = relationship("Build", back_populates="parts")
    part = relationship("Part")
