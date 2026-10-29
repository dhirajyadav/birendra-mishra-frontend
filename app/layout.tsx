import type { Metadata } from 'next';
import { siteUrl } from '../lib/cms';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Birendra Mishra | Strategic Financial Leadership',
  description: 'Strategic financial leadership for complex decisions, international growth and enduring enterprise value.',
  icons: { icon: '/assets/favicon.svg' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-GB">
    <head>
      <meta name="theme-color" content="#101d2a" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="/css/styles.css" />
    </head>
    <body>{children}</body>
  </html>;
}
