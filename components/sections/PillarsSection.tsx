import React from 'react';
import { PillarsSectionData } from '@/lib/types';

interface PillarsProps {
  data?: PillarsSectionData;
}

export default function PillarsSection({ data }: PillarsProps) {
  const defaultPillars = [
    {
      number: '01',
      title: 'Hands-on, tailor-made advice',
      description: 'Practical guidance shaped to your organisation’s realities — not generic playbooks.',
    },
    {
      number: '02',
      title: 'Results-focused execution',
      description: 'From framework to follow-through: plans that leadership can implement with confidence.',
    },
    {
      number: '03',
      title: '20+ years of international experience',
      description: 'Seasoned perspective across high-growth, high-risk markets and multi-cultural teams.',
    },
    {
      number: '04',
      title: 'Independence & confidentiality',
      description: 'Independent thinking for board-level and executive conversations that stay private.',
    },
  ];

  const pillars = data?.items && data.items.length > 0 ? data.items : defaultPillars;

  return (
    <div className="container">
      <div className="pillars" aria-label="Four pillars">
        {pillars.map((pillar, idx) => (
          <article className="pillar" key={idx}>
            <div className="pillar-num">{pillar.number}</div>
            <h3>{pillar.title}</h3>
            <p>{pillar.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
