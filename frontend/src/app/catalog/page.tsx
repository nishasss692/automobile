'use client';

import React, { useEffect, useState } from 'react';
import { Search, Filter, ShoppingBag } from 'lucide-react';
import { Part, fetchCatalog } from '../../lib/api';
import { PartCard } from '../../components/PartCard';

export default function CatalogPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCatalog().then((data) => {
      setParts(data);
      setLoading(false);
    });
  }, []);

  const categories = ['ALL', 'Exhaust', 'Turbocharger', 'Wheels', 'ECU', 'Suspension'];

  const filteredParts = parts.filter((part) => {
    const matchesCategory = selectedCategory === 'ALL' || part.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = part.name.toLowerCase().includes(search.toLowerCase()) || 
                          part.brand.toLowerCase().includes(search.toLowerCase()) || 
                          part.sku.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Parts <span className="heading-cyan">Catalog</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Browse high performance aftermarket parts verified against active vehicle specs.</p>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search parts by name, brand, or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.5rem',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              background: 'rgba(18, 22, 31, 0.8)',
              color: '#fff',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.6rem 1rem',
                borderRadius: '8px',
                border: selectedCategory === cat ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                background: selectedCategory === cat ? 'rgba(0, 229, 255, 0.15)' : 'rgba(255,255,255,0.03)',
                color: selectedCategory === cat ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                fontWeight: selectedCategory === cat ? 700 : 500,
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading Parts Catalog...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filteredParts.map((p) => (
            <PartCard key={p.id} part={p} />
          ))}
        </div>
      )}
    </div>
  );
}
