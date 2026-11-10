import React from 'react';
import HeroSection from '@/components/sections/HeroSection';
import PillarsSection from '@/components/sections/PillarsSection';
import MeetBirendraSection from '@/components/sections/MeetBirendraSection';
import PurposeMissionValuesSection from '@/components/sections/PurposeMissionValuesSection';
import AspirationSection from '@/components/sections/AspirationSection';
import CapabilitiesSection from '@/components/sections/CapabilitiesSection';
import InsightsSection from '@/components/sections/InsightsSection';
import AdvisorySection from '@/components/sections/AdvisorySection';
import FaqSection from '@/components/sections/FaqSection';
import ContactSection from '@/components/sections/ContactSection';
import { getGlobalSettings, getLatestArticles, getHomepage } from '@/lib/strapi';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const [globalSettings, latestArticles, homepage] = await Promise.all([
    getGlobalSettings(),
    getLatestArticles(3),
    getHomepage(),
  ]);

  return (
    <main>
      <HeroSection data={homepage?.hero} />
      <PillarsSection data={homepage?.pillars} />

      {/* =========================================================
           Meet Birendra (Merged: About, Principles, Aspiration)
           ========================================================= */}
      <section className="section meet-birendra-section" id="meet-birendra" aria-label="Meet Birendra">
        <div className="container about-container">
          <MeetBirendraSection data={homepage?.meetBirendra} />
          <PurposeMissionValuesSection data={homepage?.purposeMissionValues} />
          <AspirationSection data={homepage?.aspiration} />
        </div>
      </section>

      <CapabilitiesSection data={homepage?.capabilities} />
      <InsightsSection
        data={homepage?.insights}
        articles={latestArticles}
        linkedInUrl={globalSettings?.linkedInUrl || 'https://www.linkedin.com/'}
      />
      <AdvisorySection data={homepage?.advisory} />
      <FaqSection
        data={homepage?.faq}
        isHidden={homepage?.faq?.isVisible === false}
      />
      <ContactSection
        data={homepage?.contact}
        linkedInUrl={globalSettings?.linkedInUrl || 'https://www.linkedin.com/'}
        contactEmail={globalSettings?.contactEmail || 'contact@birendramishra.com'}
      />
    </main>
  );
}
