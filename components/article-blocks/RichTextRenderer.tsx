import React from 'react';
import { getStrapiMediaUrl } from '@/lib/strapi';

interface RichTextRendererProps {
  content?: string | null;
}

/**
 * Strips HTML tags from a string.
 */
function stripHtml(input: string): string {
  return (input || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

function cleanUrl(input?: string): string {
  if (!input) return '#';
  const hrefMatch = input.match(/href=["']([^"']+)["']/i);
  if (hrefMatch) return hrefMatch[1].trim();
  return stripHtml(input).trim() || '#';
}

/**
 * Builds the official Executive PDF Download Card HTML.
 */
function buildPdfCard(title: string, subtitle?: string, href?: string): string {
  const cleanTitle = stripHtml(title) || 'Strategic Financial Leadership Executive Framework (PDF)';
  const cleanSub = stripHtml(subtitle || '') || 'Executive Whitepaper · Published by Birendra Mishra';
  const cleanHref = cleanUrl(href);
  const safeFilename = cleanTitle.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-') + '.pdf';

  return `
<div class="article-download-card">
  <div class="article-download-info">
    <div class="pdf-icon-box">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    </div>
    <div>
      <div class="pdf-title">${cleanTitle}</div>
      <div class="pdf-meta">${cleanSub}</div>
    </div>
  </div>
  <a class="btn btn-outline" href="${cleanHref}" download="${safeFilename}">
    <span>Download PDF</span>
    <span style="margin-left: 0.4rem;">↓</span>
  </a>
</div>`;
}

/**
 * Normalizes and enhances HTML content from CKEditor 5:
 * - Prepends Strapi media URL to relative /uploads/ image and video paths.
 * - Wraps bare iframes in .article-embed-responsive for 16:9 responsive display.
 * - Wraps tables in .article-table-wrap and adds .article-table for executive styling.
 * - Supports [[pdf: Title | Subtitle | URL]] shortcode.
 * - Supports [[callout: Title | Text]] or [[callout: Text]] shortcode.
 * - Supports [[button: Label | URL]] shortcode.
 * - Auto-transforms paragraphs starting with "Executive Takeaway:" into highlight callout boxes.
 * - Auto-transforms standalone contact links into executive pill buttons.
 */
function processRichTextHtml(html: string): string {
  if (!html) return '';

  let processed = html;

  // 1. Resolve relative /uploads/ media paths to full Strapi URLs
  processed = processed.replace(
    /(<img[^>]+src=["'])(\/uploads\/[^"']+)(["'])/gi,
    (match, p1, p2, p3) => `${p1}${getStrapiMediaUrl(p2)}${p3}`
  );

  processed = processed.replace(
    /(<(?:video|source|a)[^>]+(?:src|href)=["'])(\/uploads\/[^"']+)(["'])/gi,
    (match, p1, p2, p3) => `${p1}${getStrapiMediaUrl(p2)}${p3}`
  );

  // 2. Wrap bare iframes (e.g. YouTube, Vimeo) in .article-embed-responsive if not already wrapped
  if (!processed.includes('article-embed-responsive')) {
    processed = processed.replace(
      /(<iframe[\s\S]*?<\/iframe>)/gi,
      '<div class="article-embed-responsive">$1</div>'
    );
  }

  // 3. Ensure tables have .article-table class and are wrapped in .article-table-wrap
  processed = processed.replace(/<figure class="table">\s*<table([^>]*)>/gi, '<div class="article-table-wrap"><table class="article-table"$1>');
  processed = processed.replace(/<\/table>\s*<\/figure>/gi, '</table></div>');

  if (!processed.includes('article-table-wrap')) {
    processed = processed.replace(
      /(<table[\s\S]*?<\/table>)/gi,
      '<div class="article-table-wrap">$1</div>'
    );
  }
  processed = processed.replace(/<table(?!\s+class=["'][^"']*article-table)/gi, '<table class="article-table"');

  // 4. Shortcode Support: [pdf: Title | Subtitle | URL] or [[pdf: ...]]
  processed = processed.replace(
    /(?:<p(?:\s+[^>]*)?>\s*)?(?:\[\[|\[)pdf:\s*([^|\]]+)(?:\|\s*([^|\]]+))?(?:\|\s*([^\]]+))?(?:\]\]|\])(?:\s*<\/p>)?/gi,
    (_match, p1, p2, p3) => {
      if (p3) {
        return buildPdfCard(p1, p2, p3);
      } else if (p2) {
        const p2Trim = p2.trim();
        if (p2Trim.startsWith('/') || p2Trim.startsWith('http') || p2Trim.endsWith('.pdf') || p2Trim.startsWith('#') || p2Trim.includes('href=')) {
          return buildPdfCard(p1, 'Executive Whitepaper · Published by Birendra Mishra', p2Trim);
        }
        return buildPdfCard(p1, p2, '#');
      } else {
        const p1Trim = p1.trim();
        if (p1Trim.startsWith('/') || p1Trim.startsWith('http') || p1Trim.endsWith('.pdf')) {
          return buildPdfCard('Strategic Financial Leadership Executive Framework (PDF)', 'Executive Whitepaper · Published by Birendra Mishra', p1Trim);
        }
        return buildPdfCard(p1, 'Executive Whitepaper · Published by Birendra Mishra', '#');
      }
    }
  );

  // 5. Shortcode Support: [button: Label | URL] or [btn: ...] or [cta: ...]
  processed = processed.replace(
    /(?:<p(?:\s+[^>]*)?>\s*)?(?:\[\[|\[)(?:button|btn|cta):\s*([^|\]]+)(?:\|\s*([^\]]+))?(?:\]\]|\])(?:\s*<\/p>)?/gi,
    (_match, label, url) => {
      const cleanLabel = stripHtml(label) || 'Explore Advisory Services';
      const cleanHref = cleanUrl(url || '#contact');
      return `
<div class="article-btn-wrap">
  <a class="btn btn-primary executive-article-cta" href="${cleanHref}">
    <span>${cleanLabel}</span>
    <span class="cta-arrow" style="margin-left: 0.4rem;">↗</span>
  </a>
</div>`;
    }
  );

  // 6. Shortcode Support: [callout: Title | Text] or [callout: Text]
  processed = processed.replace(
    /(?:<p(?:\s+[^>]*)?>\s*)?(?:\[\[|\[)callout:\s*(?:([^|\]]+)\|)?\s*([^\]]+)(?:\]\]|\])(?:\s*<\/p>)?/gi,
    (_match, title, text) => {
      const header = title ? `<strong>${stripHtml(title)}:</strong> ` : '';
      return `<div class="article-highlight-box">${header}${text.trim()}</div>`;
    }
  );

  // 7. Auto-transform single-paragraph PDF links into executive download cards
  processed = processed.replace(
    /<p(?:\s+[^>]*)?>\s*<a\s+([^>]*href=["']([^"']+)["'][^>]*)>((?:(?!<\/a>)[\s\S])*)<\/a>\s*<\/p>/gi,
    (match, linkAttrs, href, linkText) => {
      const cleanText = stripHtml(linkText);
      const isPdfHref = href.toLowerCase().endsWith('.pdf') || (href.toLowerCase().includes('/uploads/') && href.toLowerCase().includes('.pdf'));
      const isPdfText = /download\s+pdf/i.test(cleanText) || /\bpdf\b/i.test(cleanText);

      if (isPdfHref || isPdfText) {
        const title = isPdfText && !cleanText.toLowerCase().startsWith('download')
          ? cleanText
          : 'Strategic Financial Leadership Executive Framework (PDF)';
        const subtitle = 'Executive Whitepaper · Published by Birendra Mishra';
        return buildPdfCard(title, subtitle, href);
      }
      return match;
    }
  );

  // 8. Auto-transform single-paragraph contact / advisory links into executive pill buttons
  processed = processed.replace(
    /<p(?:\s+[^>]*)?>\s*<a\s+([^>]*href=["']([^"']*)["'][^>]*)>((?:(?!<\/a>)[\s\S])*)<\/a>\s*<\/p>/gi,
    (match, linkAttrs, href, linkText) => {
      const cleanText = stripHtml(linkText);
      const isContactHref = href.includes('#contact') || href.includes('/contact');
      const isCtaText = /[↗→]/.test(cleanText) || /explore\s+advisory/i.test(cleanText) || /get\s+in\s+touch/i.test(cleanText) || /schedule\s+consultation/i.test(cleanText);

      if (isContactHref || isCtaText) {
        // Strip any arrows from the label text since we append .cta-arrow
        const labelOnly = cleanText.replace(/[↗→]/g, '').trim();
        return `
<div class="article-btn-wrap">
  <a class="btn btn-primary executive-article-cta" ${linkAttrs}>
    <span>${labelOnly}</span>
    <span class="cta-arrow" style="margin-left: 0.4rem;">↗</span>
  </a>
</div>`;
      }
      return match;
    }
  );

  // 9. Auto-transform callout paragraphs (Executive Takeaway, Key Takeaway, etc.)
  processed = processed.replace(
    /<p(?:\s+[^>]*)?>\s*<(?:strong|b)>(Executive Takeaway|Key Takeaway|Key Insight|Strategic Takeaway|Strategic Note|Important Note|Action Item|Strategic Priority|Key Learning|Best Practice|Note|Pro Tip|Summary|Recommendation|Executive Summary):?<\/(?:strong|b)>:?\s*((?:(?!<\/p>)[\s\S])*)<\/p>/gi,
    '<div class="article-highlight-box"><strong>$1:</strong> $2</div>'
  );

  // 10. Clean up any unintended wrapping of div blocks inside p tags
  processed = processed.replace(
    /<p(?:\s+[^>]*)?>\s*(<(?:div|figure)[^>]+class=["'](?:article-download-card|article-highlight-box|article-btn-wrap|article-table-wrap)[\s\S]*?<\/(?:div|figure)>)\s*<\/p>/gi,
    '$1'
  );

  return processed;
}

export default function RichTextRenderer({ content }: RichTextRendererProps) {
  if (!content || typeof content !== 'string' || content.trim() === '') {
    return null;
  }

  const sanitizedHtml = processRichTextHtml(content);

  return (
    <div
      className="article-content-body wysiwyg-content"
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
