import { create } from 'zustand';
import { Vehicle, Part } from '../lib/api';

interface BuildState {
  selectedVehicle: Vehicle | null;
  installedParts: Part[];
  setSelectedVehicle: (vehicle: Vehicle) => void;
  addPartToBuild: (part: Part) => void;
  removePartFromBuild: (partId: number) => void;
  clearBuild: () => void;
}

export const useBuildStore = create<BuildState>((set) => ({
  selectedVehicle: {
    id: 1,
    make: 'Toyota',
    model: 'GR Supra',
    year: 2023,
    trim: '3.0 Premium',
    drivetrain: 'RWD',
    stock_hp: 382,
    stock_torque: 368,
    stock_weight_lbs: 3400,
    bolt_pattern: '5x112',
    hub_bore_mm: 66.6,
    min_offset_mm: 25,
    max_offset_mm: 40
  },
  installedParts: [
    { id: 101, sku: 'EXH-SUP-01', name: 'Armytrix Titanium Valvetronic Exhaust', category: 'Exhaust', brand: 'Armytrix', price: 3450.0, hp_gain: 24.5, torque_gain: 28.0, weight_gain_lbs: -18.0 },
    { id: 105, sku: 'ECU-MHT-05', name: 'bootmod3 Stage 2 Custom ECU Tune', category: 'ECU', brand: 'ProTuningFreaks', price: 595.0, hp_gain: 65.0, torque_gain: 75.0, weight_gain_lbs: 0.0 }
  ],
  setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
  addPartToBuild: (part) => set((state) => ({
    installedParts: state.installedParts.some(p => p.id === part.id)
      ? state.installedParts
      : [...state.installedParts, part]
  })),
  removePartFromBuild: (partId) => set((state) => ({
    installedParts: state.installedParts.filter(p => p.id !== partId)
  })),
  clearBuild: () => set({ installedParts: [] })
}));
