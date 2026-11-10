import type { Metadata } from 'next';
import '@/styles/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ThemeScript from '@/components/ThemeScript';
import InteractiveScripts from '@/components/InteractiveScripts';
import { getGlobalSettings } from '@/lib/strapi';

export const metadata: Metadata = {
  title: 'Birendra Mishra | Strategic Financial Leadership',
  description:
    'Strategic financial leadership for complex decisions, international growth and enduring enterprise value. Book a confidential consultation with Birendra Mishra.',
  metadataBase: new URL('https://birendramishra.com'),
  alternates: {
    canonical: 'https://birendramishra.com/',
  },
  icons: {
    icon: '/assets/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://birendramishra.com/',
    title: 'Birendra Mishra | Strategic Financial Leadership',
    description:
      'Clarity for your next chapter. Strategic financial leadership for complex decisions, international growth and enduring enterprise value.',
    images: [
      {
        url: '/assets/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Birendra Mishra — Strategic Financial Leadership',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Birendra Mishra | Strategic Financial Leadership',
    description:
      'Strategic financial leadership for complex decisions, international growth and enduring enterprise value.',
    images: ['/assets/og-image.svg'],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const globalSettings = await getGlobalSettings();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Birendra Mishra — Strategic Financial Leadership',
    description:
      'Strategic financial leadership for complex decisions, international growth and enduring enterprise value.',
    url: 'https://birendramishra.com/',
    email: 'bbm@birendramishra.com',
    areaServed: 'Worldwide',
    priceRange: '$$',
    founder: {
      '@type': 'Person',
      name: 'Birendra Mishra',
      jobTitle: 'Strategic Financial Advisor',
      email: 'bbm@birendramishra.com',
    },
    knowsAbout: [
      'M&A',
      'FP&A',
      'Capital Allocation',
      'Risk & Controls',
      'Capital Governance',
      'Cross-Border Leadership',
    ],
    availableLanguage: ['en'],
  };

  return (
    <html lang="en-GB">
      <head>
        <meta name="theme-color" content="#041D56" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Manrope:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ThemeScript />
        <Header settings={globalSettings} />
        {children}
        <Footer settings={globalSettings} />
        <InteractiveScripts />
      </body>
    </html>
  );
}

