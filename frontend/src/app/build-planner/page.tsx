'use client';

import React, { useEffect, useState } from 'react';
import { Gauge, Trash2, Zap, DollarSign, Weight, ShieldAlert, Plus } from 'lucide-react';
import Link from 'next/link';
import { useBuildStore } from '../../store/useBuildStore';
import { PerformanceEstimate, estimatePerformance } from '../../lib/api';
import { DynoChart } from '../../components/DynoChart';

export default function BuildPlannerPage() {
  const { selectedVehicle, installedParts, removePartFromBuild, clearBuild } = useBuildStore();
  const [estimate, setEstimate] = useState<PerformanceEstimate | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedVehicle) {
      setLoading(true);
      estimatePerformance(selectedVehicle.id, installedParts.map(p => p.id)).then((data) => {
        setEstimate(data);
        setLoading(false);
      });
    }
  }, [selectedVehicle, installedParts]);

  if (!selectedVehicle) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h2>No Active Vehicle Selected</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>Please select a vehicle from your garage to open the build planner.</p>
        <Link href="/garage" className="btn-primary">Go to Virtual Garage</Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Build <span className="heading-orange">Planner & Dyno Math</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Real-time performance curve simulator for <strong>{selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}</strong>.
        </p>
      </div>

      {/* Metrics Banner */}
      {estimate && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>ESTIMATED HORSEPOWER</span>
            <strong style={{ fontSize: '1.75rem', color: 'var(--accent-cyan)' }} className="font-mono">{estimate.estimated_hp} HP</strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-green)', display: 'block', marginTop: '0.2rem' }}>+{estimate.hp_delta} HP</span>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>PEAK TORQUE</span>
            <strong style={{ fontSize: '1.75rem', color: 'var(--accent-orange)' }} className="font-mono">{estimate.estimated_torque} LB-FT</strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-green)', display: 'block', marginTop: '0.2rem' }}>+{estimate.torque_delta} TQ</span>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>CURB WEIGHT</span>
            <strong style={{ fontSize: '1.75rem' }} className="font-mono">{estimate.total_weight_lbs} lbs</strong>
            <span style={{ fontSize: '0.8rem', color: estimate.weight_delta_lbs <= 0 ? 'var(--accent-green)' : 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
              {estimate.weight_delta_lbs <= 0 ? `${estimate.weight_delta_lbs} lbs` : `+${estimate.weight_delta_lbs} lbs`}
            </span>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>POWER-TO-WEIGHT</span>
            <strong style={{ fontSize: '1.75rem' }} className="font-mono">{estimate.power_to_weight_ratio} HP/1k lbs</strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>Total Cost: ${estimate.total_cost.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Dyno Graph View */}
      <div className="glass-panel-glow" style={{ padding: '1.75rem', borderRadius: '20px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Gauge color="var(--accent-cyan)" size={20} /> Simulated Dyno Engine Powerband
        </h2>
        {estimate ? (
          <DynoChart data={estimate.dyno_curve} stockHp={selectedVehicle.stock_hp} stockTorque={selectedVehicle.stock_torque} />
        ) : (
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Simulating Dyno...</div>
        )}
      </div>

      {/* Installed Parts Stack */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Installed Modifications ({installedParts.length})</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={clearBuild} style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-muted)', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
              Clear All
            </button>
            <Link href="/catalog" className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
              <Plus size={16} /> Browse Parts
            </Link>
          </div>
        </div>

        {installedParts.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No parts added to build yet. Browse the catalog to start modifying!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {installedParts.map((part) => (
              <div key={part.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(0,0,0,0.25)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>{part.category}</span>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{part.name}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{part.brand} | SKU: {part.sku}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: 'var(--accent-green)', fontWeight: 700, display: 'block', fontSize: '0.9rem' }}>+{part.hp_gain} HP</span>
                    <span className="font-mono" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>${part.price.toLocaleString()}</span>
                  </div>
                  <button onClick={() => removePartFromBuild(part.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid var(--accent-red)', color: 'var(--accent-red)', borderRadius: '6px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
