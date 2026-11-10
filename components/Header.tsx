'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { GlobalSettings } from '@/lib/types';

interface HeaderProps {
  settings?: GlobalSettings;
}

export default function Header({ settings }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [capOpen, setCapOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const toggleTheme = () => {
    const root = document.documentElement;
    const isDark = root.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    if (next === 'light') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', 'dark');
    }
    try {
      localStorage.setItem('bm-theme', next);
    } catch (e) {}
  };

  // Close dropdowns on outside click or escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setAboutOpen(false);
        setCapOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAboutOpen(false);
        setCapOpen(false);
        setMobileOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const closeAll = () => {
    setAboutOpen(false);
    setCapOpen(false);
    setMobileOpen(false);
  };

  const linkedIn = settings?.linkedInUrl || 'https://www.linkedin.com/';
  const email = settings?.contactEmail || 'bbm@birendramishra.com';

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="logo" href="/" aria-label="Birendra Mishra home" onClick={closeAll}>
          <span className="logo-name">{settings?.siteName || 'Birendra Mishra'}</span>
          <span className="logo-tag">{settings?.siteTagline || 'Strategic Financial Leadership'}</span>
        </Link>

        <nav
          className={`nav ${mobileOpen ? 'open' : ''}`}
          id="main-nav"
          aria-label="Primary"
          ref={navRef}
        >
          {/* 1. About (Dropdown) */}
          <div
            className={`nav-item nav-dropdown ${aboutOpen ? 'is-open' : ''}`}
            id="nav-dropdown-about"
          >
            <button
              type="button"
              className="nav-link nav-dropdown-btn"
              aria-expanded={aboutOpen}
              aria-haspopup="true"
              onClick={(e) => {
                e.stopPropagation();
                setAboutOpen(!aboutOpen);
                setCapOpen(false);
              }}
            >
              <span>About</span>
              <svg
                className="nav-chevron"
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <div className="dropdown-menu">
              <Link className="dropdown-item" href="/#birendra" onClick={closeAll}>
                <span className="dropdown-item-title">Executive Profile</span>
                <span className="dropdown-item-desc">Senior executive &amp; strategic capabilities</span>
              </Link>
              <Link className="dropdown-item" href="/#purpose-mission-values" onClick={closeAll}>
                <span className="dropdown-item-title">Purpose, Mission &amp; Values</span>
                <span className="dropdown-item-desc">Core fiduciary &amp; strategic principles</span>
              </Link>
              <Link className="dropdown-item" href="/#aspiration" onClick={closeAll}>
                <span className="dropdown-item-title">Aspiration</span>
                <span className="dropdown-item-desc">Vision for enterprise transformation</span>
              </Link>
            </div>
          </div>

          {/* 2. Capabilities (Dropdown) */}
          <div
            className={`nav-item nav-dropdown ${capOpen ? 'is-open' : ''}`}
            id="nav-dropdown-capabilities"
          >
            <button
              type="button"
              className="nav-link nav-dropdown-btn"
              aria-expanded={capOpen}
              aria-haspopup="true"
              onClick={(e) => {
                e.stopPropagation();
                setCapOpen(!capOpen);
                setAboutOpen(false);
              }}
            >
              <span>Capabilities</span>
              <svg
                className="nav-chevron"
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <div className="dropdown-menu dropdown-menu--capabilities">
              <Link className="dropdown-item" href="/#cap-ma" onClick={closeAll}>
                <span className="dropdown-item-title">M&amp;A</span>
              </Link>
              <Link className="dropdown-item" href="/#cap-ai" onClick={closeAll}>
                <span className="dropdown-item-title">AI in Finance</span>
              </Link>
              <Link className="dropdown-item" href="/#cap-governance" onClick={closeAll}>
                <span className="dropdown-item-title">Capital Allocation &amp; Governance</span>
              </Link>
              <Link className="dropdown-item" href="/#cap-risk" onClick={closeAll}>
                <span className="dropdown-item-title">Risk &amp; Controls</span>
              </Link>
            </div>
          </div>

          <Link href="/insights" onClick={closeAll}>
            Insights
          </Link>
          <Link href="/#solutions" onClick={closeAll}>
            Advisory
          </Link>
          <Link href="/#contact" onClick={closeAll}>
            Contact
          </Link>
        </nav>

        <div className="nav-actions">
          {/* Social Icons (LinkedIn, Email) */}
          <div className="header-socials" aria-label="Connect channels">
            <a
              className="header-social-link"
              id="header-social-linkedin"
              href={linkedIn}
              target="_blank"
              rel="noopener"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24Z" />
              </svg>
            </a>
            <a
              className="header-social-link"
              id="header-social-email"
              href={`mailto:${email}`}
              aria-label="Email"
              title="Direct Email"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </a>
          </div>

          <button
            type="button"
            className="theme-toggle"
            id="theme-toggle"
            aria-label="Toggle dark mode"
            title="Toggle theme"
            onClick={toggleTheme}
          >
            ◐
          </button>
          <button
            type="button"
            className="menu-toggle"
            id="menu-toggle"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}

