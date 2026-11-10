import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getArticles, getCategories, getStrapiMediaUrl } from '@/lib/strapi';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Insights | Birendra Mishra',
  description:
    'Strategic financial analysis, energy economics, capital governance, M&A and corporate finance perspectives by Birendra Mishra.',
  alternates: {
    canonical: 'https://birendramishra.com/insights',
  },
  openGraph: {
    title: 'Insights | Birendra Mishra',
    description:
      'Strategic financial analysis, energy economics, capital governance, M&A and corporate finance perspectives.',
    url: 'https://birendramishra.com/insights',
    type: 'website',
  },
};

export default async function InsightsPage() {
  const [articles, categories] = await Promise.all([
    getArticles(),
    getCategories(),
  ]);

  const featured = articles.find((a) => a.featuredArticle) || articles[0];
  const regularArticles = articles.filter((a) => a.id !== featured?.id);

  return (
    <main>
      <header className="insights-page-header">
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Insights</span>
          </div>
          <div className="eyebrow">Strategic Analysis &amp; Articles</div>
          <h1 className="insights-page-title">The Energy Perspective &amp; Financial Strategy</h1>
          <p className="insights-page-lead">
            Examining global energy markets, capital allocation, M&amp;A, risk frameworks, and the
            applied role of AI across modern corporate finance.
          </p>

          <div className="insights-filter-bar">
            <div className="insights-categories-list">
              <Link className="category-chip active" href="/insights">
                All Topics
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  className="category-chip"
                  href={`/insights/category/${cat.slug}`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section className="section" style={{ paddingTop: '2.5rem' }}>
        <div className="container">
          {/* Featured Article Card */}
          {featured && (
            <article className="featured-article-card">
              <div className="featured-article-media">
                <img
                  src={
                    featured.featuredImage?.url
                      ? getStrapiMediaUrl(featured.featuredImage.url)
                      : '/assets/oil-platforms.jpg'
                  }
                  alt={featured.title}
                  className="featured-article-img"
                  loading="eager"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/assets/oil-platforms.jpg')) {
                      target.src = '/assets/oil-platforms.jpg';
                    }
                  }}
                />
              </div>
              <div className="featured-article-content">
                <span className="featured-badge">Featured Analysis</span>
                <h2 className="featured-article-title">
                  <Link href={`/insights/${featured.slug}`}>{featured.title}</Link>
                </h2>
                <p className="featured-article-excerpt">
                  {featured.shortDescription || featured.excerpt}
                </p>
                <div className="article-meta-row">
                  <div className="article-author-info">
                    <img
                      src="/assets/birendra-executive.jpg"
                      alt="Birendra Mishra"
                      className="article-author-avatar"
                    />
                    <span>{featured.author?.name || 'Birendra Mishra'}</span>
                  </div>
                  <span>·</span>
                  <span>{featured.readingTime || '5 min read'}</span>
                  {featured.category && (
                    <>
                      <span>·</span>
                      <span style={{ color: 'var(--blue-ocean)', fontWeight: 600 }}>
                        {featured.category.name}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </article>
          )}

          {/* Regular Articles Grid */}
          <div className="articles-masonry">
            {regularArticles.map((article) => (
              <article key={article.id} className="article-grid-card">
                <div className="article-grid-media">
                  <img
                    src={
                      article.featuredImage?.url
                        ? getStrapiMediaUrl(article.featuredImage.url)
                        : '/assets/oil-platforms.jpg'
                    }
                    alt={article.title}
                    className="article-grid-img"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.endsWith('/assets/oil-platforms.jpg')) {
                        target.src = '/assets/oil-platforms.jpg';
                      }
                    }}
                  />
                </div>
                <div className="article-grid-body">
                  <span className="article-category-tag">
                    {article.category?.name || 'Strategy'}
                  </span>
                  <h3 className="article-card-title">
                    <Link href={`/insights/${article.slug}`}>{article.title}</Link>
                  </h3>
                  <p className="article-card-excerpt">
                    {article.shortDescription || article.excerpt}
                  </p>
                  <div className="article-card-footer">
                    <span>{article.readingTime || '4 min read'}</span>
                    <Link
                      href={`/insights/${article.slug}`}
                      style={{ color: 'var(--blue-ocean)', fontWeight: 600, textDecoration: 'none' }}
                    >
                      Read analysis ↗
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

