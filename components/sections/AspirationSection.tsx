import React from 'react';
import { AspirationSectionData } from '@/lib/types';

interface AspirationProps {
  data?: AspirationSectionData;
}

export default function AspirationSection({ data }: AspirationProps) {
  const eyebrow = data?.eyebrow || 'Aspiration';
  const quote =
    data?.quote ||
    '“Financial leadership is not merely the recording of the past—it is the strategic design of the future. Ethical financial growth and inclusion, supported by innovation for the human species. In an era accelerated by artificial intelligence and geopolitical realignments, our aspiration is to equip visionary enterprises with resilient capital frameworks, institutional agility, and decisive clarity.”';

  const defaultPillars = [
    {
      number: '01 / INTELLIGENCE',
      title: 'AI-Augmented Precision',
      description:
        'Use AI and data to strengthen analysis and decision-making without diluting human accountability.',
    },
    {
      number: '02 / AGILITY',
      title: 'Cross-Border Agility',
      description:
        'Build financial frameworks capable of responding to changing markets, regulation and operating conditions.',
    },
    {
      number: '03 / STEWARDSHIP',
      title: 'Enduring Enterprise Value',
      description:
        'Balance growth, resilience and responsible capital stewardship with a long-term perspective.',
    },
  ];

  const pillars = data?.pillars && data.pillars.length > 0 ? data.pillars : defaultPillars;

  return (
    <div className="meet-subblock" id="aspiration" aria-label="Aspiration">
      <div className="aspiration-card">
        <div className="aspiration-eyebrow-wrap">
          <span className="aspiration-eyebrow-dash" aria-hidden="true">—</span>
          <span className="aspiration-eyebrow-text">{eyebrow}</span>
        </div>
        <blockquote className="aspiration-quote">{quote}</blockquote>

        <div className="aspiration-pillars">
          {pillars.map((p, idx) => (
            <div className="aspiration-pillar" key={idx}>
              <div className="aspiration-pillar-num">{p.number}</div>
              <div className="aspiration-pillar-title">{p.title}</div>
              <p className="aspiration-pillar-desc">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
