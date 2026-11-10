import React from 'react';
import { AdvisorySectionData, AdvisoryItem } from '@/lib/types';

interface AdvisoryProps {
  data?: AdvisorySectionData;
}

export default function AdvisorySection({ data }: AdvisoryProps) {
  const eyebrow = data?.eyebrow || 'Selective Advisory';
  const title = data?.title || 'Experience applied to complex decisions.';
  const callout =
    data?.callout ||
    'Strategic advice should improve the quality of the decision, not add another layer of process.';
  const ctaText = data?.ctaText || 'Start a conversation';
  const ctaUrl = data?.ctaUrl || '#contact';
  const introText =
    data?.introText ||
    'Designed for organisations and leadership teams seeking an experienced external perspective rather than off-the-shelf consulting packages.';

  const defaultItems: AdvisoryItem[] = [
    {
      title: 'Board, Corporate Finance & Leadership Opportunities',
      description:
        'Selected board, executive, strategic advisory and corporate finance discussions where experience and judgement can add value.',
    },
    {
      title: 'M&A, Investment & Capital Allocation',
      description:
        'Transaction assessment, due diligence, investment economics, structures, post m&a integration and value realisation.',
    },
    {
      title: 'Finance Organisation, Technology & Transformation',
      description:
        'Target operating model, ERP, applied AI in finance, closing-cycle acceleration and management reporting redesign.',
    },
    {
      title: 'Risk, Controls & Audit-Readiness',
      description:
        'Internal controls over financial reporting, compliance architecture, remediation and board-level risk reporting.',
    },
    {
      title: 'Executive Mentoring & Finance Talent Development',
      description:
        'Confidential sounding board for finance leaders, cross-border transition support and high-potential talent development.',
    },
  ];

  const items = data?.items && data.items.length > 0 ? data.items : defaultItems;

  return (
    <section className="section advisory-section solutions-section" id="solutions" aria-label="Advisory">
      <span id="advisory" className="section-anchor" aria-hidden="true"></span>
      <div className="container advisory-container">
        <div className="advisory-split-layout">
          {/* LEFT COLUMN: Executive Brief */}
          <div className="advisory-left-col">
            <div className="advisory-eyebrow-wrap">
              <span className="advisory-eyebrow-accent" aria-hidden="true"></span>
              <p className="eyebrow advisory-eyebrow">{eyebrow}</p>
            </div>
            <h2 className="advisory-title">{title}</h2>
            <p className="advisory-callout">{callout}</p>
            <div className="advisory-action">
              <a className="btn advisory-btn-primary" href={ctaUrl}>
                <span>{ctaText}</span>
                <span className="advisory-btn-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: Narrative & 5 Practice Areas */}
          <div className="advisory-right-col">
            <div className="advisory-intro-block">
              <p className="advisory-intro-text">{introText}</p>
            </div>

            <div className="advisory-list">
              {items.map((item, idx) => (
                <div className="advisory-item" key={idx}>
                  <h3 className="advisory-item-title">{item.title}</h3>
                  <p className="advisory-item-desc">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
