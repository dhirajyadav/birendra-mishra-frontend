import React from 'react';
import { CapabilitiesSectionData, CapabilityPillar } from '@/lib/types';

interface CapabilitiesProps {
  data?: CapabilitiesSectionData;
}

export default function CapabilitiesSection({ data }: CapabilitiesProps) {
  const eyebrow = data?.eyebrow || 'Capabilities';
  const title = data?.title || 'Four strategic pillars where experience meets judgement.';
  const lead =
    data?.lead ||
    'Specialised capabilities designed for complex international enterprises, and growth organisations navigating pivotal financial decisions.';

  const defaultPillars: CapabilityPillar[] = [
    {
      pillarNumber: 'Pillar 01',
      watermark: '01',
      tag: 'Corporate Development & Transactions',
      title: 'M&A',
      slug: 'cap-ma',
      description:
        'Supporting corporate development from transaction assessment through financial due diligence, deal review and shareholder structures, integration planning and value realisation. The focus is not simply completing a transaction, but protecting the strategic and financial logic that justified it.',
      subbox1Title: 'Transaction assessment',
      subbox1Description:
        'Rigorous due diligence, execution perspective, diligence overview, & deal support.',
      subbox2Title: 'Integration & value capture',
      subbox2Description:
        'Post-merger performance tracking, operational integration, synergies tracking and post-deal accountability.',
    },
    {
      pillarNumber: 'Pillar 02',
      watermark: '02',
      tag: 'Applied AI & Financial Automation',
      title: 'AI in Finance',
      slug: 'cap-ai',
      description:
        'Applying AI and automation to improve decision quality, analytical depth and execution productivity while maintaining strong governance, controls and human accountability.',
      subbox1Title: 'Strategy & Corporate Finance',
      subbox1Description:
        'Scenario analysis, recommendations, strategic modelling and execution decision support.',
      subbox2Title: 'Financial Planning & Analysis',
      subbox2Description:
        'Forecasting, performance insights, management reporting, planning and insight generation.',
    },
    {
      pillarNumber: 'Pillar 03',
      watermark: '03',
      tag: 'Stewardship & Board Oversight',
      title: 'Capital Allocation & Governance',
      slug: 'cap-governance',
      description:
        'Frameworks for allocating capital with discipline, structuring joint ventures, and maintaining governance that withstands scrutiny from boards, investors and partners.',
      subbox1Title: 'Capital Allocation Frameworks',
      subbox1Description:
        'Disciplined capital rationing, hurdle rates, hurdle oversight and balance-sheet resilience across cycles.',
      subbox2Title: 'Joint Ventures & Governance',
      subbox2Description:
        'Commercial alignment, partner stewardship, stakeholder alignment and fiduciary controls for multi-partner entities.',
    },
    {
      pillarNumber: 'Pillar 04',
      watermark: '04',
      tag: 'Enterprise Protection & Performance',
      title: 'Risk & Controls',
      slug: 'cap-risk',
      description:
        'Designing risk and control environments that protect value without slowing the business down — from internal controls to enterprise risk management.',
      subbox1Title: 'Financial & Internal Controls',
      subbox1Description:
        'Continuous audit-readiness, compliance architecture, process optimisation and closing-cycle acceleration.',
      subbox2Title: 'Enterprise Risk Management',
      subbox2Description:
        'Country & FX risk mitigation, geopolitical exposures, liquidity stress testing and operational risk management.',
    },
  ];

  const pillars = data?.pillars && data.pillars.length > 0 ? data.pillars : defaultPillars;

  return (
    <section className="section capabilities-section exp-section" id="capabilities" aria-label="Capabilities">
      <div className="container capabilities-container">
        <div className="capabilities-head exp-reveal-head">
          <div className="exp-eyebrow">
            <span className="exp-eyebrow-line" aria-hidden="true"></span>
            <span className="exp-eyebrow-text">{eyebrow}</span>
          </div>
          <h2 className="exp-title">{title}</h2>
          <p className="lead" style={{ color: 'var(--navy)', marginTop: '0.6rem' }}>
            {lead}
          </p>
        </div>

        <div className="capabilities-pillars-list">
          {pillars.map((pillar, idx) => {
            const cardId = pillar.slug || (idx === 0 ? 'cap-ma' : idx === 1 ? 'cap-ai' : idx === 2 ? 'cap-governance' : 'cap-risk');
            return (
              <article className="capability-pillar-card exp-card" id={cardId} aria-label={pillar.title} key={idx}>
                <div className="capability-card-topbar">
                  <div className="capability-badge-group">
                    <div className="capability-icon-badge" aria-hidden="true">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {idx === 0 && (
                          <>
                            <circle cx="18" cy="18" r="3" />
                            <circle cx="6" cy="6" r="3" />
                            <path d="M6 9v12" />
                            <path d="M18 9a9 9 0 0 1-9 9" />
                          </>
                        )}
                        {idx === 1 && (
                          <>
                            <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
                            <path d="M5 3v4" />
                            <path d="M3 5h4" />
                            <path d="M19 17v4" />
                            <path d="M17 19h4" />
                          </>
                        )}
                        {idx === 2 && (
                          <>
                            <path d="M12 2v20" />
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                          </>
                        )}
                        {idx >= 3 && (
                          <>
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          </>
                        )}
                      </svg>
                    </div>
                    <div className="capability-badge-meta">
                      <span className="capability-pillar-num">{pillar.pillarNumber}</span>
                      <span className="capability-pillar-tag">{pillar.tag}</span>
                    </div>
                  </div>
                  <span className="capability-pillar-watermark" aria-hidden="true">
                    {pillar.watermark}
                  </span>
                </div>

                <div className="capability-pillar-head">
                  <h3 className="capability-pillar-title">{pillar.title}</h3>
                  <p className="capability-pillar-desc">{pillar.description}</p>
                </div>

                <div className="capability-subboxes">
                  {pillar.subbox1Title && (
                    <div className="capability-subbox">
                      <div className="subbox-header">
                        <span className="subbox-icon-wrap" aria-hidden="true">
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                          </svg>
                        </span>
                        <h4 className="capability-subbox-title">{pillar.subbox1Title}</h4>
                      </div>
                      <p className="capability-subbox-desc">{pillar.subbox1Description}</p>
                    </div>
                  )}

                  {pillar.subbox2Title && (
                    <div className="capability-subbox">
                      <div className="subbox-header">
                        <span className="subbox-icon-wrap" aria-hidden="true">
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polygon points="12 2 2 7 12 12 22 7 12 2" />
                            <polyline points="2 17 12 22 22 17" />
                            <polyline points="2 12 12 17 22 12" />
                          </svg>
                        </span>
                        <h4 className="capability-subbox-title">{pillar.subbox2Title}</h4>
                      </div>
                      <p className="capability-subbox-desc">{pillar.subbox2Description}</p>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
