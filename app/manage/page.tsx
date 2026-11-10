'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ManagePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/#contact');
  }, [router]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        fontFamily: 'var(--font-sans)',
        background: 'var(--bg)',
        color: 'var(--ink)',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '1rem' }}>
          Advisory Enquiries
        </h1>
        <p style={{ marginBottom: '2rem', color: 'var(--muted)' }}>
          Redirecting to the contact section...
        </p>
        <Link
          href="/#contact"
          className="btn btn-primary"
          style={{
            background: 'var(--blue-midnight)',
            color: '#fff',
            padding: '0.8rem 1.6rem',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: 600,
          }}
        >
          Go to Contact
        </Link>
      </div>
    </div>
  );
}

