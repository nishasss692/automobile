'use client';

import React from 'react';
import Link from 'next/link';
import { Gauge, Car, ShieldCheck, ArrowRight, Layers, Cpu, Server, Database, Code2 } from 'lucide-react';
import { useBuildStore } from '../store/useBuildStore';

export default function Home() {
  const { selectedVehicle, installedParts } = useBuildStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', marginTop: '1rem' }}>
      {/* Hero Section */}
      <section className="glass-panel-glow" style={{ padding: '3.5rem 2.5rem', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '650px', zIndex: 1, position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', borderRadius: '20px', background: 'rgba(0, 229, 255, 0.1)', border: '1px solid rgba(0, 229, 255, 0.3)', color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            <Cpu size={16} /> Enterprise Rules & Analytics Stack
          </div>

          <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1rem' }}>
            Precision Automotive Fitment & <span className="heading-cyan">Dyno Performance Math</span>
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
            Calculate bolt pattern clearance, wheel offset windows, part dependencies, and live horsepower & torque curves for your vehicle build.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/build-planner" className="btn-primary">
              <Gauge size={18} /> Open Build Planner
            </Link>
            <Link href="/garage" className="btn-outline">
              <Car size={18} /> Select Vehicle Garage
            </Link>
          </div>
        </div>
      </section>

      {/* Active Vehicle & Quick Stats Banner */}
      {selectedVehicle && (
        <section className="glass-panel" style={{ padding: '1.75rem 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--accent-cyan)', fontWeight: 700 }}>Active Profile</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.2rem 0' }}>
                {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.trim})
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Stock Base: {selectedVehicle.stock_hp} HP | {selectedVehicle.stock_torque} LB-FT | {selectedVehicle.bolt_pattern} PCD
              </p>
            </div>

            <div style={{ display: 'flex', gap: '2rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>INSTALLED MODS</span>
                <strong style={{ fontSize: '1.5rem' }} className="font-mono">{installedParts.length} Parts</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>FITMENT STATUS</span>
                <strong style={{ fontSize: '1.5rem', color: 'var(--accent-green)' }} className="font-mono">Guaranteed</strong>
              </div>
              <Link href="/build-planner" style={{ alignSelf: 'center' }} className="btn-outline">
                Simulate Dyno <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* System Architecture Section */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(0, 229, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--accent-cyan)' }}>
            <Server size={22} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>FastAPI Backend Engine</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            High-performance Python rules engine executing dimensional constraint checking, offset threshold calculation, and part conflict trees.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(255, 107, 0, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--accent-orange)' }}>
            <Database size={22} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>SQLAlchemy & Redis DB</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Structured PostgreSQL database modeling vehicles, part compatibility rules, user builds, and Redis query caching layer.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--accent-green)' }}>
            <Code2 size={22} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Next.js App Router</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Modern React frontend featuring real-time dyno chart visualizations, virtual garage state, and reactive part configuration.
          </p>
        </div>
      </section>
    </div>
  );
}
