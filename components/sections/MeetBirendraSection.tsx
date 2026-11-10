import React from 'react';
import { MeetBirendraSectionData } from '@/lib/types';
import { getStrapiMediaUrl } from '@/lib/strapi';

interface MeetBirendraProps {
  data?: MeetBirendraSectionData;
}

export default function MeetBirendraSection({ data }: MeetBirendraProps) {
  const photoUrl = data?.photo?.url
    ? getStrapiMediaUrl(data.photo.url)
    : '/assets/birendra-executive.jpg';

  const photoBadgeText = data?.photoBadgeText || 'Birendra Mishra · Senior Executive';
  const metric1Val = data?.metric1Value || '20+';
  const metric1Lab = data?.metric1Label || 'Years';
  const metric2Val = data?.metric2Value || '6';
  const metric2Lab = data?.metric2Label || 'Countries';
  const metricHighlight = data?.metricHighlightText || 'Corporate + Operations';

  const defaultBadges = [
    { title: 'Global Strategy', subtitle: 'Long-term financial direction' },
    { title: 'Capital Governance', subtitle: 'Disciplined investment decisions' },
    { title: 'Executive Leadership', subtitle: 'Cross-border operational experience' },
  ];
  const tagBadges = data?.tagBadges && data.tagBadges.length > 0 ? data.tagBadges : defaultBadges;

  const eyebrow = data?.eyebrow || 'Executive Profile';
  const mainTitle = data?.title || 'Senior Executive.';
  const subheadline =
    data?.subheadline || 'Global Financial Strategy, M&A and Capital Governance';

  const p1 =
    data?.bioParagraph1 ||
    'Over more than two decades in international finance and the energy sector, I have built experience across corporate headquarters and complex international operations, with assignments spanning India, Nigeria, Italy, Kenya, South Africa and Iraq.';

  const p2 =
    data?.bioParagraph2 ||
    'My career has encompassed financial leadership, corporate reporting, planning and performance management, joint ventures, governance, capital allocation and transaction support across international upstream oil & gas operations.';

  const p3 =
    data?.bioParagraph3 ||
    'Working across different countries, cultures and organisational settings has taught me to connect corporate strategy with operational realities while maintaining financial discipline and effective governance. Today, that experience shapes how I approach M&A, capital allocation, financial strategy, risk and controls, technology-enabled finance and enterprise performance.';

  const capabilitiesHeading =
    data?.capabilitiesHeading || 'Strategic Capabilities & Value to Organisation';

  const capabilitiesLead =
    data?.capabilitiesLead ||
    'I collaborate closely with executive leadership to craft proactive financial frameworks, moving beyond simple financial reporting to accelerate business planning, sustainable expansion, manage international exposure, and maximise the enterprise value.';

  const defaultCards = [
    {
      title: 'Capital Allocation & Budget Stewardship',
      description:
        'Translating corporate ambitions into actionable financial frameworks, ensuring every dollar invested directly supports long-term strategic goals.',
    },
    {
      title: 'Corporate Development, M&A & Integration',
      description:
        'Leading financial due diligence for asset acquisitions, designing optimal corporate shareholding structures, and driving seamless post-merger integration to capture synergies quickly and mitigate risk.',
    },
    {
      title: 'Risk Mitigation & Enterprise Optimisation',
      description:
        'Establishing risk assessment, implementing modern financial controls, ERP integration, and continuous audit-readiness to protect capital across volatile market cycles.',
    },
    {
      title: 'Cross-Border Leadership & Organisational Agility',
      description:
        'Cultivating high-performing, multi-cultural teams that can execute strategy effectively across different regions and regulatory regimes.',
    },
    {
      title: 'Complex Governance & Stakeholder Alignment',
      description:
        'Building high-trust partnerships across joint ventures, regulatory bodies, and diverse board-level stakeholders to ensure seamless operational alignment.',
    },
  ];
  const cards =
    data?.capabilityValueCards && data.capabilityValueCards.length > 0
      ? data.capabilityValueCards
      : defaultCards;

  const philosophy =
    data?.philosophyQuote ||
    '“Effective strategic financial leadership relies on vision. It requires building agile frameworks that allow organisations to pivot smoothly, capture emerging market opportunities, and turn complexity into a competitive advantage. Financial leadership is not about backward-looking compliance.”';

  const connectTitle =
    data?.connectTitle ||
    "Interested in exploring strategic advisory, board, or corporate finance opportunities? Let's connect.";

  const connectDesc =
    data?.connectDescription ||
    'Confidential executive discussions for forward-looking enterprises and boards.';

  const connectCtaText = data?.connectCtaText || 'Start a conversation';
  const connectCtaUrl = data?.connectCtaUrl || '#contact';

  return (
    <div
      className="meet-subblock executive-profile-subblock"
      id="birendra"
      aria-label="Executive Profile - Senior Executive"
    >
      <div className="executive-profile-grid">
        {/* LEFT SIDE: Full-Length Photo + Two Info Rows */}
        <div className="executive-left-col">
          <div className="executive-photo-wrapper">
            <img
              src={photoUrl}
              alt="Birendra Mishra — Senior Executive, Strategic Financial Leadership"
              className="executive-full-photo"
              width="700"
              height="933"
              loading="lazy"
            />
            <div className="photo-overlay-badge">
              <span className="photo-badge-dot" aria-hidden="true"></span>
              <span className="photo-badge-text">{photoBadgeText}</span>
            </div>
          </div>

          {/* Two Boxes Info in Two Rows */}
          <div className="executive-two-boxes" aria-label="Executive credentials and focus areas">
            {/* First row: metrics */}
            <div className="info-box-row info-box-row-1">
              <div className="info-pill">
                <span className="pill-metric">{metric1Val}</span>
                <span className="pill-label">{metric1Lab}</span>
              </div>
              <div className="info-pill-divider" aria-hidden="true"></div>
              <div className="info-pill">
                <span className="pill-metric">{metric2Val}</span>
                <span className="pill-label">{metric2Lab}</span>
              </div>
              <div className="info-pill-divider" aria-hidden="true"></div>
              <div className="info-pill info-pill--highlight">
                <svg
                  className="pill-icon"
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
                  <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                <span className="pill-label-bold">{metricHighlight}</span>
              </div>
            </div>

            {/* Second row: Tag Badges */}
            <div className="info-box-row info-box-row-2">
              {tagBadges.map((badge, idx) => (
                <div className="tag-badge" key={idx}>
                  <svg
                    className="tag-badge-icon"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {idx === 0 && (
                      <>
                        <circle cx="12" cy="12" r="10" />
                        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                      </>
                    )}
                    {idx === 1 && (
                      <>
                        <line x1="18" x2="18" y1="20" y2="10" />
                        <line x1="12" x2="12" y1="20" y2="4" />
                        <line x1="6" x2="6" y1="20" y2="14" />
                      </>
                    )}
                    {idx >= 2 && (
                      <>
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </>
                    )}
                  </svg>
                  <div className="tag-badge-text">
                    <strong className="tag-title">{badge.title}</strong>
                    {badge.subtitle && <span className="tag-sub">{badge.subtitle}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Executive Profile & Strategic Capabilities */}
        <div className="executive-right-col">
          <div className="profile-header-block">
            <div className="profile-eyebrow">
              <span className="profile-eyebrow-line" aria-hidden="true"></span>
              <span className="profile-eyebrow-text">{eyebrow}</span>
            </div>
            <h2 className="profile-main-title">{mainTitle}</h2>
            <h3 className="profile-subheadline">{subheadline}</h3>
          </div>

          {/* Executive Background Narrative */}
          <div className="profile-bio-narrative">
            <p>{p1}</p>
            <p>{p2}</p>
            <p>{p3}</p>
          </div>

          {/* Strategic Capabilities & Value to Organisation */}
          <div className="profile-capabilities-block">
            <h3 className="profile-section-heading">{capabilitiesHeading}</h3>
            <p className="profile-intro-lead">{capabilitiesLead}</p>

            <div className="capabilities-value-list">
              {cards.map((c, idx) => (
                <div className="capability-value-card" key={idx}>
                  <div className="value-card-header">
                    <div className="value-icon-box" aria-hidden="true">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {idx === 0 && (
                          <>
                            <line x1="12" x2="12" y1="2" y2="22" />
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                          </>
                        )}
                        {idx === 1 && (
                          <>
                            <path d="m11 17 2 2a1 1 0 1 0 3-3" />
                            <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
                            <path d="M3 4h8" />
                          </>
                        )}
                        {idx === 2 && (
                          <>
                            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                            <path d="m9 12 2 2 4-4" />
                          </>
                        )}
                        {idx === 3 && (
                          <>
                            <circle cx="12" cy="12" r="10" />
                            <line x1="2" x2="22" y1="12" y2="12" />
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                          </>
                        )}
                        {idx >= 4 && (
                          <>
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </>
                        )}
                      </svg>
                    </div>
                    <h4 className="value-card-title">{c.title}</h4>
                  </div>
                  <p className="value-card-desc">{c.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* My Philosophy */}
          <div className="profile-philosophy-card">
            <div className="philosophy-badge">
              <svg
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
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              <span>My Philosophy</span>
            </div>
            <blockquote className="philosophy-quote-text">{philosophy}</blockquote>
          </div>

          {/* Let's Connect CTA */}
          <div className="profile-connect-cta">
            <div className="connect-cta-text">
              <h4 className="connect-cta-title">{connectTitle}</h4>
              <p className="connect-cta-desc">{connectDesc}</p>
            </div>
            <div className="connect-cta-actions">
              <a className="btn btn-primary" href={connectCtaUrl}>
                <span>{connectCtaText}</span>
                <svg
                  className="btn-arrow"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
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
        </div>
      </div>
    </div>
  );
}
