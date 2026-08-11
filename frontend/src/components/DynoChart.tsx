'use client';

import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { DynoPoint } from '../lib/api';

interface DynoChartProps {
  data: DynoPoint[];
  stockHp?: number;
  stockTorque?: number;
}

export const DynoChart: React.FC<DynoChartProps> = ({ data }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Loading Dyno Simulator...</div>;
  }

  return (
    <div style={{ width: '100%', height: '340px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="rpm" 
            stroke="var(--text-muted)" 
            tickFormatter={(val) => `${val} RPM`}
            style={{ fontSize: '0.8rem' }}
          />
          <YAxis 
            stroke="var(--text-muted)" 
            unit=" HP / TQ"
            style={{ fontSize: '0.8rem' }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#12161f', borderColor: 'var(--border-color)', borderRadius: '8px', color: '#fff' }}
            labelFormatter={(val) => `Engine Speed: ${val} RPM`}
          />
          <Legend verticalAlign="top" height={36} />
          <Line 
            type="monotone" 
            dataKey="hp" 
            name="Horsepower (HP)" 
            stroke="var(--accent-cyan)" 
            strokeWidth={3}
            dot={{ r: 4, fill: 'var(--accent-cyan)' }} 
            activeDot={{ r: 7 }}
          />
          <Line 
            type="monotone" 
            dataKey="torque" 
            name="Torque (LB-FT)" 
            stroke="var(--accent-orange)" 
            strokeWidth={3}
            dot={{ r: 4, fill: 'var(--accent-orange)' }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
