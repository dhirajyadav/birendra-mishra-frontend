import React from 'react';
import Link from 'next/link';
import { Article, InsightsSectionData } from '@/lib/types';

interface InsightsSectionProps {
  data?: InsightsSectionData;
  articles?: Article[];
  linkedInUrl?: string;
}

export default function InsightsSection({ data, articles, linkedInUrl }: InsightsSectionProps) {
  // Source B: Latest published articles from Strapi Articles Collection Type
  const displayArticles = Array.isArray(articles) ? articles.slice(0, 3) : [];

  // Source A: Homepage Single Type configuration & static content
  const eyebrow = data?.eyebrow || 'Insights';
  const heading = data?.heading || 'The Energy Perspective and Financial strategy';
  const subheading = data?.subheading || 'Understanding the business behind the energy headlines.';
  const lead =
    data?.lead ||
    'Markets, geopolitics, energy transition and technology matter because of what they mean for capital allocation, financial performance, risk and long-term enterprise value.';
  const metaNote =
    data?.metaNote ||
    'Articles published on LinkedIn, alongside future writing on corporate finance, M&A, FP&A, capital governance and international leadership.';

  const linkedinBtnText = data?.linkedinBtnText || 'LinkedIn profile';
  const profileUrl = data?.linkedinBtnUrl || linkedInUrl || 'https://www.linkedin.com/';

  return (
    <section className="section insights-section exp-section" id="insights" aria-label="Insights">
      <div className="container insights-container">
        {/* Source A: Section Header & Static Actions from Homepage Single Type */}
        <div className="split-head insights-head insights-reveal-head">
          <div className="insights-head-content">
            <div className="insights-eyebrow-wrap">
              <span className="insights-eyebrow-accent" aria-hidden="true"></span>
              <p className="eyebrow insights-eyebrow">{eyebrow}</p>
            </div>
            <h2 className="insights-heading">{heading}</h2>
            <p className="insights-subheading">{subheading}</p>
            <p className="lead insights-lead">{lead}</p>
            <p className="insights-meta-note">{metaNote}</p>
          </div>
          <div className="insights-head-action">
            <a
              className="btn btn-outline insights-btn-outline"
              id="linkedin-btn"
              href={profileUrl}
              target="_blank"
              rel="noopener"
            >
              <span>{linkedinBtnText}</span>
              <svg
                className="insights-btn-icon"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          </div>
        </div>

        {/* Source B: 3 Latest Published Article Cards from Articles Collection Type */}
        {displayArticles.length > 0 ? (
          <div className="insights-grid" id="insights-grid">
            {displayArticles.map((article, idx) => {
              const categoryName = article.category?.name || 'Markets & Geopolitics';
              const articleHref = `/insights/${article.slug}`;
              const description = article.shortDescription || article.excerpt || '';

              return (
                <article
                  className="card insight-card exp-card"
                  aria-label={article.title}
                  key={article.id || article.slug || idx}
                >
                  <div className="insight-card-body">
                    <span className="insight-tag">{categoryName}</span>
                    <h3 className="insight-title">
                      <Link href={articleHref}>{article.title}</Link>
                    </h3>
                    <p className="insight-desc">{description}</p>
                  </div>
                  <div className="insight-divider" aria-hidden="true"></div>
                  <div className="insight-action">
                    <Link
                      className="insight-read-more"
                      href={articleHref}
                      aria-label={`Read article: ${article.title}`}
                    >
                      <span>Read article</span>
                      <span className="insight-arrow" aria-hidden="true">
                        ↗
                      </span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div
            className="insights-empty-state"
            style={{
              textAlign: 'center',
              padding: '3.5rem 1.5rem',
              color: '#4B6B8A',
              fontSize: '1rem',
            }}
          >
            <p>No published insights available at this time.</p>
          </div>
        )}
      </div>
    </section>
  );
}
