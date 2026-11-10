import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found | Birendra Mishra',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
      <div className="container narrow center">
        <p className="eyebrow">404</p>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', margin: '0.5rem 0 1rem' }}>
          Page not found
        </h1>
        <p className="lead" style={{ marginInline: 'auto' }}>
          The page you requested is not available. Return home or start a conversation.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
          <Link className="btn btn-primary" href="/">
            Home
          </Link>
          <Link className="btn btn-gold" href="/#contact">
            Start a conversation
          </Link>
        </div>
      </div>
    </main>
  );
}

