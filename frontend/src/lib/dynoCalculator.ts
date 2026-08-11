import { Vehicle, Part, DynoPoint } from './api';

export function computeDynoCurve(vehicle: Vehicle, installedParts: Part[]): DynoPoint[] {
  const hpGain = installedParts.reduce((acc, p) => acc + p.hp_gain, 0);
  const tqGain = installedParts.reduce((acc, p) => acc + p.torque_gain, 0);
  
  const finalHp = vehicle.stock_hp + hpGain;
  const finalTq = vehicle.stock_torque + tqGain;

  const rpms = [1000, 2000, 3000, 4000, 5000, 6000, 6800, 7500];

  return rpms.map(rpm => {
    let tqFactor = 0.5;
    if (rpm < 3500) {
      tqFactor = 0.5 + (rpm / 3500) * 0.45;
    } else if (rpm <= 5500) {
      tqFactor = 1.0;
    } else {
      tqFactor = 1.0 - ((rpm - 5500) / 3000) * 0.35;
    }

    const tq = Math.round(finalTq * tqFactor);
    const hp = Math.round((tq * rpm) / 5252);

    return { rpm, hp, torque: tq };
  });
}
