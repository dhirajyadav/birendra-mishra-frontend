(function () {
  const cfg = window.SITE_CONFIG || {};

  // Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());



  // Theme
  const root = document.documentElement;
  const saved = localStorage.getItem('bm-theme');
  if (saved) root.setAttribute('data-theme', saved);
  else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    root.setAttribute('data-theme', 'dark');
  }
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      if (next === 'light') root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', 'dark');
      localStorage.setItem('bm-theme', next === 'light' ? 'light' : 'dark');
    });
  }

  // Mobile nav
  const menuBtn = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // LinkedIn / WhatsApp
  const li = document.getElementById('linkedin-btn');
  if (li && cfg.linkedInUrl && !cfg.linkedInUrl.endsWith('/in/')) {
    li.href = cfg.linkedInUrl;
  } else if (li) {
    li.href = 'https://www.linkedin.com/';
    li.title = 'Set linkedInUrl in config.js';
  }

  const socials = document.getElementById('contact-socials');
  if (socials) {
    const bits = [];
    bits.push('<a class="btn btn-outline btn-sm" href="mailto:' + cfg.contactEmail + '">Email</a>');
    if (cfg.linkedInUrl && !cfg.linkedInUrl.endsWith('/in/')) {
      bits.push('<a class="btn btn-outline btn-sm" href="' + cfg.linkedInUrl + '" target="_blank" rel="noopener">LinkedIn</a>');
    }
    if (cfg.whatsAppNumber) {
      bits.push('<a class="btn btn-gold btn-sm" href="https://wa.me/' + cfg.whatsAppNumber + '" target="_blank" rel="noopener">WhatsApp</a>');
    }
    socials.innerHTML = bits.join('');
  }

  // Pricing cards on home
  const grid = document.getElementById('pricing-grid');
  if (grid && Array.isArray(cfg.consultations)) {
    const icons = {
      'discovery': '<svg class="pricing-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/></svg>',
      'strategy-60': '<svg class="pricing-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
      'ma-review': '<svg class="pricing-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><circle cx="11.5" cy="14.5" r="2.5"/><path d="m13.3 16.3 2.2 2.2"/></svg>',
      'retainer': '<svg class="pricing-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-1"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/></svg>'
    };

    grid.innerHTML = cfg.consultations.map((c, i) => {
      const isFeatured = i === 1;
      const cardClass = 'price-card pricing-card' + (isFeatured ? ' featured pricing-card--featured' : '');
      const badgeText = isFeatured ? 'Popular' : (i === 3 ? 'Advisory' : 'Consultation');
      const badgeClass = 'badge pricing-badge' + (isFeatured ? ' pricing-badge--popular' : '');
      const iconSvg = icons[c.id] || icons['discovery'];
      const dur = c.durationMinutes ? c.durationMinutes + ' minutes' : 'Scoped engagement';

      let priceHtml = '';
      if (c.feeLabel) {
        priceHtml = '<div class="pricing-price pricing-price--text">' + escapeHtml(c.feeLabel) + '</div>';
      } else if (c.fee === 0) {
        priceHtml = '<div class="pricing-price pricing-price--text">Complimentary</div>';
      } else if (c.fee == null) {
        priceHtml = '<div class="pricing-price pricing-price--text">By enquiry</div>';
      } else {
        priceHtml = '<span class="pricing-currency-sym">' + escapeHtml(cfg.currencySymbol || '$') + '</span>' +
                    '<span class="pricing-price">' + escapeHtml(String(c.fee)) + '</span>' +
                    '<span class="pricing-currency">' + escapeHtml(cfg.currency || 'USD') + '</span>';
      }

      const cta = c.bookable
        ? '<a class="btn pricing-btn pricing-btn-primary' + (isFeatured ? ' pricing-btn-featured' : '') + '" href="book.html?type=' + encodeURIComponent(c.id) + '">' +
            '<span>Book</span>' +
            '<svg class="pricing-btn-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>' +
          '</a>'
        : '<a class="btn pricing-btn pricing-btn-outline" href="index.html#contact">' +
            '<span>Enquire</span>' +
            '<svg class="pricing-btn-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>' +
          '</a>';

      return (
        '<article class="' + cardClass + '" data-package="' + escapeHtml(c.id) + '">' +
          '<div class="pricing-card-top">' +
            '<div class="pricing-badge-wrap">' +
              '<span class="' + badgeClass + '">' + escapeHtml(badgeText) + '</span>' +
            '</div>' +
            '<div class="pricing-icon-wrap" aria-hidden="true">' +
              iconSvg +
            '</div>' +
          '</div>' +
          '<h3 class="pricing-title">' + escapeHtml(c.name) + '</h3>' +
          '<div class="pricing-price-wrap">' + priceHtml + '</div>' +
          '<div class="pricing-duration">' + escapeHtml(dur) + '</div>' +
          '<p class="pricing-desc">' + escapeHtml(c.description) + '</p>' +
          '<div class="pricing-action">' + cta + '</div>' +
        '</article>'
      );
    }).join('');
  }

  // Enquiry form
  const enquiry = document.getElementById('enquiry-form');
  if (enquiry) {
    enquiry.addEventListener('submit', async (e) => {
      e.preventDefault();
      const alertEl = document.getElementById('enquiry-alert');
      const btn = document.getElementById('enquiry-submit');

      const nameEl = document.getElementById('eq-name');
      const emailEl = document.getElementById('eq-email');
      const companyEl = document.getElementById('eq-company');
      const phoneEl = document.getElementById('eq-phone');
      const topicEl = document.getElementById('eq-topic');
      const messageEl = document.getElementById('eq-message');
      const consentEl = document.getElementById('eq-consent');

      const payload = {
        action: 'enquiry',
        name: nameEl ? nameEl.value.trim() : '',
        email: emailEl ? emailEl.value.trim() : '',
        company: companyEl ? companyEl.value.trim() : '',
        phone: phoneEl ? phoneEl.value.trim() : '',
        topic: topicEl ? topicEl.value.trim() : '',
        message: messageEl ? messageEl.value.trim() : '',
        consent: consentEl ? consentEl.checked : false
      };

      // 1. Validation
      if (!payload.name) {
        showAlert(alertEl, 'Please enter your full name.', 'error');
        if (nameEl) nameEl.focus();
        return;
      }
      if (!payload.email) {
        showAlert(alertEl, 'Please enter your email address.', 'error');
        if (emailEl) emailEl.focus();
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
        showAlert(alertEl, 'Please enter a valid email address (e.g. name@company.com).', 'error');
        if (emailEl) emailEl.focus();
        return;
      }
      if (!payload.topic) {
        showAlert(alertEl, 'Please specify an enquiry topic.', 'error');
        if (topicEl) topicEl.focus();
        return;
      }
      if (!payload.message) {
        showAlert(alertEl, 'Please enter your message.', 'error');
        if (messageEl) messageEl.focus();
        return;
      }
      if (!payload.consent) {
        showAlert(alertEl, 'Please agree to be contacted to submit your enquiry.', 'error');
        if (consentEl) consentEl.focus();
        return;
      }

      // Check backend endpoint configuration
      if (!cfg.APPS_SCRIPT_URL) {
        showAlert(
          alertEl,
          'Backend endpoint not configured: Please deploy apps-script/Code.gs and set APPS_SCRIPT_URL in js/config.js to enable live email delivery to ' + (cfg.ownerEmail || 'aidhiraj3@gmail.com') + '.',
          'error'
        );
        return;
      }

      // 2. Prevent duplicate submissions while request is in-flight
      btn.disabled = true;
      const originalHtml = btn.innerHTML;
      btn.innerHTML = '<span>Sending enquiry…</span>';

      try {
        const res = await fetch(cfg.APPS_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          throw new Error('Server returned HTTP status ' + res.status);
        }
        const data = await res.json();
        if (!data.ok) {
          throw new Error(data.error || 'Enquiry submission failed');
        }
        showAlert(alertEl, data.message || 'Thank you. Your enquiry has been received and will be answered shortly.', 'success');
        enquiry.reset();
      } catch (err) {
        showAlert(alertEl, 'Unable to send enquiry: ' + (err.message || 'Network error') + '. Please try again or email directly.', 'error');
      } finally {
        btn.disabled = false;
        btn.innerHTML = originalHtml;
      }
    });
  }

  // About section scroll reveal
  const aboutSec = document.getElementById('about');
  if (aboutSec && 'IntersectionObserver' in window) {
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      aboutSec.classList.add('has-reveal');
      if (window.location.hash === '#about') {
        aboutSec.classList.add('is-revealed');
      } else {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              aboutSec.classList.add('is-revealed');
              observer.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.15,
          rootMargin: '0px 0px -30px 0px'
        });
        observer.observe(aboutSec);
      }
    }
  }

  // ── Expertise section: scroll reveal + pointer interactions ──────────────
  (function () {
    var expSec = document.getElementById('expertise');
    if (!expSec) return;

    var prefersReduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var hasFinePointer = window.matchMedia &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    // ---- 1. Scroll-triggered reveal (runs once) ----
    if ('IntersectionObserver' in window) {
      if (!prefersReduced) {
        expSec.classList.add('exp-has-reveal');
        if (window.location.hash === '#expertise') {
          expSec.classList.add('exp-revealed');
        } else {
          var expObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                expSec.classList.add('exp-revealed');
                expObserver.unobserve(entry.target);
              }
            });
          }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
          expObserver.observe(expSec);
        }
      }
    }

    // ---- 2. Mouse-follow spotlight + micro-tilt (fine pointer only) ----
    if (!hasFinePointer || prefersReduced) return;

    // Maximum tilt in degrees — keep extremely subtle
    var MAX_TILT = 0.9;

    var cards = expSec.querySelectorAll('.exp-card');
    cards.forEach(function (card) {
      var rafId = null;
      var currentX = 0;
      var currentY = 0;
      var targetX = 0;
      var targetY = 0;
      var active = false;

      function lerp(a, b, t) { return a + (b - a) * t; }

      function onFrame() {
        if (!active) { rafId = null; return; }

        // Smooth the tilt coordinates
        currentX = lerp(currentX, targetX, 0.12);
        currentY = lerp(currentY, targetY, 0.12);

        var rotX = -currentY * MAX_TILT;
        var rotY =  currentX * MAX_TILT;

        card.style.transform =
          'translateY(-5px) perspective(800px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';

        rafId = requestAnimationFrame(onFrame);
      }

      function onPointerMove(e) {
        var rect = card.getBoundingClientRect();
        // Normalised position: -1 … +1
        var nx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
        var ny = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;

        targetX = nx;
        targetY = ny;

        // Spotlight position as percentage
        var px = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%';
        var py = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%';
        card.style.setProperty('--exp-mx', px);
        card.style.setProperty('--exp-my', py);
        card.style.setProperty('--exp-spotlight', '1');

        if (!rafId) {
          active = true;
          rafId = requestAnimationFrame(onFrame);
        }
      }

      function onPointerEnter() {
        active = true;
      }

      function onPointerLeave() {
        active = false;
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }

        // Smoothly return to resting state via CSS transition
        card.style.transform = '';
        card.style.setProperty('--exp-spotlight', '0');

        // Reset tilt tracking
        currentX = 0; currentY = 0;
        targetX  = 0; targetY  = 0;
      }

      card.addEventListener('pointerenter', onPointerEnter);
      card.addEventListener('pointermove',  onPointerMove);
      card.addEventListener('pointerleave', onPointerLeave);
    });
  }());


  // ── Services section: scroll reveal + pointer spotlight ─────────────────
  (function () {
    var svcSec = document.getElementById('services');
    if (!svcSec) return;

    var prefersReduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var hasFinePointer = window.matchMedia &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    // ---- 1. Scroll-triggered reveal (once) ----
    if ('IntersectionObserver' in window && !prefersReduced) {
      svcSec.classList.add('svc-has-reveal');
      if (window.location.hash === '#services') {
        svcSec.classList.add('svc-revealed');
      } else {
        var svcObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              svcSec.classList.add('svc-revealed');
              svcObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        svcObserver.observe(svcSec);
      }
    }

    // ---- 2. Mouse spotlight on white cards (fine pointer only) ----
    if (!hasFinePointer || prefersReduced) return;

    var cards = svcSec.querySelectorAll('.svc-card:not(.svc-card--dark)');
    cards.forEach(function (card) {
      function onPointerMove(e) {
        var rect = card.getBoundingClientRect();
        var px = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%';
        var py = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%';
        card.style.setProperty('--svc-mx', px);
        card.style.setProperty('--svc-my', py);
        card.style.setProperty('--svc-spot', '1');
      }

      function onPointerLeave() {
        card.style.setProperty('--svc-spot', '0');
      }

      card.addEventListener('pointermove',  onPointerMove);
      card.addEventListener('pointerleave', onPointerLeave);
    });
  }());

  // ── Pricing section: scroll reveal ──────────────────────────────────────

  (function () {
    var prSec = document.getElementById('pricing');
    if (!prSec) return;

    var prefersReduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if ('IntersectionObserver' in window && !prefersReduced) {
      prSec.classList.add('pricing-has-reveal');
      if (window.location.hash === '#pricing') {
        prSec.classList.add('pricing-revealed');
      } else {
        var prObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              prSec.classList.add('pricing-revealed');
              prObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        prObserver.observe(prSec);
      }
    }
  }());

  // ── Unified scroll reveals for Approach, Insights, FAQ, Contact, Footer ───
  (function () {
    var prefersReduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!('IntersectionObserver' in window) || prefersReduced) return;

    var sections = [
      { id: 'approach', hasClass: 'approach-has-reveal', revClass: 'approach-revealed' },
      { id: 'insights', hasClass: 'insights-has-reveal', revClass: 'insights-revealed' },
      { id: 'faq', hasClass: 'faq-has-reveal', revClass: 'faq-revealed' },
      { id: 'contact', hasClass: 'contact-has-reveal', revClass: 'contact-revealed' }
    ];

    sections.forEach(function (secCfg) {
      var el = document.getElementById(secCfg.id);
      if (!el) return;

      el.classList.add(secCfg.hasClass);
      if (window.location.hash === '#' + secCfg.id) {
        el.classList.add(secCfg.revClass);
      } else {
        var obs = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              el.classList.add(secCfg.revClass);
              obs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        obs.observe(el);
      }
    });

    var footer = document.querySelector('.site-footer');
    if (footer) {
      footer.classList.add('footer-has-reveal');
      var footObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            footer.classList.add('footer-revealed');
            footObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 });
      footObs.observe(footer);
    }
  }());

  // Analytics placeholder



  if (cfg.analyticsScriptUrl) {
    const s = document.createElement('script');
    s.defer = true;
    s.src = cfg.analyticsScriptUrl;
    document.head.appendChild(s);
  }


  function showAlert(el, msg, type) {
    if (!el) return;
    el.hidden = false;
    el.className = 'alert alert-' + (type === 'success' ? 'success' : type === 'info' ? 'info' : 'error');
    el.textContent = msg;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

  window.BMUtils = { showAlert, escapeHtml, delay };
})();
