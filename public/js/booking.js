(function () {
  const cfg = window.SITE_CONFIG || {};
  const state = {
    step: 1,
    consultation: null,
    date: null,       // YYYY-MM-DD
    slot: null,       // { start, end }
    details: null,
    calMonth: null,   // Date at first of month
    availableDates: new Set(),
    bookingResult: null
  };

  const alertEl = document.getElementById('booking-alert');
  const $ = (id) => document.getElementById(id);

  function isConfigured() { return Boolean(cfg.APPS_SCRIPT_URL); }

  async function api(body) {
    if (!isConfigured()) {
      if (body.action === 'slots') return DemoAPI.getSlots(body);
      if (body.action === 'availability') return DemoAPI.getAvailabilityMonth(body);
      throw new Error('Backend service not configured. Please set APPS_SCRIPT_URL in js/config.js to process real bookings and email notifications.');
    }
    const res = await fetch(cfg.APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      throw new Error('Server returned HTTP ' + res.status);
    }
    return res.json();
  }

  function showAlert(msg, type) {
    if (!alertEl) return;
    alertEl.hidden = false;
    alertEl.className = 'alert alert-' + (type || 'error');
    alertEl.textContent = msg;
  }
  function clearAlert() { if (alertEl) alertEl.hidden = true; }

  function formatFee(c) {
    if (c.feeLabel) return c.feeLabel;
    if (c.fee === 0) return 'Complimentary';
    if (c.fee == null) return 'By enquiry';
    return cfg.currencySymbol + c.fee + ' ' + cfg.currency;
  }

  function visitorTZ() {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'local'; }
    catch { return 'local'; }
  }

  function formatInTZ(iso, timeZone, opts) {
    return new Intl.DateTimeFormat('en-GB', Object.assign({ timeZone }, opts || {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })).format(new Date(iso));
  }

  function timeOnly(iso, timeZone) {
    return new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
  }

  function goStep(n) {
    state.step = n;
    for (let i = 1; i <= 4; i++) {
      const el = $('step-' + i);
      if (el) el.hidden = i !== n;
    }
    const success = $('step-success');
    if (success) success.hidden = true;
    document.querySelectorAll('[data-step-indicator]').forEach(el => {
      const s = Number(el.getAttribute('data-step-indicator'));
      el.classList.toggle('active', s === n);
      el.classList.toggle('done', s < n);
    });
    clearAlert();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Step 1: consultation types ─────────────────────────
  function renderConsultations() {
    const box = $('consult-options');
    if (!box) return;
    const params = new URLSearchParams(location.search);
    const pre = params.get('type');
    box.innerHTML = (cfg.consultations || []).map(c => {
      if (!c.bookable) {
        return (
          '<a class="consult-option" href="index.html#contact" style="text-decoration:none;">' +
            '<span class="radio" aria-hidden="true"></span>' +
            '<span><strong>' + esc(c.name) + '</strong><br><span class="muted">' + esc(c.description) + '</span></span>' +
            '<span class="fee-col"><strong>' + esc(formatFee(c)) + '</strong><br><span class="muted">Enquire</span></span>' +
          '</a>'
        );
      }
      return (
        '<button type="button" class="consult-option" data-id="' + esc(c.id) + '" aria-pressed="false">' +
          '<span class="radio" aria-hidden="true"></span>' +
          '<span><strong>' + esc(c.name) + '</strong><br><span class="muted">' + esc(c.description) + '</span></span>' +
          '<span class="fee-col"><strong>' + esc(formatFee(c)) + '</strong><br><span class="muted">' + c.durationMinutes + ' min</span></span>' +
        '</button>'
      );
    }).join('');

    box.querySelectorAll('button.consult-option').forEach(btn => {
      btn.addEventListener('click', () => {
        box.querySelectorAll('button.consult-option').forEach(b => {
          b.classList.remove('selected');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('selected');
        btn.setAttribute('aria-pressed', 'true');
        state.consultation = (cfg.consultations || []).find(x => x.id === btn.dataset.id);
        $('to-step-2').disabled = !state.consultation;
      });
      if (pre && btn.dataset.id === pre) btn.click();
    });
  }

  $('to-step-2')?.addEventListener('click', async () => {
    if (!state.consultation) return;
    state.calMonth = startOfMonth(new Date());
    // Ensure month view starts within window
    const min = addDays(startOfDay(new Date()), 1);
    if (state.calMonth < startOfMonth(min)) state.calMonth = startOfMonth(min);
    goStep(2);
    updateTzNote();
    await refreshCalendar();
  });

  // ── Step 2: calendar ───────────────────────────────────
  function updateTzNote() {
    const el = $('tz-note');
    if (!el) return;
    el.textContent = 'Times shown in your local zone (' + visitorTZ() + ') and in ' + (cfg.timezone || 'Asia/Dubai') + '. Booking window: tomorrow through ' + (cfg.bookingWindowDays || 60) + ' days ahead.';
  }

  function startOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  function startOfMonth(d) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }
  function addDays(d, n) {
    const x = new Date(d); x.setDate(x.getDate() + n); return x;
  }
  function ymdLocal(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function pad(n) { return String(n).padStart(2, '0'); }

  function windowBounds() {
    const tomorrow = addDays(startOfDay(new Date()), 1);
    const last = addDays(startOfDay(new Date()), cfg.bookingWindowDays || 60);
    return { tomorrow, last };
  }

  async function refreshCalendar() {
    const { tomorrow, last } = windowBounds();
    const y = state.calMonth.getFullYear();
    const m = state.calMonth.getMonth() + 1;
    $('cal-month-label').textContent = state.calMonth.toLocaleString('en-GB', { month: 'long', year: 'numeric' });

    // Disable prev/next outside window
    $('cal-prev').disabled = startOfMonth(state.calMonth) <= startOfMonth(tomorrow);
    $('cal-next').disabled = startOfMonth(state.calMonth) >= startOfMonth(last);

    try {
      const data = await api({
        action: 'availability',
        year: y,
        month: m,
        consultationId: state.consultation.id
      });
      state.availableDates = new Set(data.availableDates || []);
    } catch (e) {
      state.availableDates = new Set();
      showAlert('Could not load availability. ' + (e.message || ''), 'error');
    }

    renderCalGrid();
    $('slots-empty').hidden = false;
    $('slots-empty').textContent = 'Select a date to see open slots.';
    $('slots-grid').hidden = true;
    $('to-step-3').disabled = true;
    state.date = null;
    state.slot = null;
  }

  function renderCalGrid() {
    const grid = $('cal-grid');
    const { tomorrow, last } = windowBounds();
    const y = state.calMonth.getFullYear();
    const m = state.calMonth.getMonth();
    const firstDow = new Date(y, m, 1).getDay(); // 0 Sun
    const days = new Date(y, m + 1, 0).getDate();
    const dows = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let html = dows.map(d => '<div class="cal-dow">' + d + '</div>').join('');
    for (let i = 0; i < firstDow; i++) {
      html += '<button type="button" class="cal-day muted" disabled aria-hidden="true"></button>';
    }
    for (let day = 1; day <= days; day++) {
      const d = new Date(y, m, day);
      const ymd = ymdLocal(d);
      const inWindow = d >= tomorrow && d <= last;
      const has = state.availableDates.has(ymd);
      const disabled = !inWindow || !has;
      const selected = state.date === ymd;
      html += '<button type="button" class="cal-day' +
        (disabled ? ' muted' : '') +
        (has && inWindow ? ' has-slots' : '') +
        (selected ? ' selected' : '') +
        '" data-ymd="' + ymd + '"' +
        (disabled ? ' disabled' : '') +
        ' aria-label="' + ymd + '"' +
        '>' + day + '</button>';
    }
    grid.innerHTML = html;
    grid.querySelectorAll('.cal-day:not(:disabled)').forEach(btn => {
      btn.addEventListener('click', () => selectDate(btn.dataset.ymd));
    });
  }

  async function selectDate(ymd) {
    state.date = ymd;
    state.slot = null;
    renderCalGrid();
    $('to-step-3').disabled = true;
    $('slots-empty').hidden = false;
    $('slots-empty').textContent = 'Loading slots…';
    $('slots-grid').hidden = true;
    try {
      const data = await api({
        action: 'slots',
        date: ymd,
        consultationId: state.consultation.id
      });
      if (!data.ok) throw new Error(data.error || 'Failed');
      const slots = data.slots || [];
      if (!slots.length) {
        $('slots-empty').textContent = 'No open slots on this date.';
        return;
      }
      $('slots-empty').hidden = true;
      const grid = $('slots-grid');
      grid.hidden = false;
      grid.innerHTML = slots.map(s => {
        const local = timeOnly(s.start, visitorTZ());
        const dubai = timeOnly(s.start, cfg.timezone || 'Asia/Dubai');
        return '<button type="button" class="slot-btn" data-start="' + esc(s.start) + '" data-end="' + esc(s.end) + '">' +
          esc(local) + ' <span class="muted">(' + esc(dubai) + ' Dubai)</span></button>';
      }).join('');
      grid.querySelectorAll('.slot-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          grid.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          state.slot = { start: btn.dataset.start, end: btn.dataset.end };
          $('to-step-3').disabled = false;
        });
      });
    } catch (e) {
      $('slots-empty').textContent = e.message || 'Unable to load slots.';
    }
  }

  $('cal-prev')?.addEventListener('click', async () => {
    state.calMonth = new Date(state.calMonth.getFullYear(), state.calMonth.getMonth() - 1, 1);
    await refreshCalendar();
  });
  $('cal-next')?.addEventListener('click', async () => {
    state.calMonth = new Date(state.calMonth.getFullYear(), state.calMonth.getMonth() + 1, 1);
    await refreshCalendar();
  });

  $('to-step-3')?.addEventListener('click', () => {
    if (!state.slot) return;
    renderMiniSummary();
    goStep(3);
  });

  document.querySelectorAll('[data-back]').forEach(btn => {
    btn.addEventListener('click', () => goStep(Number(btn.getAttribute('data-back'))));
  });

  function renderMiniSummary() {
    const el = $('booking-summary-mini');
    if (!el || !state.consultation || !state.slot) return;
    el.innerHTML = summaryHtml();
  }

  function summaryHtml() {
    const c = state.consultation;
    return '<dl>' +
      '<div><dt>Consultation</dt><dd>' + esc(c.name) + ' · ' + esc(formatFee(c)) + '</dd></div>' +
      '<div><dt>Duration</dt><dd>' + c.durationMinutes + ' minutes</dd></div>' +
      '<div><dt>Your local time</dt><dd>' + esc(formatInTZ(state.slot.start, visitorTZ())) + '</dd></div>' +
      '<div><dt>Asia/Dubai</dt><dd>' + esc(formatInTZ(state.slot.start, cfg.timezone || 'Asia/Dubai')) + '</dd></div>' +
      '</dl>';
  }

  // ── Step 3 details ─────────────────────────────────────
  $('details-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = $('bk-name');
    const emailInput = $('bk-email');
    const topicInput = $('bk-topic');
    const consentInput = $('bk-consent');

    const details = {
      name: nameInput ? nameInput.value.trim() : '',
      email: emailInput ? emailInput.value.trim() : '',
      company: $('bk-company') ? $('bk-company').value.trim() : '',
      phone: $('bk-phone') ? $('bk-phone').value.trim() : '',
      topic: topicInput ? topicInput.value.trim() : '',
      notes: $('bk-notes') ? $('bk-notes').value.trim() : '',
      consent: consentInput ? consentInput.checked : false
    };

    if (!details.name) {
      showAlert('Please enter your full name.', 'error');
      if (nameInput) nameInput.focus();
      return;
    }
    if (!details.email) {
      showAlert('Please enter your email address.', 'error');
      if (emailInput) emailInput.focus();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) {
      showAlert('Please enter a valid email address (e.g. name@company.com).', 'error');
      if (emailInput) emailInput.focus();
      return;
    }
    if (!details.topic) {
      showAlert('Please describe your topic or focus area.', 'error');
      if (topicInput) topicInput.focus();
      return;
    }
    if (!details.consent) {
      showAlert('Please agree to the terms and privacy policy to continue.', 'error');
      if (consentInput) consentInput.focus();
      return;
    }

    state.details = details;
    renderFullSummary();
    setupPayment();
    goStep(4);
  });

  function renderFullSummary() {
    const el = $('booking-summary-full');
    if (!el) return;
    el.innerHTML = summaryHtml() +
      '<dl style="margin-top:0.75rem;">' +
      '<div><dt>Name</dt><dd>' + esc(state.details.name) + '</dd></div>' +
      '<div><dt>Email</dt><dd>' + esc(state.details.email) + '</dd></div>' +
      (state.details.company ? '<div><dt>Company</dt><dd>' + esc(state.details.company) + '</dd></div>' : '') +
      (state.details.phone ? '<div><dt>Phone</dt><dd>' + esc(state.details.phone) + '</dd></div>' : '') +
      '<div><dt>Topic</dt><dd>' + esc(state.details.topic) + '</dd></div>' +
      (state.details.notes ? '<div><dt>Notes</dt><dd>' + esc(state.details.notes) + '</dd></div>' : '') +
      '</dl>';
  }

  function setupPayment() {
    const box = $('payment-step');
    const link = $('payment-link');
    const c = state.consultation;
    const show = cfg.requirePaymentBeforeConfirm && c.paymentLink && c.fee > 0;
    box.hidden = !show;
    if (show) {
      link.href = c.paymentLink;
    }
  }

  // ── Confirm ────────────────────────────────────────────
  $('confirm-booking')?.addEventListener('click', async () => {
    clearAlert();
    const btn = $('confirm-booking');

    // Prevent fake confirmation if backend is not configured
    if (!cfg.APPS_SCRIPT_URL) {
      showAlert(
        'Backend service not configured: Please deploy apps-script/Code.gs and set APPS_SCRIPT_URL in js/config.js to process real bookings and email notifications to ' + (cfg.ownerEmail || 'aidhiraj3@gmail.com') + '.',
        'error'
      );
      return;
    }

    // Prevent duplicate submissions
    btn.disabled = true;
    btn.textContent = 'Processing booking…';
    try {
      const data = await api({
        action: 'book',
        consultationId: state.consultation.id,
        start: state.slot.start,
        name: state.details.name,
        email: state.details.email,
        company: state.details.company,
        phone: state.details.phone,
        topic: state.details.topic,
        notes: state.details.notes,
        consent: true,
        visitorTimeZone: visitorTZ()
      });
      if (!data.ok) throw new Error(data.error || 'Booking failed');
      state.bookingResult = data;
      showSuccess(data);
    } catch (e) {
      showAlert(e.message || 'Booking failed. Please try another slot or contact directly.', 'error');
      btn.disabled = false;
      btn.textContent = 'Confirm booking';
    }
  });

  function showSuccess(data) {
    for (let i = 1; i <= 4; i++) {
      const el = $('step-' + i);
      if (el) el.hidden = true;
    }
    document.querySelectorAll('[data-step-indicator]').forEach(el => {
      el.classList.add('done');
      el.classList.remove('active');
    });
    const panel = $('step-success');
    panel.hidden = false;
    const b = data.booking;
    $('success-summary').innerHTML =
      '<dl>' +
      '<div><dt>Consultation</dt><dd>' + esc(b.consultationName) + '</dd></div>' +
      '<div><dt>When (local)</dt><dd>' + esc(formatInTZ(b.start, visitorTZ())) + '</dd></div>' +
      '<div><dt>When (Dubai)</dt><dd>' + esc(formatInTZ(b.start, cfg.timezone || 'Asia/Dubai')) + '</dd></div>' +
      '<div><dt>Fee</dt><dd>' + esc(b.feeLabel || formatFee(state.consultation)) + '</dd></div>' +
      '<div><dt>Google Meet</dt><dd><a href="' + esc(b.meetLink) + '" target="_blank" rel="noopener">' + esc(b.meetLink) + '</a></dd></div>' +
      '<div><dt>Token</dt><dd><code>' + esc(b.token) + '</code></dd></div>' +
      '</dl>';

    // ICS
    const ics = buildICS(b);
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    $('add-to-calendar').href = URL.createObjectURL(blob);
    $('manage-link').href = data.manageUrl || ('manage.html?token=' + encodeURIComponent(b.token));
  }

  function buildICS(b) {
    const dt = (iso) => iso.replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Birendra Mishra//Consultation//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:' + b.token + '@birendramishra.com',
      'DTSTAMP:' + dt(new Date().toISOString()),
      'DTSTART:' + dt(b.start),
      'DTEND:' + dt(b.end),
      'SUMMARY:' + escapeIcs(b.consultationName + ' — Birendra Mishra'),
      'DESCRIPTION:' + escapeIcs('Topic: ' + (b.topic || '') + '\\nMeet: ' + (b.meetLink || '')),
      'LOCATION:' + escapeIcs(b.meetLink || 'Google Meet'),
      'URL:' + (b.meetLink || ''),
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
  }

  function escapeIcs(s) {
    return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Expose for tests
  window.BookingApp = { state, windowBounds, goStep };

  // Init
  renderConsultations();
})();
