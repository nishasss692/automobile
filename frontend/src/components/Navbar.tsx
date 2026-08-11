'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Car, Gauge, ShoppingBag, Cpu } from 'lucide-react';
import { useBuildStore } from '../store/useBuildStore';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { selectedVehicle } = useBuildStore();

  const links = [
    { name: 'Dashboard', href: '/', icon: Cpu },
    { name: 'Virtual Garage', href: '/garage', icon: Car },
    { name: 'Build Planner', href: '/build-planner', icon: Gauge },
    { name: 'Catalog', href: '/catalog', icon: ShoppingBag },
  ];

  return (
    <header className="glass-panel" style={{ margin: '1rem', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 50, position: 'sticky', top: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ background: 'linear-gradient(135deg, #00e5ff 0%, #ff6b00 100%)', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Gauge size={22} color="#000" />
        </div>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.5px' }}>
            MODSTACK <span style={{ color: 'var(--accent-cyan)' }}>CORE</span>
          </span>
        </Link>
      </div>

      <nav style={{ display: 'flex', gap: '1.5rem' }}>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                textDecoration: 'none',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.95rem',
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                background: isActive ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
                transition: 'all 0.2s'
              }}
            >
              <Icon size={18} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {selectedVehicle && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.75rem', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
          <Car size={16} color="var(--accent-orange)" />
          <span>Active: <strong>{selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}</strong></span>
        </div>
      )}
    </header>
  );
};
