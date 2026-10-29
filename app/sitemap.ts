import type { MetadataRoute } from 'next';
import { siteUrl } from '../lib/cms';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', 'book.html', 'privacy.html', 'terms.html'].map((path) => ({ url: `${siteUrl}/${path}`, changeFrequency: path ? 'yearly' : 'weekly', priority: path ? 0.5 : 1 }));
}
