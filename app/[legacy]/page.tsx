import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { LegacyMarkup } from '../../components/legacy-markup';
import { consultationsFrom, getCmsPage, getHomepage, siteUrl } from '../../lib/cms';
import { renderLegacyBody } from '../../lib/templates';

const routes: Record<string, { template: string; slug: string; scripts: string[] }> = {
  'book.html': { template: 'book.html', slug: 'book', scripts: ['main.js', 'demo.js', 'booking.js'] },
  'manage.html': { template: 'manage.html', slug: 'manage', scripts: ['main.js', 'demo.js', 'manage.js'] },
  'privacy.html': { template: 'privacy.html', slug: 'privacy', scripts: ['main.js'] },
  'terms.html': { template: 'terms.html', slug: 'terms', scripts: ['main.js'] },
};

type Props = { params: Promise<{ legacy: string }> };
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { legacy } = await params;
  const route = routes[legacy];
  if (!route) return { title: 'Page not found', robots: { index: false, follow: false } };
  const page = await getCmsPage(route.slug);
  const seo = page?.seo;
  const canonical = seo?.canonicalUrl || `${siteUrl}/${legacy}`;
  return {
    title: seo?.metaTitle || page?.title || 'Birendra Mishra',
    description: seo?.metaDescription || undefined,
    alternates: { canonical },
    robots: route.slug === 'manage' || seo?.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: { title: seo?.ogTitle || seo?.metaTitle || page?.title || 'Birendra Mishra', description: seo?.ogDescription || seo?.metaDescription || undefined, url: canonical, images: seo?.ogImageUrl ? [seo.ogImageUrl] : undefined },
    twitter: { card: seo?.twitterCard || 'summary_large_image', title: seo?.ogTitle || seo?.metaTitle || page?.title || undefined, description: seo?.ogDescription || seo?.metaDescription || undefined, images: seo?.ogImageUrl ? [seo.ogImageUrl] : undefined },
  };
}

export default async function LegacyPage({ params }: Props) {
  const { legacy } = await params;
  if (legacy === 'index.html') redirect('/');
  const route = routes[legacy];
  if (!route) notFound();
  const page = await getCmsPage(route.slug);
  const homepage = route.slug === 'book' ? await getHomepage() : null;
  const bookingContent = page?.pricing ? page : homepage;
  const consultations = route.slug === 'book' ? consultationsFrom(bookingContent || null) : [];
  const html = await renderLegacyBody(route.template, page, consultations, homepage);
  const pageData = page?.seo?.jsonLd;
  return <>{pageData ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageData).replace(/</g, '\\u003c') }} /> : null}<LegacyMarkup html={html} consultations={homepage ? consultationsFrom(homepage) : []} scripts={route.scripts} /></>;
}
