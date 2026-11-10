import React from 'react';
import Link from 'next/link';
import { GlobalSettings } from '@/lib/types';

interface FooterProps {
  settings?: GlobalSettings;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const email = settings?.contactEmail || 'bbm@birendramishra.com';

  return (
    <footer className="site-footer">
      <div className="container footer-container">
        <div className="footer-grid">
          {/* Col 1: Brand & Strategic Identity */}
          <div className="footer-brand">
            <div className="footer-logo-title">{settings?.siteName || 'Birendra Mishra'}</div>
            <div className="footer-logo-sub">{settings?.siteTagline || 'Strategic Financial Leadership'}</div>
            <p className="footer-brand-desc">
              Independent thinking and disciplined executive guidance for complex financial
              decisions and enduring enterprise value.
            </p>
            <div className="footer-brand-contact">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <a href={`mailto:${email}`}>{email}</a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="footer-col">
            <span className="footer-col-heading">Explore</span>
            <nav className="footer-nav" aria-label="Footer navigation">
              <Link href="/#birendra">About</Link>
              <Link href="/#capabilities">Capabilities</Link>
              <Link href="/insights">Insights</Link>
              <Link href="/#solutions">Advisory</Link>
              <Link href="/#contact">Contact</Link>
            </nav>
          </div>

          {/* Col 3: Legal & Governance Links */}
          <div className="footer-col">
            <span className="footer-col-heading">Legal &amp; Policy</span>
            <nav className="footer-nav" aria-label="Legal navigation">
              <Link href="/privacy">Privacy policy</Link>
              <Link href="/terms">Terms of engagement</Link>
            </nav>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <span className="footer-copy">
            © {currentYear} {settings?.siteName || 'Birendra Mishra'}. All rights reserved. Personal
            views expressed here are independent and do not necessarily represent those of any
            employer or client or others.
          </span>
          <span className="footer-tagline">Strategic advisory · Corporate finance · Governance</span>
        </div>
      </div>
    </footer>
  );
}

