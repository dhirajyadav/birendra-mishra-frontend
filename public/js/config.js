/**
 * SITE CONFIGURATION — edit fees, hours, links here.
 * Mirrored in apps-script/Code.gs as CONFIG.
 * All fee values marked PLACEHOLDER until the owner sets real amounts.
 */
window.SITE_CONFIG = {
  // ── Brand ──────────────────────────────────────────────
  brandName: 'Birendra Mishra',
  brandTagline: 'Strategic Financial Leadership',
  ownerName: 'Birendra Mishra',
  ownerEmail: 'aidhiraj3@gmail.com',
  contactEmail: 'aidhiraj3@gmail.com',
  linkedInUrl: 'https://www.linkedin.com/in/', // PLACEHOLDER — set real LinkedIn URL
  whatsAppNumber: '', // PLACEHOLDER e.g. '971501234567' (digits only, country code, no +)
  siteUrl: 'https://birendramishra.com/', // update after deploy
  timezone: 'Asia/Dubai',

  // ── Backend ────────────────────────────────────────────
  // Leave empty for DEMO MODE (mock slots + mock confirmation).
  // After deploying Apps Script, paste the web-app URL here:
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwpZ7ZS4eO-cQmFa6trn3ilRPpmjMmAvhpxLCi4vwQvhljtatoj_DTq_oOQ46QBjxq6/exec',

  // ── Booking window ─────────────────────────────────────
  bookingWindowDays: 60,       // book up to 2 months ahead
  minLeadHours: 24,            // no same-day; earliest = tomorrow
  bufferMinutes: 15,           // gap between meetings
  workingHours: {
    // Day of week 0=Sun … 6=Sat — times in Asia/Dubai
    0: null,                   // Sunday closed
    1: { start: '09:00', end: '17:00' },
    2: { start: '09:00', end: '17:00' },
    3: { start: '09:00', end: '17:00' },
    4: { start: '09:00', end: '17:00' },
    5: { start: '09:00', end: '17:00' },
    6: null                    // Saturday closed
  },
  blockedDates: [
    // '2026-12-25', '2027-01-01'
  ],

  // ── Currency (PLACEHOLDER) ─────────────────────────────
  currency: 'USD',
  currencySymbol: '$',

  // ── Consultation types (PLACEHOLDER FEES) ──────────────
  consultations: [
    {
      id: 'discovery',
      name: 'Discovery Call',
      durationMinutes: 15,
      fee: 0,                          // PLACEHOLDER — Free
      feeLabel: 'Complimentary',
      description: 'A short introductory conversation to explore fit, scope and next steps. No obligation.',
      bookable: true,
      paymentLink: '',                 // unused when fee is 0
      colour: 'gold'
    },
    {
      id: 'strategy-60',
      name: 'Strategy Consultation',
      durationMinutes: 60,
      fee: 450,                        // PLACEHOLDER — set real fee
      feeLabel: null,                  // auto: $450
      description: 'Focused 60-minute session on financial strategy, capital decisions or organisational priorities.',
      bookable: true,
      paymentLink: '',                 // PLACEHOLDER Stripe/PayPal link (optional)
      colour: 'navy'
    },
    {
      id: 'ma-review',
      name: 'M&A / Deal Review',
      durationMinutes: 90,
      fee: 750,                        // PLACEHOLDER — set real fee
      feeLabel: null,
      description: 'In-depth review of an acquisition, divestiture, due-diligence findings or integration plan.',
      bookable: true,
      paymentLink: '',
      colour: 'ink'
    },
    {
      id: 'retainer',
      name: 'Monthly Advisory Retainer',
      durationMinutes: 0,
      fee: null,                       // enquiry only
      feeLabel: 'By enquiry',
      description: 'Ongoing strategic advisory for executive leadership. Scoped to your needs — contact to discuss.',
      bookable: false,                 // routes to enquiry form
      paymentLink: '',
      colour: 'accent'
    }
  ],

  // ── Payment ────────────────────────────────────────────
  // When true AND the selected consultation has a paymentLink,
  // the booking flow shows a "Pay now" step before confirmation.
  requirePaymentBeforeConfirm: false, // PLACEHOLDER — enable after setting links

  // ── Analytics (cookie-free placeholder) ────────────────
  analyticsScriptUrl: '', // e.g. Plausible / Fathom script URL

  // ── Mode ───────────────────────────────────────────────
  demoModeNotice: false
};
