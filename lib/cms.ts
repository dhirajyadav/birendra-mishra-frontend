export type CmsItem = {
  title?: string | null;
  number?: string | null;
  buttonText?: string | null;
  buttonUrl?: string | null;
  description?: string | null;
  body?: string | null;
  label?: string | null;
  value?: string | null;
  url?: string | null;
  order?: number | null;
  featured?: boolean | null;
  consultationId?: string | null;
  durationMinutes?: number | null;
  fee?: number | string | null;
  feeLabel?: string | null;
  bookable?: boolean | null;
  paymentLink?: string | null;
  colour?: string | null;
};

export type CmsSection = {
  __component: string;
  eyebrow?: string | null;
  heading?: string | null;
  description?: string | null;
  disclaimer?: string | null;
  body?: string | null;
  primaryButtonText?: string | null;
  primaryButtonUrl?: string | null;
  secondaryButtonText?: string | null;
  secondaryButtonUrl?: string | null;
  items?: CmsItem[];
};

export type CmsSeo = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  noIndex?: boolean;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImageUrl?: string | null;
  twitterCard?: 'summary' | 'summary_large_image' | null;
  jsonLd?: unknown;
};

export type CmsPage = {
  title?: string | null;
  slug?: string | null;
  siteName?: string | null;
  hero?: CmsSection | null;
  pillars?: CmsSection | null;
  about?: CmsSection | null;
  expertise?: CmsSection | null;
  services?: CmsSection | null;
  philosophy?: CmsSection | null;
  pricing?: CmsSection | null;
  approach?: CmsSection | null;
  insights?: CmsSection | null;
  faq?: CmsSection | null;
  contact?: CmsSection | null;
  siteChrome?: {
    brandName?: string | null;
    tagline?: string | null;
    headerLinks?: CmsItem[];
    footerIntro?: string | null;
    footerEmail?: string | null;
    exploreLinks?: CmsItem[];
    legalLinks?: CmsItem[];
    footerTagline?: string | null;
    copyrightText?: string | null;
  } | null;
  seo?: CmsSeo | null;
};

const apiUrl = (process.env.STRAPI_API_URL || 'http://localhost:1337').replace(/\/$/, '');

async function cmsGet(path: string): Promise<CmsPage | null> {
  try {
    const response = await fetch(`${apiUrl}/api/site-content/${path}`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const result = await response.json();
    return result?.data ?? null;
  } catch {
    return null;
  }
}

export function getHomepage() {
  return cmsGet('homepage');
}

export function getCmsPage(slug: string) {
  return cmsGet(`pages/${encodeURIComponent(slug)}`);
}

export function sectionByName(page: CmsPage | null, name: string) {
  const fields: Record<string, CmsSection | null | undefined> = {
    hero: page?.hero, pillars: page?.pillars, about: page?.about,
    expertise: page?.expertise, services: page?.services, philosophy: page?.philosophy,
    pricing: page?.pricing, approach: page?.approach, insights: page?.insights,
    faq: page?.faq, contact: page?.contact,
  };
  return fields[name] ?? null;
}

export const DEFAULT_CONSULTATIONS = [
  { id: 'discovery', name: 'Discovery Call', durationMinutes: 15, fee: 0, feeLabel: 'Complimentary', description: 'A short introductory conversation to explore fit, scope and next steps. No obligation.', bookable: true, paymentLink: '', colour: 'gold' },
  { id: 'strategy-60', name: 'Strategy Consultation', durationMinutes: 60, fee: 450, feeLabel: null, description: 'Focused 60-minute session on financial strategy, capital decisions or organisational priorities.', bookable: true, paymentLink: '', colour: 'navy' },
  { id: 'ma-review', name: 'M&A / Deal Review', durationMinutes: 90, fee: 750, feeLabel: null, description: 'In-depth review of an acquisition, divestiture, due-diligence findings or integration plan.', bookable: true, paymentLink: '', colour: 'ink' },
  { id: 'retainer', name: 'Monthly Advisory Retainer', durationMinutes: 0, fee: null, feeLabel: 'By enquiry', description: 'Ongoing strategic advisory for executive leadership. Scoped to your needs — contact to discuss.', bookable: false, paymentLink: '', colour: 'accent' },
];

export function consultationsFrom(homepage: CmsPage | null) {
  const pricing = sectionByName(homepage, 'pricing');
  if (!pricing?.items?.length) return DEFAULT_CONSULTATIONS;
  return pricing.items.map((item, index) => {
    const fallback = DEFAULT_CONSULTATIONS.find((consultation) =>
      consultation.id === item.consultationId || consultation.name === item.title,
    ) ?? DEFAULT_CONSULTATIONS[index];
    if (!fallback) return null;
    return {
      ...fallback,
      id: item.consultationId || fallback.id,
      name: item.title || fallback.name,
      buttonText: item.buttonText ?? (fallback.bookable ? 'Book' : 'Enquire'),
      buttonUrl: item.buttonUrl ?? '',
      durationMinutes: item.durationMinutes ?? fallback.durationMinutes,
      fee: item.fee === null || item.fee === undefined || item.fee === '' ? fallback.fee : Number(item.fee),
      feeLabel: item.feeLabel === undefined ? fallback.feeLabel : item.feeLabel,
      description: item.description
        ? (() => {
            const parts = item.description.split(/\s*[\u00b7\u2022]\s*/);
            return parts.length > 2 ? parts.slice(2).join(' \u00b7 ') || fallback.description : item.description;
          })()
        : fallback.description,
      bookable: item.bookable ?? fallback.bookable,
      paymentLink: item.paymentLink ?? fallback.paymentLink,
      colour: item.colour ?? fallback.colour,
    };
  }).filter((item): item is NonNullable<typeof item> => Boolean(item));
}

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://birendramishra.com').replace(/\/$/, '');
