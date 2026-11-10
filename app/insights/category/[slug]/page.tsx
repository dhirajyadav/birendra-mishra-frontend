import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getArticles, getCategories, getStrapiMediaUrl } from '@/lib/strapi';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const currentCat = categories.find((c) => c.slug === slug);
  const name = currentCat?.name || slug;

  return {
    title: `${name} | Insights | Birendra Mishra`,
    description: `Articles and strategic financial analyses in ${name} by Birendra Mishra.`,
    alternates: {
      canonical: `https://birendramishra.com/insights/category/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [allArticles, categories] = await Promise.all([
    getArticles(),
    getCategories(),
  ]);

  const currentCat = categories.find((c) => c.slug === slug);
  const filtered = allArticles.filter((a) => a.category?.slug === slug);

  return (
    <main>
      <header className="insights-page-header">
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/insights">Insights</Link>
            <span>/</span>
            <span>Category</span>
          </div>
          <div className="eyebrow">Category Archive</div>
          <h1 className="insights-page-title">{currentCat?.name || slug}</h1>
          <p className="insights-page-lead">
            Curated strategic insights, executive briefings, and financial advisory notes focusing on{' '}
            {currentCat?.name || slug}.
          </p>

          <div className="insights-filter-bar">
            <div className="insights-categories-list">
              <Link className="category-chip" href="/insights">
                All Topics
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  className={`category-chip ${cat.slug === slug ? 'active' : ''}`}
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
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <p style={{ color: 'var(--muted)', fontSize: '1.2rem' }}>
                No published articles found in this category yet.
              </p>
              <Link className="btn btn-primary" href="/insights" style={{ marginTop: '1.5rem' }}>
                View all insights
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
                    />
                  </div>
                  <div className="article-grid-body">
                    <span className="article-category-tag">
                      {article.category?.name || 'Category'}
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

