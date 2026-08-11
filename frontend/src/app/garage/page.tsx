'use client';

import React, { useEffect, useState } from 'react';
import { Car, Plus, ShieldCheck } from 'lucide-react';
import { Vehicle, fetchGarage } from '../../lib/api';
import { GarageCard } from '../../components/GarageCard';

export default function GaragePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGarage().then((data) => {
      setVehicles(data);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Virtual <span className="heading-cyan">Garage</span></h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Select an active vehicle profile to evaluate part fitment and calculate power gains.</p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading Garage Vehicles...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {vehicles.map((v) => (
            <GarageCard key={v.id} vehicle={v} />
          ))}
        </div>
      )}
    </div>
  );
}
