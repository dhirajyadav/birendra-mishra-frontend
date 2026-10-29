import type { Metadata } from 'next';
import { LegacyMarkup } from '../components/legacy-markup';
import { consultationsFrom, getHomepage, siteUrl } from '../lib/cms';
import { renderLegacyBody } from '../lib/templates';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomepage();
  const seo = page?.seo;
  return {
    title: seo?.metaTitle || 'Birendra Mishra | Strategic Financial Leadership',
    description: seo?.metaDescription || 'Strategic financial leadership for complex decisions, international growth and enduring enterprise value.',
    alternates: { canonical: seo?.canonicalUrl || `${siteUrl}/` },
    robots: seo?.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: { title: seo?.ogTitle || seo?.metaTitle || 'Birendra Mishra | Strategic Financial Leadership', description: seo?.ogDescription || seo?.metaDescription || undefined, url: `${siteUrl}/`, images: seo?.ogImageUrl ? [seo.ogImageUrl] : ['/assets/og-image.svg'], type: 'website' },
    twitter: { card: seo?.twitterCard || 'summary_large_image', title: seo?.ogTitle || seo?.metaTitle || undefined, description: seo?.ogDescription || seo?.metaDescription || undefined, images: seo?.ogImageUrl ? [seo.ogImageUrl] : ['/assets/og-image.svg'] },
  };
}

export default async function HomePage() {
  const homepage = await getHomepage();
  const consultations = consultationsFrom(homepage);
  const html = await renderLegacyBody('index.html', homepage, consultations);
  const jsonLd = homepage?.seo?.jsonLd || {
    '@context': 'https://schema.org', '@type': 'ProfessionalService', name: 'Birendra Mishra — Strategic Financial Leadership',
    url: siteUrl, email: 'bbm@birendramishra.com', areaServed: 'Worldwide',
    founder: { '@type': 'Person', name: 'Birendra Mishra', jobTitle: 'Strategic Financial Advisor' },
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} /><LegacyMarkup html={html} consultations={consultations} scripts={['main.js']} /></>;
}
