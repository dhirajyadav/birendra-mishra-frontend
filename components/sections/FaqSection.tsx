import React from 'react';
import { FaqSectionData, FaqItem } from '@/lib/types';

interface FaqProps {
  data?: FaqSectionData;
  isHidden?: boolean;
}

export default function FaqSection({ data, isHidden = true }: FaqProps) {
  // If data.isVisible is explicitly true, show it; otherwise use isHidden
  const shouldHide = data?.isVisible === false || (data?.isVisible === undefined && isHidden);

  const eyebrow = data?.eyebrow || 'FAQ';
  const heading = data?.heading || 'Common questions';
  const subhead =
    data?.subhead ||
    'Practical details regarding consultation scheduling, confidential discussions, and advisory arrangements.';

  const defaultItems: FaqItem[] = [
    {
      question: 'How do advisory discussions begin?',
      answer:
        'Engagements initiate through a confidential enquiry via the contact section below or direct email. This allows an initial assessment of strategic fit, scope, and objectives.',
    },
    {
      question: 'How are engagements structured?',
      answer:
        'Arrangements are customized to organizational requirements—ranging from selective board appointments and transaction advisory to ongoing strategic CFO counsel.',
    },
    {
      question: 'What is the geographic and international scope?',
      answer:
        'Advisory discussions are conducted internationally across Middle East, UK/Europe, Asia, and North American markets, with deep sector expertise in energy, commodities, infrastructure, and international finance.',
    },
    {
      question: 'How is confidentiality preserved?',
      answer:
        'All executive conversations, initial reviews, and client materials are maintained under strict board-level confidentiality and appropriate Non-Disclosure Agreements (NDAs).',
    },
    {
      question: 'Can advisory be combined with technology transformation initiatives?',
      answer:
        'Yes. Strategic financial advice frequently encompasses ERP modernization, applied artificial intelligence workflows, and data-driven scenario modeling.',
    },
  ];

  const items = data?.items && data.items.length > 0 ? data.items : defaultItems;

  return (
    <section
      className="section faq-section"
      id="faq"
      style={shouldHide ? { display: 'none' } : undefined}
      hidden={shouldHide}
    >
      <div className="container faq-container">
        <div className="faq-head faq-reveal-item">
          <div className="faq-eyebrow-wrap">
            <span className="faq-eyebrow-accent" aria-hidden="true"></span>
            <p className="eyebrow faq-eyebrow">{eyebrow}</p>
          </div>
          <h2 className="faq-heading">{heading}</h2>
          <p className="faq-subhead">{subhead}</p>
        </div>

        <div className="faq-accordion faq-reveal-item" role="region" aria-label="Frequently Asked Questions">
          {items.map((item, idx) => (
            <details className="faq-item" open={idx === 0} key={idx}>
              <summary className="faq-question">
                <span>{item.question}</span>
                <span className="faq-toggle-icon" aria-hidden="true"></span>
              </summary>
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
