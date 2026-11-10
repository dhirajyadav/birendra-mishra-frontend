import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getArticles, getStrapiMediaUrl } from '@/lib/strapi';

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Articles tagged with #${slug} | Insights | Birendra Mishra`,
    description: `Analysis and strategic notes tagged #${slug} by Birendra Mishra.`,
    alternates: {
      canonical: `https://birendramishra.com/insights/tag/${slug}`,
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const allArticles = await getArticles();

  const filtered = allArticles.filter(
    (a) => a.tags && a.tags.some((t) => t.slug === slug || t.name.toLowerCase() === slug.toLowerCase())
  );

  return (
    <main>
      <header className="insights-page-header">
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/insights">Insights</Link>
            <span>/</span>
            <span>Tag</span>
          </div>
          <div className="eyebrow">Tag Archive</div>
          <h1 className="insights-page-title">#{slug}</h1>
          <p className="insights-page-lead">
            Curated analysis and advisory writings filed under the #{slug} tag.
          </p>
        </div>
      </header>

      <section className="section" style={{ paddingTop: '2.5rem' }}>
        <div className="container">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <p style={{ color: 'var(--muted)', fontSize: '1.2rem' }}>
                No published articles found for #{slug}.
              </p>
              <Link className="btn btn-primary" href="/insights" style={{ marginTop: '1.5rem' }}>
                Back to all insights
              </Link>
            </div>
          ) : (
            <div className="articles-masonry">
              {filtered.map((article) => (
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
                      {article.category?.name || 'Topic'}
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
          )}
        </div>
      </section>
    </main>
  );
}

