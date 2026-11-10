export interface StrapiMedia {
  id: number;
  documentId?: string;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: Record<string, any>;
  url: string;
}

export interface NavLink {
  id?: number;
  label: string;
  url: string;
  isExternal?: boolean;
}

export interface NavDropdownItem {
  id?: number;
  title: string;
  description?: string;
  url: string;
}

export interface NavDropdown {
  id?: number;
  label: string;
  items: NavDropdownItem[];
}

export interface GlobalSettings {
  siteName: string;
  siteTagline: string;
  ownerName: string;
  ownerTitle: string;
  contactEmail: string;
  linkedInUrl: string;
  xUrl?: string;
  substackUrl?: string;
  whatsAppNumber?: string;
  copyrightText: string;
  navDropdownAbout?: NavDropdown;
  navDropdownCapabilities?: NavDropdown;
  navLinks?: NavLink[];
  seoDefaults?: {
    metaTitle: string;
    metaDescription: string;
    shareImage?: StrapiMedia;
  };
}

export interface Author {
  id: number;
  documentId?: string;
  name: string;
  role?: string;
  bio?: string;
  avatar?: StrapiMedia;
}

export interface Category {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Tag {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
}

export interface ArticleBlock {
  __component: string;
  id: number;
  [key: string]: any;
}

export interface Article {
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  shortDescription?: string;
  excerpt?: string;
  readingTime?: string;
  featuredArticle?: boolean;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  featuredImage?: StrapiMedia;
  thumbnailImage?: StrapiMedia;
  author?: Author;
  category?: Category;
  tags?: Tag[];
  content?: string;
  blocks?: ArticleBlock[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  canonicalUrl?: string;
  openGraphImage?: StrapiMedia;
  linkedInPostUrl?: string;
  linkedInPublishStatus?: string;
}

export interface PageSection {
  __component: string;
  id: number;
  [key: string]: any;
}

export interface PageData {
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  description?: string;
  sections?: PageSection[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  canonicalUrl?: string;
  openGraphImage?: StrapiMedia;
}

// ============================================================================
// HOMEPAGE SECTION TYPES (Strapi 5 Fixed Section Components - NO Dynamic Zones)
// ============================================================================

export interface HeroSectionData {
  eyebrow?: string;
  titlePrefix?: string;
  titleHighlight?: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
  focusLabel?: string;
  focusValue?: string;
  coreLabel?: string;
  coreValue?: string;
  experienceLabel?: string;
  experienceValue?: string;
  engagementLabel?: string;
  engagementValue?: string;
  discretionLabel?: string;
  discretionValue?: string;
  trustItems?: { id?: number; text: string }[];
}

export interface PillarItem {
  id?: number;
  number: string;
  title: string;
  description: string;
}

export interface PillarsSectionData {
  items?: PillarItem[];
}

export interface TagBadge {
  id?: number;
  title: string;
  subtitle?: string;
}

export interface CapabilityValueCard {
  id?: number;
  title: string;
  description: string;
}

export interface MeetBirendraSectionData {
  eyebrow?: string;
  title?: string;
  subheadline?: string;
  photo?: StrapiMedia;
  photoBadgeText?: string;
  metric1Value?: string;
  metric1Label?: string;
  metric2Value?: string;
  metric2Label?: string;
  metricHighlightText?: string;
  tagBadges?: TagBadge[];
  bioParagraph1?: string;
  bioParagraph2?: string;
  bioParagraph3?: string;
  capabilitiesHeading?: string;
  capabilitiesLead?: string;
  capabilityValueCards?: CapabilityValueCard[];
  philosophyQuote?: string;
  connectTitle?: string;
  connectDescription?: string;
  connectCtaText?: string;
  connectCtaUrl?: string;
}

export interface PurposeMissionValuesSectionData {
  eyebrow?: string;
  title?: string;
  lead?: string;
  purposeNumber?: string;
  purposeTitle?: string;
  purposeDescription?: string;
  missionNumber?: string;
  missionTitle?: string;
  missionDescription?: string;
  valuesNumber?: string;
  valuesTitle?: string;
  valuesDescription?: string;
}

export interface AspirationPillar {
  id?: number;
  number: string;
  title: string;
  description: string;
}

export interface AspirationSectionData {
  eyebrow?: string;
  quote?: string;
  pillars?: AspirationPillar[];
}

export interface CapabilityPillar {
  id?: number;
  pillarNumber: string;
  watermark: string;
  tag: string;
  title: string;
  slug: string;
  description: string;
  subbox1Title: string;
  subbox1Description: string;
  subbox2Title: string;
  subbox2Description: string;
}

export interface CapabilitiesSectionData {
  eyebrow?: string;
  title?: string;
  lead?: string;
  pillars?: CapabilityPillar[];
}

export interface InsightCardItem {
  id?: number;
  tag: string;
  title: string;
  description: string;
  linkUrl: string;
  linkLabel?: string;
}

export interface InsightsSectionData {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  lead?: string;
  metaNote?: string;
  linkedinBtnText?: string;
  linkedinBtnUrl?: string;
  fallbackCards?: InsightCardItem[];
}

export interface AdvisoryItem {
  id?: number;
  title: string;
  description: string;
}

export interface AdvisorySectionData {
  eyebrow?: string;
  title?: string;
  callout?: string;
  ctaText?: string;
  ctaUrl?: string;
  introText?: string;
  items?: AdvisoryItem[];
}

export interface FaqItem {
  id?: number;
  question: string;
  answer: string;
}

export interface FaqSectionData {
  eyebrow?: string;
  heading?: string;
  subhead?: string;
  isVisible?: boolean;
  items?: FaqItem[];
}

export interface ContactSectionData {
  eyebrow?: string;
  titleKicker?: string;
  titleMain?: string;
  description?: string;
  execName?: string;
  execRole?: string;
  linkedinBadgeText?: string;
  linkedinUrl?: string;
  formNameLabel?: string;
  formNamePlaceholder?: string;
  formEmailLabel?: string;
  formEmailPlaceholder?: string;
  formTypeLabel?: string;
  formMessageLabel?: string;
  formMessagePlaceholder?: string;
  formSubmitText?: string;
  formDisclaimer?: string;
}

export interface HomepageData {
  id?: number;
  documentId?: string;
  hero?: HeroSectionData;
  pillars?: PillarsSectionData;
  meetBirendra?: MeetBirendraSectionData;
  purposeMissionValues?: PurposeMissionValuesSectionData;
  aspiration?: AspirationSectionData;
  capabilities?: CapabilitiesSectionData;
  insights?: InsightsSectionData;
  advisory?: AdvisorySectionData;
  faq?: FaqSectionData;
  contact?: ContactSectionData;
  seoTitle?: string;
  seoDescription?: string;
}
