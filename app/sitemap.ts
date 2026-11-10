import { MetadataRoute } from 'next';
import { getArticles } from '@/lib/strapi';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://birendramishra.com';
  const articles = await getArticles();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/insights`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date('2026-10-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date('2026-10-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const articleRoutes: MetadataRoute.Sitemap = articles.map((art) => ({
    url: `${baseUrl}/insights/${art.slug}`,
    lastModified: art.updatedAt ? new Date(art.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...articleRoutes];
}

