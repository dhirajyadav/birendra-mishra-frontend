import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getArticleBySlug, getArticles, getStrapiMediaUrl } from '@/lib/strapi';
import BlockRenderer from '@/components/article-blocks/BlockRenderer';
import RichTextRenderer from '@/components/article-blocks/RichTextRenderer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ preview?: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found | Birendra Mishra',
    };
  }

  const title = article.seoTitle || `${article.title} | Birendra Mishra`;
  const description =
    article.seoDescription ||
    article.shortDescription ||
    article.excerpt ||
    'Strategic financial analysis and insights by Birendra Mishra.';

  const ogUrl = article.featuredImage?.url
    ? getStrapiMediaUrl(article.featuredImage.url)
    : 'https://birendramishra.com/assets/og-image.svg';

  return {
    title,
    description,
    alternates: {
      canonical: article.canonicalUrl || `https://birendramishra.com/insights/${slug}`,
    },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `https://birendramishra.com/insights/${slug}`,
      publishedTime: article.publishedAt,
      images: [{ url: ogUrl }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogUrl],
    },
  };
}

export default async function ArticleDetailPage({ params, searchParams }: ArticlePageProps) {
  const { slug } = await params;
  const search = searchParams ? await searchParams : {};
  const isPreview = search.preview === 'true';
  const [article, allArticles] = await Promise.all([
    getArticleBySlug(slug, isPreview),
    getArticles(),
  ]);

  if (!article) {
    notFound();
  }

  const related = allArticles.filter((a) => a.slug !== slug).slice(0, 2);

  const articleUrl = `https://birendramishra.com/insights/${slug}`;
  const shareLinkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`;
  const shareX = `https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(article.title)}`;
  const shareEmail = `mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(`Read this article by Birendra Mishra: ${articleUrl}`)}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.shortDescription || article.excerpt,
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author?.name || 'Birendra Mishra',
      jobTitle: article.author?.role || 'Strategic Financial Advisor',
    },
    publisher: {
      '@type': 'Person',
      name: 'Birendra Mishra',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
  };

  return (
    <article>
      {isPreview && (
        <div
          style={{
            background: '#d97706',
            color: '#ffffff',
            padding: '0.75rem 1rem',
            textAlign: 'center',
            fontWeight: 600,
            fontSize: '0.9rem',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
          }}
        >
          Live Draft Preview Mode — You are previewing unpublished CMS content.
        </div>
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="article-detail-header">
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/insights">Insights</Link>
            <span>/</span>
            <span>{article.category?.name || 'Article'}</span>
          </div>

          <h1 className="article-detail-title">{article.title}</h1>
          {article.excerpt && <p className="article-detail-lead">{article.excerpt}</p>}

          <div className="article-detail-meta-bar">
            <div className="article-author-cluster">
              <img
                src="/assets/birendra-executive.jpg"
                alt="Birendra Mishra"
                className="author-large-avatar"
              />
              <div>
                <div className="author-large-name">
                  {article.author?.name || 'Birendra Mishra'}
                </div>
                <div className="author-large-role">
                  {article.author?.role || 'Senior Executive · Strategic Financial Leadership'}
                  {article.readingTime && <span className="article-meta-reading-time"> · {article.readingTime}</span>}
                </div>
              </div>
            </div>

            <div className="article-social-share">
              <span style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 600 }}>
                Share:
              </span>
              <a
                className="share-btn"
                href={shareLinkedIn}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on LinkedIn"
              >
                LinkedIn
              </a>
              <a
                className="share-btn"
                href={shareX}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on X"
              >
                X
              </a>
              <a className="share-btn" href={shareEmail} title="Share via Email">
                Email
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="article-featured-hero-image">
          <img
            src={
              article.featuredImage?.url
                ? getStrapiMediaUrl(article.featuredImage.url)
                : '/assets/oil-platforms.jpg'
            }
            alt={article.title}
          />
        </div>

        {/* Main Continuous WYSIWYG Content (with fallback to legacy Dynamic Zone blocks) */}
        {article.content ? (
          <RichTextRenderer content={article.content} />
        ) : (
          <BlockRenderer blocks={article.blocks} />
        )}

        {/* Related Articles Footer */}
        {related.length > 0 && (
          <section
            style={{
              marginTop: '4rem',
              paddingTop: '3rem',
              borderTop: '1px solid var(--line)',
              marginBottom: '4rem',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2rem',
                marginBottom: '1.5rem',
                color: 'var(--ink)',
              }}
            >
              Further Strategic Reading
            </h3>
            <div className="articles-masonry">
              {related.map((rel) => (
                <article key={rel.id} className="article-grid-card">
                  <div className="article-grid-body">
                    <span className="article-category-tag">
                      {rel.category?.name || 'Insights'}
                    </span>
                    <h4 className="article-card-title">
                      <Link href={`/insights/${rel.slug}`}>{rel.title}</Link>
                    </h4>
                    <p className="article-card-excerpt">
                      {rel.shortDescription || rel.excerpt}
                    </p>
                    <div className="article-card-footer">
                      <span>{rel.readingTime || '5 min read'}</span>
                      <Link
                        href={`/insights/${rel.slug}`}
                        style={{ color: 'var(--blue-ocean)', fontWeight: 600, textDecoration: 'none' }}
                      >
                        Read analysis ↗
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}

