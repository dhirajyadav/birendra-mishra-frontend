import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy policy | Birendra Mishra',
  description:
    'Privacy policy for Birendra Mishra Strategic Financial Leadership website and appointment booking.',
  alternates: {
    canonical: 'https://birendramishra.com/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <main className="section legal-page">
      <div className="container narrow">
        <div className="legal-card">
          <p className="eyebrow">Legal &amp; Governance</p>
          <h1>Privacy policy</h1>
          <p className="legal-date">Last updated: October 2026</p>
          <p className="legal-intro">
            This policy explains how personal information is handled when you use this website, submit
            an enquiry, or book a consultation with Birendra Mishra.
          </p>

          <h2>What we collect</h2>
          <p>
            When you book or enquire, we may collect your name, email address, phone number, company
            name, and the content of your message or booking notes. Technical logs from Google
            Calendar, Gmail and Google Sheets may store related metadata needed to run the booking
            service.
          </p>

          <h2>How we use it</h2>
          <p>
            We use your information to schedule consultations, send confirmations and reminders, create
            Google Meet links, respond to enquiries, and keep a record of appointments. We do not sell
            personal data.
          </p>

          <h2>Legal basis</h2>
          <p>
            Processing is based on your consent (forms and booking) and on legitimate interest in
            providing the requested advisory service and preventing double-booking.
          </p>

          <h2>Retention</h2>
          <p>
            Booking records are retained for as long as needed for the engagement and ordinary
            business records, then deleted or anonymised where practicable.
          </p>

          <h2>Sharing</h2>
          <p>
            Booking data is processed using Google services (Calendar, Gmail, Sheets, Meet) under the
            site owner’s Google account. Payment, if enabled, is handled by the payment provider you
            are redirected to (e.g. Stripe or PayPal).
          </p>

          <h2>Your rights</h2>
          <p>
            You may request access, correction or deletion of your personal data by emailing{' '}
            <a href="mailto:bbm@birendramishra.com">bbm@birendramishra.com</a>.
          </p>

          <h2>Cookies &amp; analytics</h2>
          <p>
            This site is designed to work without non-essential cookies. If a cookie-free analytics
            script is later enabled in configuration, it will be disclosed here.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about privacy:{' '}
            <a href="mailto:bbm@birendramishra.com">bbm@birendramishra.com</a>.
          </p>
        </div>
      </div>
    </main>
  );
}

