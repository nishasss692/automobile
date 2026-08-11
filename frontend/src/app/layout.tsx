import React from 'react';
import './globals.css';
import { Navbar } from '../components/Navbar';

export const metadata = {
  title: 'ModStack Core - Automotive Fitment & Performance Estimator',
  description: 'Precision vehicle part fitment verification, dynamic dyno curve estimation, and virtual garage build planner.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '3rem' }}>
          <Navbar />
          <main style={{ padding: '0 1.5rem' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
