'use client';

import React, { useState } from 'react';
import { Plus, Check, Zap, DollarSign, Weight, Info } from 'lucide-react';
import { Part, checkFitment, FitmentCheckResult } from '../lib/api';
import { FitmentBadge } from './FitmentBadge';
import { useBuildStore } from '../store/useBuildStore';

interface PartCardProps {
  part: Part;
}

export const PartCard: React.FC<PartCardProps> = ({ part }) => {
  const { selectedVehicle, installedParts, addPartToBuild, removePartFromBuild } = useBuildStore();
  const [fitment, setFitment] = useState<FitmentCheckResult | null>(null);
  const [loadingCheck, setLoadingCheck] = useState(false);

  const isInstalled = installedParts.some((p) => p.id === part.id);

  const handleCheckFitment = async () => {
    if (!selectedVehicle) return;
    setLoadingCheck(true);
    const result = await checkFitment(selectedVehicle.id, part.id, installedParts.map(p => p.id));
    setFitment(result);
    setLoadingCheck(false);
  };

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-cyan)', letterSpacing: '0.5px' }}>
            {part.category}
          </span>
          <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            SKU: {part.sku}
          </span>
        </div>

        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.25rem' }}>{part.name}</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>by {part.brand}</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
            <Zap size={14} color="var(--accent-orange)" />
            <span>+{part.hp_gain} HP</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
            <Weight size={14} color="var(--text-secondary)" />
            <span>{part.weight_gain_lbs <= 0 ? `${part.weight_gain_lbs} lbs` : `+${part.weight_gain_lbs} lbs`}</span>
          </div>
        </div>

        {fitment && (
          <div style={{ marginBottom: '0.75rem' }}>
            <FitmentBadge status={fitment.clearance_status} score={fitment.confidence_score} />
            {fitment.warnings.map((w, idx) => (
              <p key={idx} style={{ fontSize: '0.75rem', color: 'var(--accent-orange)', marginTop: '0.35rem' }}>⚠️ {w}</p>
            ))}
            {fitment.reasons.map((r, idx) => (
              <p key={idx} style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>ℹ️ {r}</p>
            ))}
          </div>
        )}
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }} className="font-mono">
            ${part.price.toLocaleString()}
          </span>
          <button 
            onClick={handleCheckFitment}
            disabled={loadingCheck}
            style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.75rem', padding: '0.3rem 0.6rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <Info size={12} />
            {loadingCheck ? 'Checking...' : 'Check Fitment'}
          </button>
        </div>

        {isInstalled ? (
          <button
            onClick={() => removePartFromBuild(part.id)}
            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--accent-green)', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-green)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
          >
            <Check size={16} /> Installed in Build
          </button>
        ) : (
          <button
            onClick={() => addPartToBuild(part)}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <Plus size={16} /> Add to Build
          </button>
        )}
      </div>
    </div>
  );
};
