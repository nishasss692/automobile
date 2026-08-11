'use client';

import React from 'react';
import { Check, ShieldCheck } from 'lucide-react';
import { Vehicle } from '../lib/api';
import { useBuildStore } from '../store/useBuildStore';

interface GarageCardProps {
  vehicle: Vehicle;
}

export const GarageCard: React.FC<GarageCardProps> = ({ vehicle }) => {
  const { selectedVehicle, setSelectedVehicle } = useBuildStore();
  const isSelected = selectedVehicle?.id === vehicle.id;

  return (
    <div 
      className={isSelected ? 'glass-panel glass-panel-glow' : 'glass-panel'}
      style={{ padding: '1.5rem', cursor: 'pointer', position: 'relative', border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)' }}
      onClick={() => setSelectedVehicle(vehicle)}
    >
      {isSelected && (
        <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--accent-cyan)', color: '#000', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Check size={16} strokeWidth={3} />
        </div>
      )}

      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-orange)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {vehicle.drivetrain} Layout
      </span>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.25rem 0' }}>
        {vehicle.year} {vehicle.make} {vehicle.model}
      </h2>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
        Trim: {vehicle.trim || 'Standard Base'}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}>
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>STOCK HP</span>
          <strong style={{ fontSize: '1rem' }} className="font-mono">{vehicle.stock_hp}</strong>
        </div>
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>TORQUE</span>
          <strong style={{ fontSize: '1rem' }} className="font-mono">{vehicle.stock_torque}</strong>
        </div>
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>WEIGHT</span>
          <strong style={{ fontSize: '1rem' }} className="font-mono">{vehicle.stock_weight_lbs} lbs</strong>
        </div>
      </div>

      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>PCD Bolt Pattern:</span>
          <strong className="font-mono">{vehicle.bolt_pattern}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Hub Bore:</span>
          <strong className="font-mono">{vehicle.hub_bore_mm} mm</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Offset Window:</span>
          <strong className="font-mono">+{vehicle.min_offset_mm} to +{vehicle.max_offset_mm} mm</strong>
        </div>
      </div>
    </div>
  );
};
