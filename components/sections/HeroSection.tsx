import React from 'react';
import { HeroSectionData } from '@/lib/types';

interface HeroProps {
  data?: HeroSectionData;
}

export default function HeroSection({ data }: HeroProps) {
  const eyebrow = data?.eyebrow || 'Strategic Financial Leadership';
  const description =
    data?.description ||
    'Strategic financial leadership for complex decisions, international growth and enduring enterprise value.';
  const ctaText = data?.ctaText || 'Explore advisory';
  const ctaUrl = data?.ctaUrl || '#solutions';

  const focusLabel = data?.focusLabel || 'Focus';
  const focusValue = data?.focusValue || 'Global Financial Strategy';

  const coreLabel = data?.coreLabel || 'Core';
  const coreValue = data?.coreValue || 'Upstream Oil&Gas Finance,\nM&A and Capital Governance';

  const experienceLabel = data?.experienceLabel || 'Experience';
  const experienceValue = data?.experienceValue || '20+ years international';

  const engagementLabel = data?.engagementLabel || 'Engagement';
  const engagementValue = data?.engagementValue || 'Selective Advisory & Board';

  const discretionLabel = data?.discretionLabel || 'Discretion';
  const discretionValue = data?.discretionValue || 'Board-level confidentiality';

  const defaultTrustItems = [
    { text: '20+ years of international experience' },
    { text: 'Independent strategic perspective' },
    { text: 'Confidential executive advisory' },
  ];
  const trustItems = data?.trustItems && data.trustItems.length > 0 ? data.trustItems : defaultTrustItems;

  return (
    <section className="hero" aria-label="Strategic Financial Leadership">
      <div className="container hero-container">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span className="eyebrow-line" aria-hidden="true"></span>
              <span className="eyebrow-text">{eyebrow}</span>
            </div>
            <h1 className="hero-title">
              {data?.titlePrefix ? (
                <>
                  {data.titlePrefix}{' '}
                  {data.titleHighlight && <em className="hero-highlight">{data.titleHighlight}</em>}
                </>
              ) : (
                <>
                  Clarity for your <br className="mobile-break" />next <br className="desktop-break" />
                  <em className="hero-highlight">chapter.</em>
                </>
              )}
            </h1>
            <p className="hero-description">{description}</p>
            <div className="hero-actions">
              <a className="btn btn-hero-primary" href={ctaUrl}>
                <span>{ctaText}</span>
                <svg
                  className="btn-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          <aside className="hero-info-card" aria-label="At a glance">
            <div className="info-card-header">
              <span className="info-card-tag">At a glance</span>
              <span className="info-card-line" aria-hidden="true"></span>
            </div>
            <div className="info-card-rows">
              <div className="info-row">
                <div className="info-label">
                  <svg
                    className="info-icon"
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
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                  </svg>
                  <span>{focusLabel}</span>
                </div>
                <strong className="info-val">{focusValue}</strong>
              </div>

              <div className="info-row">
                <div className="info-label">
                  <svg
                    className="info-icon"
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
                    <line x1="18" x2="18" y1="20" y2="10" />
                    <line x1="12" x2="12" y1="20" y2="4" />
                    <line x1="6" x2="6" y1="20" y2="14" />
                  </svg>
                  <span>{coreLabel}</span>
                </div>
                <strong className="info-val">
                  {coreValue.includes('\n') ? (
                    coreValue.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < coreValue.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))
                  ) : (
                    coreValue
                  )}
                </strong>
              </div>

              <div className="info-row">
                <div className="info-label">
                  <svg
                    className="info-icon"
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
                    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  <span>{experienceLabel}</span>
                </div>
                <strong className="info-val">{experienceValue}</strong>
              </div>

              <div className="info-row">
                <div className="info-label">
                  <svg
                    className="info-icon"
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
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span>{engagementLabel}</span>
                </div>
                <strong className="info-val">{engagementValue}</strong>
              </div>

              <div className="info-row">
                <div className="info-label">
                  <svg
                    className="info-icon"
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
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span>{discretionLabel}</span>
                </div>
                <strong className="info-val">{discretionValue}</strong>
              </div>
            </div>
          </aside>
        </div>

        <div className="hero-trust-row" aria-label="Executive credentials">
          {trustItems.map((item, idx, arr) => (
            <React.Fragment key={idx}>
              <div className="trust-item">
                <span className="trust-bullet" aria-hidden="true"></span>
                <span>{item.text}</span>
              </div>
              {idx < arr.length - 1 && <span className="trust-sep" aria-hidden="true">/</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
