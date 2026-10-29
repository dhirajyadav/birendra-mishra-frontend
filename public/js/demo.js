/**
 * Demo API — mock slots & bookings when APPS_SCRIPT_URL is empty.
 */
(function () {
  const cfg = window.SITE_CONFIG || {};
  const STORAGE_KEY = 'bm-demo-bookings';

  function loadBookings() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
  }
  function saveBookings(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function parseHM(hm) {
    const [h, m] = hm.split(':').map(Number);
    return h * 60 + m;
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function formatYMD(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  /** Build demo slots for a date (YYYY-MM-DD) in owner TZ conceptually, returned as ISO UTC. */
  function slotsForDate(ymd, durationMinutes) {
    const [y, mo, da] = ymd.split('-').map(Number);
    // Interpret working hours as Asia/Dubai (UTC+4 standard; ignore DST for demo)
    const offsetHours = 4;
    const dateObj = new Date(Date.UTC(y, mo - 1, da));
    const dow = dateObj.getUTCDay();
    const hours = cfg.workingHours && cfg.workingHours[dow];
    if (!hours) return [];
    if ((cfg.blockedDates || []).includes(ymd)) return [];

    const startM = parseHM(hours.start);
    const endM = parseHM(hours.end);
    const buffer = cfg.bufferMinutes || 15;
    const bookings = loadBookings().filter(b => b.status === 'confirmed');
    const slots = [];

    for (let m = startM; m + durationMinutes <= endM; m += durationMinutes + buffer) {
      const hh = Math.floor(m / 60);
      const mm = m % 60;
      // Dubai local -> UTC
      const startUtc = new Date(Date.UTC(y, mo - 1, da, hh - offsetHours, mm, 0));
      const endUtc = new Date(startUtc.getTime() + durationMinutes * 60000);
      const conflict = bookings.some(b => {
        const bs = new Date(b.start).getTime();
        const be = new Date(b.end).getTime();
        return startUtc.getTime() < be && endUtc.getTime() > bs;
      });
      if (!conflict && startUtc.getTime() > Date.now() + (cfg.minLeadHours || 24) * 3600000) {
        slots.push({
          start: startUtc.toISOString(),
          end: endUtc.toISOString(),
          labelDubai: pad(hh) + ':' + pad(mm) + ' Asia/Dubai'
        });
      }
    }
    return slots;
  }

  function token() {
    return 'demo_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  }

  window.DemoAPI = {
    async getSlots({ date, consultationId }) {
      await delay(350);
      const c = (cfg.consultations || []).find(x => x.id === consultationId);
      if (!c || !c.bookable) return { ok: false, error: 'Invalid consultation type' };
      // Validate window
      const today = new Date();
      const min = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      const max = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (cfg.bookingWindowDays || 60));
      const d = new Date(date + 'T00:00:00');
      if (d < new Date(min.toDateString()) || d > max) {
        return { ok: false, error: 'Date outside booking window (tomorrow to 60 days ahead)' };
      }
      return { ok: true, date, slots: slotsForDate(date, c.durationMinutes), timezone: cfg.timezone };
    },

    async getAvailabilityMonth({ year, month, consultationId }) {
      await delay(200);
      const c = (cfg.consultations || []).find(x => x.id === consultationId);
      if (!c || !c.bookable) return { ok: false, error: 'Invalid consultation type' };
      const daysInMonth = new Date(year, month, 0).getDate();
      const availableDates = [];
      for (let day = 1; day <= daysInMonth; day++) {
        const ymd = year + '-' + pad(month) + '-' + pad(day);
        if (slotsForDate(ymd, c.durationMinutes).length) availableDates.push(ymd);
      }
      return { ok: true, availableDates };
    },

    async book(payload) {
      await delay(700);
      const c = (cfg.consultations || []).find(x => x.id === payload.consultationId);
      if (!c || !c.bookable) return { ok: false, error: 'Invalid consultation type' };
      const start = new Date(payload.start);
      const end = new Date(start.getTime() + c.durationMinutes * 60000);
      const max = Date.now() + (cfg.bookingWindowDays || 60) * 86400000;
      if (start.getTime() > max || start.getTime() < Date.now() + (cfg.minLeadHours || 24) * 3600000) {
        return { ok: false, error: 'Selected time is outside the allowed booking window' };
      }
      const ymd = formatYMD(new Date(start.getTime() + 4 * 3600000)); // approx Dubai date
      const open = slotsForDate(ymd, c.durationMinutes).some(s => s.start === start.toISOString());
      // Relaxed check: also accept if ISO matches any open slot
      const open2 = slotsForDate(
        // Derive Dubai YMD properly
        new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dubai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(start),
        c.durationMinutes
      ).some(s => s.start === start.toISOString());
      if (!open && !open2) {
        // Still allow if no conflict — demo can be slightly loose on DST edges
        const bookings = loadBookings().filter(b => b.status === 'confirmed');
        const conflict = bookings.some(b => start < new Date(b.end) && end > new Date(b.start));
        if (conflict) return { ok: false, error: 'That slot was just taken. Please choose another.' };
      }
      const t = token();
      const booking = {
        token: t,
        status: 'confirmed',
        consultationId: c.id,
        consultationName: c.name,
        fee: c.fee,
        feeLabel: c.feeLabel || (c.fee === 0 ? 'Complimentary' : cfg.currencySymbol + c.fee),
        currency: cfg.currency,
        durationMinutes: c.durationMinutes,
        start: start.toISOString(),
        end: end.toISOString(),
        meetLink: 'https://meet.google.com/demo-meet-link',
        name: payload.name,
        email: payload.email,
        company: payload.company || '',
        phone: payload.phone || '',
        topic: payload.topic,
        notes: payload.notes || '',
        createdAt: new Date().toISOString()
      };
      const list = loadBookings();
      list.push(booking);
      saveBookings(list);
      return {
        ok: true,
        message: 'Booking confirmed (demo mode). No real email or calendar event was created.',
        booking,
        manageUrl: 'manage.html?token=' + encodeURIComponent(t)
      };
    },

    async manage({ token, action, note }) {
      await delay(400);
      const list = loadBookings();
      const idx = list.findIndex(b => b.token === token);
      if (idx < 0) return { ok: false, error: 'Booking not found' };
      const b = list[idx];
      if (action === 'lookup') {
        return { ok: true, message: 'Booking found.', booking: b };
      }
      if (action === 'cancel') {
        b.status = 'cancelled';
        saveBookings(list);
        return { ok: true, message: 'Booking cancelled (demo).', booking: b };
      }
      if (action === 'reschedule') {
        b.rescheduleRequest = note || '(no preference provided)';
        b.status = 'reschedule_requested';
        saveBookings(list);
        return { ok: true, message: 'Reschedule request recorded (demo). Please book a new slot or wait for a reply.', booking: b };
      }
      return { ok: false, error: 'Unknown action' };
    }
  };

  function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
})();
