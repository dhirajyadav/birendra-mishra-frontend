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

  // 3. Strip CKEditor markers & list helper classes
  processed = processed.replace(/--ck-[^;"]+;?/gi, '');
  processed = processed.replace(/class=["']\s*ck-list-marker-[^"']*["']/gi, '');
  processed = processed.replace(/data-list-item-id=["'][^"']*["']/gi, '');

  // 4. Unroll headings mistakenly wrapped in <ol><li> or <ul><li> (common Word paste bug)
  processed = processed.replace(/<(?:ol|ul)[^>]*>\s*<li[^>]*>\s*(<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>)\s*(?:<p>\s*(?:&nbsp;|\s)*<\/p>\s*)?<\/li>\s*<\/(?:ol|ul)>/gi, '$1');
  processed = processed.replace(/<li[^>]*>\s*(<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>)\s*<\/li>/gi, '$1');

  // 5. Demote content <h1> tags to <h2> (page title is already <h1>)
  processed = processed.replace(/<(\/?)h1(?:\s+[^>]*)?>/gi, '<$1h2>');

  // 6. Strip hardcoded Word/Docs styles (fonts, sizes, colors, cell paddings/borders)
  processed = processed.replace(/font-family:\s*['"][^'"]*['"][^;"]*;?/gi, '');
  processed = processed.replace(/font-family:\s*[^;"]+;?/gi, '');
  processed = processed.replace(/font-size:\s*[^;"]+;?/gi, '');
  processed = processed.replace(/background-color:\s*transparent;?/gi, '');
  processed = processed.replace(/background-color:\s*#0b5394;?/gi, '');
  processed = processed.replace(/color:\s*(?:hsl\([^)]+\)|#[0-9a-fA-F]{3,6}|rgb\([^)]+\));?/gi, '');
  processed = processed.replace(/border(?:-[a-z]+)?:\s*[^;"]+;?/gi, '');
  processed = processed.replace(/padding(?:-[a-z]+)?:\s*[^;"]+;?/gi, '');
  processed = processed.replace(/vertical-align:\s*top;?/gi, '');

  // 7. Strip hardcoded width & height attributes on images so they obey responsive executive styling
  processed = processed.replace(/(<img[^>]+?)\s+(?:width|height)=["']\d+["']/gi, '$1');
  processed = processed.replace(/(<img[^>]+?)\s+(?:width|height)=["']\d+["']/gi, '$1');

  // 8. Strip hardcoded width styles from tables & figure.table
  processed = processed.replace(/(<figure[^>]+class=["'][^"']*table[^"']*["'])[^>]*style=["'][^"']*["']/gi, '$1');
  processed = processed.replace(/(<table[^>]*)[^>]*style=["'][^"']*["']/gi, '$1');
  processed = processed.replace(/<colgroup>[\s\S]*?<\/colgroup>/gi, '');

  // 9. Clean empty style attributes
  processed = processed.replace(/style=["']\s*;?\s*["']/gi, '');

  // 10. Unwrap redundant spans
  for (let i = 0; i < 4; i++) {
    processed = processed.replace(/<span\s*>([\s\S]*?)<\/span>/gi, '$1');
  }

  // 11. Remove empty headings and paragraph spacers (&nbsp;, <br>, empty lines)
  processed = processed.replace(/<h[1-6]>\s*(?:&nbsp;|\s|<br\s*\/?>)*<\/h[1-6]>/gi, '');
  processed = processed.replace(/<p>\s*(?:&nbsp;|\s|<br\s*\/?>)*<\/p>/gi, '');
  processed = processed.replace(/(?:<p>\s*&nbsp;\s*<\/p>\s*)+/gi, '');

  // 12. Normalize standalone images to <figure class="article-figure">
  processed = processed.replace(/<p>\s*(?:<[u|span|a][^>]*>\s*)*(<img[^>]+>)(?:\s*<\/[u|span|a]>)*\s*<\/p>/gi, '<figure class="article-figure">$1</figure>');
  processed = processed.replace(/<p>\s*(<img[^>]+>)\s*([\s\S]+?)<\/p>/gi, '<figure class="article-figure">$1</figure><p>$2</p>');

  // 13. Ensure tables have executive wrapper and headers
  processed = processed.replace(/<figure class="table(?:\s+[^"]*)?">\s*<table([^>]*)>/gi, '<div class="article-table-wrap"><table class="article-table"$1>');
  processed = processed.replace(/<\/table>\s*<\/figure>/gi, '</table></div>');
  if (!processed.includes('article-table-wrap')) {
    processed = processed.replace(/(<table[\s\S]*?<\/table>)/gi, '<div class="article-table-wrap">$1</div>');
  }
  processed = processed.replace(/<table(?!\s+class=["'][^"']*article-table)/gi, '<table class="article-table"');

  // Convert first <tr> in tables without <thead> into a <thead> with <th>
  processed = processed.replace(
    /(<table[^>]*>)\s*<tbody>\s*<tr>([\s\S]*?)<\/tr>/gi,
    (match, tableOpen, firstRowContent) => {
      if (firstRowContent.includes('<td') && (firstRowContent.includes('<strong>') || firstRowContent.includes('<b>'))) {
        const headerRow = firstRowContent.replace(/<td(?:\s+[^>]*)?>([\s\S]*?)<\/td>/gi, '<th>$1</th>');
        return `${tableOpen}<thead><tr>${headerRow}</tr></thead><tbody>`;
      }
      return match;
    }
  );

  // 5. Shortcode Support: [pdf: Title | Subtitle | URL] or [[pdf: ...]]
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
