'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, ShieldAlert } from 'lucide-react';

interface FitmentBadgeProps {
  status: 'PERFECT' | 'TIGHT' | 'RUBBING_RISK' | 'INCOMPATIBLE';
  score?: number;
}

export const FitmentBadge: React.FC<FitmentBadgeProps> = ({ status, score }) => {
  const configs = {
    PERFECT: { label: 'OEM Guaranteed Fit', color: 'var(--accent-green)', bg: 'rgba(16, 185, 129, 0.15)', icon: CheckCircle2 },
    TIGHT: { label: 'Tight Clearance', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', icon: AlertTriangle },
    RUBBING_RISK: { label: 'Modification Required', color: 'var(--accent-orange)', bg: 'rgba(255, 107, 0, 0.15)', icon: ShieldAlert },
    INCOMPATIBLE: { label: 'Fitment Conflict', color: 'var(--accent-red)', bg: 'rgba(239, 68, 68, 0.15)', icon: XCircle },
  };

  const current = configs[status] || configs.PERFECT;
  const Icon = current.icon;

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem',
      padding: '0.25rem 0.65rem',
      borderRadius: '20px',
      background: current.bg,
      color: current.color,
      border: `1px solid ${current.color}`,
      fontSize: '0.78rem',
      fontWeight: 700
    }}>
      <Icon size={14} />
      <span>{current.label}</span>
      {score !== undefined && <span style={{ opacity: 0.85 }}>({Math.round(score * 100)}%)</span>}
    </div>
  );
};
