import { GlobalSettings, PageData, Article, Category, HomepageData } from './types';

export const STRAPI_URL =
  process.env.STRAPI_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://sienna-ibis-828899.hostingersite.com'
    : 'http://127.0.0.1:1337');
export const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || '';

export function getStrapiMediaUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `${STRAPI_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

export async function fetchFromStrapi<T>(
  endpoint: string,
  params: Record<string, string> = {},
  revalidate: number = 0
): Promise<T | null> {
  const query = new URLSearchParams(params).toString();
  const url = `${STRAPI_URL}/api/${endpoint}${query ? `?${query}` : ''}`;

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (STRAPI_TOKEN) {
      headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
    }

    const fetchOptions: RequestInit = {
      headers,
    };
    if (revalidate === 0) {
      fetchOptions.cache = 'no-store';
    } else {
      fetchOptions.next = { revalidate };
    }

    const res = await fetch(url, fetchOptions);

    if (!res.ok) {
      console.error(`[Strapi Fetch Failed] ${url} returned ${res.status}: ${res.statusText}`);
      return null;
    }

    const json = await res.json();
    return json.data as T;
  } catch (err: any) {
    console.error(`[Strapi Network Error] ${url}:`, err?.message || err);
    return null;
  }
}

// Fallback Global Settings matching index.html
export const defaultGlobalSettings: GlobalSettings = {
  siteName: 'Birendra Mishra',
  siteTagline: 'Strategic Financial Leadership',
  ownerName: 'Birendra Mishra',
  ownerTitle: 'Strategic Financial Advisor',
  contactEmail: 'bbm@birendramishra.com',
  linkedInUrl: 'https://www.linkedin.com/',
  xUrl: 'https://x.com/',
  substackUrl: 'https://substack.com/',
  copyrightText: '© {year} Birendra Mishra. All rights reserved. Personal views expressed here are independent and do not necessarily represent those of any employer or client or others.',
  navDropdownAbout: {
    label: 'About',
    items: [
      {
        title: 'Executive Profile',
        description: 'Senior executive & strategic capabilities',
        url: '#birendra',
      },
      {
        title: 'Purpose, Mission & Values',
        description: 'Core fiduciary & strategic principles',
        url: '#purpose-mission-values',
      },
      {
        title: 'Aspiration',
        description: 'Vision for enterprise transformation',
        url: '#aspiration',
      },
    ],
  },
  navDropdownCapabilities: {
    label: 'Capabilities',
    items: [
      { title: 'M&A', url: '#cap-ma' },
      { title: 'AI in Finance', url: '#cap-ai' },
      { title: 'Capital Allocation & Governance', url: '#cap-governance' },
      { title: 'Risk & Controls', url: '#cap-risk' },
    ],
  },
  navLinks: [
    { label: 'Insights', url: '/insights' },
    { label: 'Advisory', url: '/#solutions' },
    { label: 'Contact', url: '/#contact' },
  ],
};

// Fallback Articles matching index.html Insights section
export const defaultArticles: Article[] = [
  {
    id: 1,
    title: 'From headline to financial consequence',
    slug: 'from-headline-to-financial-consequence',
    shortDescription: 'Examining how geopolitical events, supply shifts and market structures translate into financial and strategic decisions.',
    excerpt: 'Examining how geopolitical events, supply shifts and market structures translate into financial and strategic decisions.',
    readingTime: '5 min read',
    featuredArticle: true,
    publishedAt: '2026-11-01',
    category: { id: 1, name: 'Markets & Geopolitics', slug: 'markets-geopolitics' },
    author: { id: 1, name: 'Birendra Mishra', role: 'Senior Executive' },
    linkedInPostUrl: 'https://www.linkedin.com/',
    blocks: [
      {
        __component: 'article-blocks.heading',
        id: 1,
        level: 'h2',
        text: 'The Intersection of Energy Headlines and Capital Governance',
      },
      {
        __component: 'article-blocks.paragraph',
        id: 2,
        content: 'In volatile global commodity cycles, macro headlines create immediate market friction. However, executive financial leadership requires translating raw geopolitical movement into actionable capital discipline, risk management, and strategic balance sheet positioning.',
      },
      {
        __component: 'article-blocks.quote',
        id: 3,
        quote: 'Financial leadership is not merely the recording of the past—it is the strategic design of the future.',
        author: 'Birendra Mishra',
      },
      {
        __component: 'article-blocks.heading',
        id: 4,
        level: 'h3',
        text: 'Discipline Across Operating Jurisdictions',
      },
      {
        __component: 'article-blocks.paragraph',
        id: 5,
        content: 'From corporate headquarters to deep operational joint ventures in emerging markets, capital preservation demands structured audit-readiness, robust internal controls, and transparent stakeholder alignment.',
      },
    ],
  },
  {
    id: 2,
    title: 'Capital through a CFO lens',
    slug: 'capital-through-a-cfo-lens',
    shortDescription: 'Connecting energy-market developments with investment discipline, cash flow, portfolio choices and enterprise value.',
    excerpt: 'Connecting energy-market developments with investment discipline, cash flow, portfolio choices and enterprise value.',
    readingTime: '6 min read',
    publishedAt: '2026-10-25',
    category: { id: 2, name: 'Finance & Investment', slug: 'finance-investment' },
    author: { id: 1, name: 'Birendra Mishra', role: 'Senior Executive' },
    linkedInPostUrl: 'https://www.linkedin.com/',
    blocks: [
      {
        __component: 'article-blocks.paragraph',
        id: 1,
        content: 'Allocating capital effectively requires defining threshold metrics that withstand commodity price volatility. Long-term enterprise value is built by protecting capital buffers and prioritizing disciplined investments.',
      },
    ],
  },
  {
    id: 3,
    title: 'Strategy beyond the numbers',
    slug: 'strategy-beyond-the-numbers',
    shortDescription: 'Perspectives on transition, AI, organisational leadership and the decisions shaping the future of the energy business.',
    excerpt: 'Perspectives on transition, AI, organisational leadership and the decisions shaping the future of the energy business.',
    readingTime: '7 min read',
    publishedAt: '2026-10-18',
    category: { id: 3, name: 'Energy · Technology · Leadership', slug: 'energy-tech-leadership' },
    author: { id: 1, name: 'Birendra Mishra', role: 'Senior Executive' },
    linkedInPostUrl: 'https://www.linkedin.com/',
    blocks: [
      {
        __component: 'article-blocks.paragraph',
        id: 1,
        content: 'Applied artificial intelligence in corporate finance changes the velocity and depth of strategic scenario planning. When coupled with cross-border operational experience, leadership teams can identify market shifts earlier and execute decisive transformations.',
      },
    ],
  },
];

export async function getGlobalSettings(): Promise<GlobalSettings> {
  const data = await fetchFromStrapi<{ attributes?: GlobalSettings } & GlobalSettings>('global', { populate: '*' });
  if (data) {
    return (data.attributes || data) as GlobalSettings;
  }
  return defaultGlobalSettings;
}

export async function getArticles(): Promise<Article[]> {
  const data = await fetchFromStrapi<Article[]>('articles', {
    populate: '*',
    'sort[0]': 'publishedAt:desc',
  });
  if (data && Array.isArray(data) && data.length > 0) {
    return data;
  }
  return defaultArticles;
}

/**
 * Fetches the latest published articles for the Homepage Insights section.
 * - Filters strictly to published articles (Strapi default).
 * - Sorts by publishedAt descending.
 * - Limits strictly to `limit` entries (default 3).
 * - Populates category, author, and featured media.
 * - Gracefully handles empty or error state.
 */
export async function getLatestArticles(limit: number = 3): Promise<Article[]> {
  const params: Record<string, string> = {
    populate: '*',
    'sort[0]': 'publishedAt:desc',
    'pagination[pageSize]': String(limit),
  };

  try {
    const data = await fetchFromStrapi<Article[]>('articles', params, 0);
    if (data && Array.isArray(data)) {
      return data;
    }
  } catch (err) {
    console.error('Error fetching latest published articles from Strapi:', err);
  }
  return [];
}

export async function getArticleBySlug(slug: string, preview: boolean = false): Promise<Article | null> {
  const params: Record<string, string> = {
    'filters[slug][$eq]': slug,
    populate: '*',
  };
  if (preview) {
    params['status'] = 'draft';
  }
  const data = await fetchFromStrapi<Article[]>('articles', params);
  if (data && Array.isArray(data) && data.length > 0) {
    return data[0];
  }
  return defaultArticles.find((a) => a.slug === slug) || null;
}

export async function getCategories(): Promise<Category[]> {
  const data = await fetchFromStrapi<Category[]>('categories', { populate: '*' });
  if (data && Array.isArray(data) && data.length > 0) {
    return data;
  }
  return [
    { id: 1, name: 'Markets & Geopolitics', slug: 'markets-geopolitics' },
    { id: 2, name: 'Finance & Investment', slug: 'finance-investment' },
    { id: 3, name: 'Energy · Technology · Leadership', slug: 'energy-tech-leadership' },
  ];
}

export async function getHomepage(): Promise<HomepageData | null> {
  const populateParams: Record<string, string> = {
    'populate[hero][populate]': '*',
    'populate[pillars][populate]': '*',
    'populate[meetBirendra][populate]': '*',
    'populate[purposeMissionValues][populate]': '*',
    'populate[aspiration][populate]': '*',
    'populate[capabilities][populate]': '*',
    'populate[insights][populate]': '*',
    'populate[advisory][populate]': '*',
    'populate[faq][populate]': '*',
    'populate[contact][populate]': '*',
  };

  try {
    const data = await fetchFromStrapi<{ attributes?: HomepageData } & HomepageData>('homepage', populateParams, 0);
    if (data) {
      return (data.attributes || data) as HomepageData;
    }
  } catch {}
  return null;
}


