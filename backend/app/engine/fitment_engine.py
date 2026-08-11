from typing import List, Dict, Any, Tuple
from app.models import Vehicle, Part, CompatibilityRule
from app.schemas import FitmentCheckResponse, PerformanceEstimateResponse, RPMPoint

class FitmentEngine:
    """
    ModStack Rules & Analytics Engine
    Evaluates physical fitment, clearance limits, part dependencies/conflicts,
    and calculates estimated performance curves.
    """

    @staticmethod
    def evaluate_fitment(
        vehicle: Vehicle, 
        part: Part, 
        existing_parts: List[Part] = None,
        rules: List[CompatibilityRule] = None
    ) -> FitmentCheckResponse:
        existing_parts = existing_parts or []
        reasons = []
        warnings = []
        compatible = True
        clearance_status = "PERFECT"
        score = 1.0

        # 1. Bolt Pattern Check (for Wheels/Hubs)
        if part.category in ["Wheels", "Brakes"] and part.bolt_pattern:
            if part.bolt_pattern != vehicle.bolt_pattern:
                compatible = False
                score -= 0.5
                reasons.append(f"Bolt pattern mismatch: Part requires {part.bolt_pattern}, vehicle has {vehicle.bolt_pattern}.")
                clearance_status = "INCOMPATIBLE"

        # 2. Offset Clearance Check
        if part.category == "Wheels" and part.offset_mm is not None:
            if part.offset_mm < vehicle.min_offset_mm:
                warnings.append(f"Aggressive offset ({part.offset_mm}mm < min {vehicle.min_offset_mm}mm). Fender rolling may be required.")
                clearance_status = "RUBBING_RISK"
                score -= 0.15
            elif part.offset_mm > vehicle.max_offset_mm:
                warnings.append(f"High offset ({part.offset_mm}mm > max {vehicle.max_offset_mm}mm). Risk of inner strut/caliper clearance issues.")
                clearance_status = "TIGHT"
                score -= 0.1

        # 3. Vehicle Make/Model Bounds Check
        if rules:
            for rule in rules:
                if rule.part_id == part.id:
                    if rule.target_make and rule.target_make.lower() != vehicle.make.lower():
                        compatible = False
                        reasons.append(f"Part designated for {rule.target_make}, not {vehicle.make}.")
                        score = 0.0
                    if rule.min_year and vehicle.year < rule.min_year:
                        compatible = False
                        reasons.append(f"Part requires year >= {rule.min_year} (vehicle is {vehicle.year}).")
                        score = 0.0
                    if rule.max_year and vehicle.year > rule.max_year:
                        compatible = False
                        reasons.append(f"Part requires year <= {rule.max_year} (vehicle is {vehicle.year}).")
                        score = 0.0

        # 4. Dependency / Conflict Check with existing installed parts
        existing_categories = [p.category for p in existing_parts]
        
        # High power turbo requires supporting fuel mods
        if part.category == "Turbocharger" and "Fuel System" not in existing_categories:
            warnings.append("Upgraded turbocharger detected without upgraded fuel injectors/pump. ECU tune & fuel upgrades highly recommended.")

        # Duplicate single-slot parts check
        if part.category in ["Exhaust", "Intake", "ECU"] and part.category in existing_categories:
            warnings.append(f"A component in category '{part.category}' is already installed in this build.")

        if compatible and score >= 0.9:
            reasons.append(f"Direct OEM fitment confirmed for {vehicle.year} {vehicle.make} {vehicle.model}.")

        return FitmentCheckResponse(
            compatible=compatible,
            confidence_score=max(0.0, round(score, 2)),
            reasons=reasons,
            warnings=warnings,
            clearance_status=clearance_status
        )

    @staticmethod
    def calculate_performance(
        vehicle: Vehicle,
        installed_parts: List[Part]
    ) -> PerformanceEstimateResponse:
        base_hp = vehicle.stock_hp
        base_tq = vehicle.stock_torque
        base_wt = vehicle.stock_weight_lbs

        hp_gain_sum = sum(p.hp_gain for p in installed_parts)
        tq_gain_sum = sum(p.torque_gain for p in installed_parts)
        wt_gain_sum = sum(p.weight_gain_lbs for p in installed_parts)
        total_cost = sum(p.price for p in installed_parts)

        # Compound efficiency multiplier if tune/ECU + bolt-ons exist
        categories = set(p.category for p in installed_parts)
        mult = 1.15 if ("ECU" in categories and len(categories) > 2) else 1.0

        final_hp = round(base_hp + (hp_gain_sum * mult), 1)
        final_tq = round(base_tq + (tq_gain_sum * mult), 1)
        final_wt = round(base_wt + wt_gain_sum, 1)

        hp_delta = round(final_hp - base_hp, 1)
        tq_delta = round(final_tq - base_tq, 1)
        
        p2w = round((final_hp / final_wt) * 1000, 1)

        # Dyno Curve Generation (1000 RPM to 7500 RPM)
        dyno_points = []
        rpms = [1000, 2000, 3000, 4000, 5000, 6000, 6800, 7500]
        
        for rpm in rpms:
            # Typical torque bell curve scaling factor
            if rpm < 3500:
                tq_factor = 0.5 + (rpm / 3500.0) * 0.45
            elif rpm <= 5500:
                tq_factor = 1.0 # Peak torque window
            else:
                tq_factor = 1.0 - ((rpm - 5500) / 3000.0) * 0.35

            cur_tq = round(final_tq * tq_factor, 1)
            # HP = (Torque * RPM) / 5252
            cur_hp = round((cur_tq * rpm) / 5252.0, 1)
            
            dyno_points.append(RPMPoint(rpm=rpm, hp=cur_hp, torque=cur_tq))

        return PerformanceEstimateResponse(
            estimated_hp=final_hp,
            estimated_torque=final_tq,
            hp_delta=hp_delta,
            torque_delta=tq_delta,
            total_weight_lbs=final_wt,
            weight_delta_lbs=wt_gain_sum,
            total_cost=round(total_cost, 2),
            power_to_weight_ratio=p2w,
            dyno_curve=dyno_points
        )
