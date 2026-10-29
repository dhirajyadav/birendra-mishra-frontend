import type { Metadata } from 'next';
import { LegacyMarkup } from '../components/legacy-markup';
import { renderLegacyBody } from '../lib/templates';

export const metadata: Metadata = { title: 'Page not found | Birendra Mishra', robots: { index: false, follow: false } };

export default async function NotFound() {
  const html = await renderLegacyBody('404.html');
  return <LegacyMarkup html={html} scripts={['main.js']} />;
}
