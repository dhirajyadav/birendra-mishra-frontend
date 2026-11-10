import React from 'react';
import Link from 'next/link';
import { ArticleBlock } from '@/lib/types';
import { getStrapiMediaUrl } from '@/lib/strapi';

interface BlockRendererProps {
  blocks?: ArticleBlock[];
}

export default function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  return (
    <div className="article-content-body">
      {blocks.map((block, idx) => {
        const key = block.id || idx;
        const comp = block.__component?.toLowerCase() || '';

        // 1. Rich Text Editor
        if (comp.includes('rich-text') || comp.includes('richtext')) {
          return (
            <div
              key={key}
              className="article-block article-richtext-block"
              dangerouslySetInnerHTML={{ __html: block.content || block.body || '' }}
            />
          );
        }

        // 2. Heading H1, H2, H3, H4
        if (comp.includes('heading')) {
          const level = block.level?.toLowerCase() || 'h2';
          const text = block.text || block.title || '';
          if (level === 'h1') return <h1 key={key}>{text}</h1>;
          if (level === 'h3') return <h3 key={key}>{text}</h3>;
          if (level === 'h4') return <h4 key={key}>{text}</h4>;
          return <h2 key={key}>{text}</h2>;
        }

        // 3. Paragraph
        if (comp.includes('paragraph')) {
          return (
            <div key={key} className="article-block">
              <p>{block.content || block.text}</p>
            </div>
          );
        }

        // 4. Bold / Italic Text
        if (comp.includes('formatted-text') || comp.includes('styled-text')) {
          return (
            <div key={key} className="article-block">
              <p style={{ fontStyle: block.italic ? 'italic' : 'normal', fontWeight: block.bold ? 700 : 400 }}>
                {block.text}
              </p>
            </div>
          );
        }

        // 5. Bullet list
        if (comp.includes('bullet-list') || comp.includes('unordered-list')) {
          const items = Array.isArray(block.items) ? block.items : [];
          return (
            <div key={key} className="article-block">
              <ul>
                {items.map((item: any, i: number) => (
                  <li key={i}>{typeof item === 'string' ? item : item.text || item.content}</li>
                ))}
              </ul>
            </div>
          );
        }

        // 6. Numbered list
        if (comp.includes('numbered-list') || comp.includes('ordered-list')) {
          const items = Array.isArray(block.items) ? block.items : [];
          return (
            <div key={key} className="article-block">
              <ol>
                {items.map((item: any, i: number) => (
                  <li key={i}>{typeof item === 'string' ? item : item.text || item.content}</li>
                ))}
              </ol>
            </div>
          );
        }

        // 7. Image
        if (comp.includes('image') && !comp.includes('gallery') && !comp.includes('caption')) {
          const imgUrl = getStrapiMediaUrl(block.media?.url || block.image?.url || block.url);
          const alt = block.media?.alternativeText || block.alt || 'Article visual';
          return (
            <figure key={key} className="article-figure">
              <img
                src={imgUrl}
                alt={alt}
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.endsWith('/assets/oil-platforms.jpg')) {
                    target.src = '/assets/oil-platforms.jpg';
                  }
                }}
              />
            </figure>
          );
        }

        // 8. Image Gallery
        if (comp.includes('gallery')) {
          const images = block.images || block.gallery || [];
          return (
            <div key={key} className="article-gallery-grid">
              {Array.isArray(images) &&
                images.map((img: any, i: number) => (
                  <div key={i} className="article-gallery-item">
                    <img
                      src={getStrapiMediaUrl(img.url)}
                      alt={img.alternativeText || `Gallery image ${i + 1}`}
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.endsWith('/assets/oil-platforms.jpg')) {
                          target.src = '/assets/oil-platforms.jpg';
                        }
                      }}
                    />
                  </div>
                ))}
            </div>
          );
        }

        // 9. Image with Caption
        if (comp.includes('image-caption') || (comp.includes('image') && block.caption)) {
          const imgUrl = getStrapiMediaUrl(block.media?.url || block.image?.url || block.url);
          const alt = block.media?.alternativeText || block.alt || 'Article visual';
          return (
            <figure key={key} className="article-figure">
              <img
                src={imgUrl}
                alt={alt}
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.endsWith('/assets/oil-platforms.jpg')) {
                    target.src = '/assets/oil-platforms.jpg';
                  }
                }}
              />
              {block.caption && <figcaption className="article-figcaption">{block.caption}</figcaption>}
            </figure>
          );
        }

        // 10. Video upload
        if (comp.includes('video-upload') || (comp.includes('video') && !comp.includes('embed'))) {
          const videoUrl = getStrapiMediaUrl(block.media?.url || block.video?.url || block.url);
          return (
            <div key={key} className="article-embed-responsive">
              <video controls src={videoUrl} poster={getStrapiMediaUrl(block.poster?.url)}>
                Your browser does not support video playback.
              </video>
            </div>
          );
        }

        // 11. YouTube video embed
        if (comp.includes('youtube')) {
          let videoId = block.videoId || '';
          if (!videoId && block.url) {
            const match = block.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
            videoId = match ? match[1] : '';
          }
          return (
            <div key={key} className="article-embed-responsive">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={block.title || 'YouTube video player'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          );
        }

        // 12. Vimeo video embed
        if (comp.includes('vimeo')) {
          let videoId = block.videoId || '';
          if (!videoId && block.url) {
            const match = block.url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/);
            videoId = match ? match[1] : '';
          }
          return (
            <div key={key} className="article-embed-responsive">
              <iframe
                src={`https://player.vimeo.com/video/${videoId}`}
                title={block.title || 'Vimeo video player'}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          );
        }

        // 13. CTA Button
        if (comp.includes('cta-button') || comp.includes('button')) {
          const isPrimary = block.variant !== 'outline';
          return (
            <div key={key} className="article-btn-wrap">
              <a
                className={`btn ${isPrimary ? 'btn-primary' : 'btn-outline'}`}
                href={block.url || '#contact'}
                target={block.isExternal ? '_blank' : undefined}
                rel={block.isExternal ? 'noopener noreferrer' : undefined}
              >
                <span>{block.label || block.text || 'Explore Advisory'}</span>
                <span style={{ marginLeft: '0.4rem' }}>↗</span>
              </a>
            </div>
          );
        }

        // 14. Multiple Buttons
        if (comp.includes('multi-button') || comp.includes('buttons-group')) {
          const buttons = Array.isArray(block.buttons) ? block.buttons : [];
          return (
            <div key={key} className="article-btn-wrap">
              {buttons.map((btn: any, i: number) => (
                <a
                  key={i}
                  className={`btn ${btn.variant === 'outline' ? 'btn-outline' : 'btn-primary'}`}
                  href={btn.url || '#'}
                  target={btn.isExternal ? '_blank' : undefined}
                  rel={btn.isExternal ? 'noopener noreferrer' : undefined}
                >
                  <span>{btn.label}</span>
                </a>
              ))}
            </div>
          );
        }

        // 15. Quote Block
        if (comp.includes('quote')) {
          return (
            <blockquote key={key} className="article-quote-block">
              <p className="article-quote-text">“{block.quote || block.content}”</p>
              {(block.author || block.cite) && (
                <cite className="article-quote-cite">
                  — {block.author}{block.cite ? `, ${block.cite}` : ''}
                </cite>
              )}
            </blockquote>
          );
        }

        // 16. Highlighted Text
        if (comp.includes('highlight')) {
          return (
            <div key={key} className="article-highlight-box">
              {block.content || block.text}
            </div>
          );
        }

        // 17. Code Block
        if (comp.includes('code')) {
          return (
            <pre key={key} className="article-code-block">
              <code>{block.code || block.content}</code>
            </pre>
          );
        }

        // 18. Table
        if (comp.includes('table')) {
          const rows = Array.isArray(block.rows) ? block.rows : [];
          return (
            <div key={key} className="article-table-wrap">
              <table className="article-table">
                {block.headers && (
                  <thead>
                    <tr>
                      {block.headers.map((h: string, i: number) => (
                        <th key={i}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {rows.map((row: any, rIndex: number) => (
                    <tr key={rIndex}>
                      {Array.isArray(row)
                        ? row.map((cell: any, cIndex: number) => <td key={cIndex}>{cell}</td>)
                        : Object.values(row).map((val: any, cIndex: number) => <td key={cIndex}>{String(val)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        // 19. Divider
        if (comp.includes('divider')) {
          return <hr key={key} className="article-divider-block" />;
        }

        // 20. Two-Column Content
        if (comp.includes('two-column') || comp.includes('2-column')) {
          return (
            <div key={key} className="article-cols-two">
              <div dangerouslySetInnerHTML={{ __html: block.colLeft || block.columnOne || '' }} />
              <div dangerouslySetInnerHTML={{ __html: block.colRight || block.columnTwo || '' }} />
            </div>
          );
        }

        // 21. Three-Column Content
        if (comp.includes('three-column') || comp.includes('3-column')) {
          return (
            <div key={key} className="article-cols-three">
              <div dangerouslySetInnerHTML={{ __html: block.col1 || block.columnOne || '' }} />
              <div dangerouslySetInnerHTML={{ __html: block.col2 || block.columnTwo || '' }} />
              <div dangerouslySetInnerHTML={{ __html: block.col3 || block.columnThree || '' }} />
            </div>
          );
        }

        // 22. Downloadable PDF
        if (comp.includes('download') || comp.includes('pdf')) {
          const fileUrl = getStrapiMediaUrl(block.file?.url || block.url);
          return (
            <div key={key} className="article-download-card">
              <div className="article-download-info">
                <div className="pdf-icon-box" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <line x1="9" y1="15" x2="15" y2="15" />
                  </svg>
                </div>
                <div>
                  <div className="pdf-title">{block.title || 'Briefing Note (PDF)'}</div>
                  <div className="pdf-meta">{block.fileSize || 'Executive Publication'}</div>
                </div>
              </div>
              <a className="btn btn-outline" href={fileUrl} download target="_blank" rel="noopener">
                Download PDF
              </a>
            </div>
          );
        }

        // 23. Related Articles Block
        if (comp.includes('related')) {
          const articles = Array.isArray(block.articles) ? block.articles : [];
          return (
            <div key={key} className="article-block" style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--line)' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginBottom: '1.25rem' }}>Related Analysis</h3>
              <div className="articles-masonry">
                {articles.map((art: any) => (
                  <article key={art.id} className="article-grid-card">
                    <div className="article-grid-body">
                      <h4 className="article-card-title">
                        <Link href={`/insights/${art.slug}`}>{art.title}</Link>
                      </h4>
                      <p className="article-card-excerpt">{art.excerpt || art.shortDescription}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          );
        }

        // 24. Custom HTML Block (Restricted)
        if (comp.includes('custom-html') || comp.includes('raw-html')) {
          return (
            <div
              key={key}
              className="article-block article-custom-html-block"
              dangerouslySetInnerHTML={{ __html: block.html || block.code || '' }}
            />
          );
        }

        return null;
      })}
    </div>
  );
}
