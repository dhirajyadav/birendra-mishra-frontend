import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of engagement | Birendra Mishra',
  description:
    'Terms of engagement for consultations with Birendra Mishra Strategic Financial Leadership.',
  alternates: {
    canonical: 'https://birendramishra.com/terms',
  },
};

export default function TermsPage() {
  return (
    <main className="section legal-page">
      <div className="container narrow">
        <div className="legal-card">
          <p className="eyebrow">Legal &amp; Governance</p>
          <h1>Terms of engagement</h1>
          <p className="legal-date">Last updated: October 2026</p>

          <h2>Nature of services</h2>
          <p>
            Consultations provide strategic financial leadership advice for informational and
            professional discussion purposes. They do not constitute legal, tax, audit or regulated
            investment advice unless separately agreed in writing.
          </p>

          <h2>Bookings &amp; fees</h2>
          <p>
            Fees displayed on the website are set by the practice owner and may be marked as
            placeholders until confirmed. Paid sessions may require payment via a third-party link
            before confirmation. Discovery calls, where offered as complimentary, carry no fee.
          </p>

          <h2>Cancellations &amp; rescheduling</h2>
          <p>
            You may cancel or request a reschedule using the link in your confirmation email.
            Reasonable notice is appreciated so the slot can be released. Specific cancellation
            policies for paid sessions may be confirmed in your booking email.
          </p>

          <h2>Confidentiality</h2>
          <p>
            Discussions are treated as confidential. You agree not to share meeting links with
            unauthorised parties.
          </p>

          <h2>Technology</h2>
          <p>
            Meetings are typically held on Google Meet. You are responsible for a suitable device,
            connection and quiet environment.
          </p>

          <h2>Limitation</h2>
          <p>
            To the fullest extent permitted by law, liability arising from a consultation is limited
            to the fee paid for that session.
          </p>

          <h2>Contact</h2>
          <p>
            Questions regarding terms:{' '}
            <a href="mailto:bbm@birendramishra.com">bbm@birendramishra.com</a>.
          </p>
        </div>
      </div>
    </main>
  );
}

