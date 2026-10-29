import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { load, type CheerioAPI } from 'cheerio';
import type { CmsItem, CmsPage, CmsSection } from './cms';
import { sectionByName } from './cms';

type Consultation = {
  id: string;
  name: string;
  durationMinutes: number;
  fee: number | null;
  feeLabel?: string | null;
  description: string;
  bookable: boolean;
  featured?: boolean;
  buttonText?: string;
  buttonUrl?: string;
};

const templatePath = (name: string) => path.join(process.cwd(), 'templates', name);

async function parseTemplate(name: string) {
  const source = await readFile(templatePath(name), 'utf8');
  const $ = load(source);
  $('script').remove();
  $('style, link[rel="stylesheet"], link[rel="canonical"], meta[property^="og:"], meta[name^="twitter:"]').remove();
  $('a[href="index.html"]').attr('href', '/');
  $('a[href^="index.html#"]').each((_, link) => {
    const href = $(link).attr('href') || '';
    $(link).attr('href', href.replace(/^index\.html/, ''));
  });
  $('a[href^="assets/"]').each((_, link) => { $(link).attr('href', `/${$(link).attr('href')}`); });
  $('[src^="assets/"]').each((_, node) => { $(node).attr('src', `/${$(node).attr('src')}`); });
  return $;
}

function section(page: CmsPage | null, name: string): CmsSection | null {
  return sectionByName(page, name);
}

function setText($: CheerioAPI, selector: string, value?: string | null) {
  if (value) $(selector).first().text(value);
}

function sorted(items?: CmsItem[]) {
  return [...(items || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function safeHref(item: CmsItem) {
  const value = item.url || item.description || '#';
  return /^(https?:\/\/|\/|#|mailto:|tel:)/i.test(value) || /^[\w.-]+(?:\/[\w.-]+)*(?:[?#].*)?$/.test(value) ? value : '#';
}

function updateButton($: CheerioAPI, selector: string, text?: string | null, url?: string | null) {
  if (!text && !url) return;
  const button = $(selector).first();
  if (!button.length) return;
  if (text) {
    const label = button.find('span').first();
    if (label.length) label.text(text);
  }
  if (url) button.attr('href', safeHref({ url }));
}

function updateLinkList($: CheerioAPI, selector: string, items?: CmsItem[]) {
  if (!items?.length) return;
  const nav = $(selector).first();
  const prototype = nav.find('a').first();
  if (!nav.length || !prototype.length) return;
  nav.empty();
  sorted(items).forEach((item) => {
    nav.append(prototype.clone().attr('href', safeHref(item)).text(item.title || ''));
  });
}

function updateCards(
  $: CheerioAPI,
  containerSelector: string,
  cardSelector: string,
  items: CmsItem[] | undefined,
  titleSelector: string,
  descriptionSelector: string,
  urlSelector?: string,
  numberSelector?: string,
) {
  if (!items?.length) return;
  const container = $(containerSelector).first();
  const originals = container.find(cardSelector);
  if (!container.length || !originals.length) return;
  const prototypes = originals.toArray().map((original) => $(original).clone());
  originals.remove();
  for (const [index, item] of sorted(items).entries()) {
    const prototype = prototypes[Math.min(container.children(cardSelector).length, prototypes.length - 1)];
    const card = prototype.clone();
    if (item.title) card.find(titleSelector).first().text(item.title);
    if (numberSelector) card.find(numberSelector).first().text(item.number || String(index + 1).padStart(2, '0'));
    const copy = item.description || item.body;
    if (copy) card.find(descriptionSelector).first().text(copy);
    if (urlSelector && item.url) {
      const safeUrl = safeHref(item);
      card.find(urlSelector).first().attr('href', safeUrl);
    }
    container.append(card);
  }
}

function updateAbout($: CheerioAPI, data: CmsSection | null) {
  if (!data) return;
  updateButton($, '#about .btn-panel-primary', data.primaryButtonText, data.primaryButtonUrl);
  updateButton($, '#about .btn-panel-secondary', data.secondaryButtonText, data.secondaryButtonUrl);
  const heading = $('#about .about-title').first();
  if (data.heading && heading.length) {
    const words = data.heading.trim().split(/\s+/);
    heading.empty().append(words.slice(0, -1).join(' '), $('<br>'))
      .append($('<em class="about-highlight"></em>').text(words.at(-1) || ''));
  }
  setText($, '#about .about-subtitle', data.description);
  setText($, '#about .about-eyebrow-text', data.eyebrow);
  if (data.body) {
    const paragraphs = data.body.split(/\n\s*\n/).filter(Boolean);
    const root = $('#about .about-paragraphs');
    const prototype = root.find('p').first().clone();
    root.empty();
    paragraphs.forEach((paragraph) => {
      root.append(prototype.clone().text(paragraph));
    });
  }
  const items = sorted(data.items);
  const highlights = items.slice(0, 3);
  if (highlights.length) {
    const root = $('#about .about-highlights');
    const cards = root.find('.highlight-item');
    const prototype = cards.first().clone();
    cards.remove();
    highlights.forEach((item) => {
      const card = prototype.clone();
      card.find('.highlight-title').text(item.title || '');
      card.find('.highlight-desc').text(item.description || item.body || '');
      root.append(card);
    });
  }
  const engagement = items[3];
  if (engagement) {
    setText($, '#about .panel-tag', engagement.title);
    setText($, '#about .panel-desc', engagement.description);
  }
  const benefits = items.slice(4);
  const benefitRoot = $('#about .panel-benefits');
  const benefitPrototype = benefitRoot.find('.benefit-row').first().clone();
  if (items.length >= 4 && benefitPrototype.length) {
    benefitRoot.empty();
    benefits.forEach((item) => {
      const benefit = benefitPrototype.clone();
      const labels = benefit.find('.benefit-title');
      const descriptions = benefit.find('.benefit-desc');
      if (labels.length) labels.first().text(item.title || '');
      const description = descriptions.first().length ? descriptions.first() : benefit.find('.benefit-text span').first();
      description.text(item.description || item.body || '');
      benefitRoot.append(benefit);
    });
  }
}

function updateHero($: CheerioAPI, data: CmsSection | null) {
  if (!data) return;
  updateButton($, '.hero-actions .btn-hero-primary', data.primaryButtonText, data.primaryButtonUrl);
  updateButton($, '.hero-actions .btn-hero-secondary', data.secondaryButtonText, data.secondaryButtonUrl);
  setText($, '.hero-eyebrow .eyebrow-text', data.eyebrow);
  const title = data.heading?.trim();
  const heading = $('.hero-title').first();
  if (title && heading.text().replace(/\s+/g, ' ').trim() !== title) {
    const words = title.split(/\s+/);
    heading.empty().append(`${words.slice(0, -1).join(' ')} `).append($('<em class="hero-highlight"></em>').text(words.at(-1) || ''));
  }
  setText($, '.hero-description', data.description || data.body);
  const items = sorted(data.items);
  const glance = items.slice(0, 5);
  const rows = $('.hero-info-card .info-row');
  if (glance.length && rows.length) {
    const parent = $('.hero-info-card .info-card-rows');
    const prototype = rows.first().clone();
    rows.remove();
    glance.forEach((item) => {
      const row = prototype.clone();
      if (item.title) row.attr('aria-label', item.title);
      row.find('.info-label span').text(item.title || '');
      row.find('.info-val').text(item.description || '');
      parent.append(row);
    });
  }
  const trust = items.slice(5);
  const trustItems = $('.hero-trust-row .trust-item');
  if (trust.length && trustItems.length) {
    const parent = $('.hero-trust-row');
    const prototype = trustItems.first().clone();
    parent.find('.trust-item, .trust-sep').remove();
    trust.forEach((item, index) => {
      if (index) parent.append('<span class="trust-sep" aria-hidden="true">/</span>');
      const row = prototype.clone();
      if (item.title) row.attr('aria-label', item.title);
      row.find('span').last().text(item.description || item.title || '');
      parent.append(row);
    });
  }
}

function updatePricing($: CheerioAPI, data: CmsSection | null, consultations: Consultation[]) {
  if (!data) return;
  setText($, '#pricing .pricing-heading', data.heading);
  setText($, '#pricing .pricing-eyebrow', data.eyebrow);
  setText($, '#pricing .pricing-lead', data.description || data.body);
  if (data.disclaimer?.trim()) setText($, '#pricing .pricing-disclaimer-text', data.disclaimer);
  else $('#pricing .pricing-disclaimer').remove();
  if (!consultations.length) return;
  const grid = $('#pricing-grid');
  const originals = grid.find('.price-card');
  if (!grid.length || !originals.length) return;
  const prototype = originals.first().clone();
  grid.empty();
  consultations.forEach((consultation, index) => {
    const card = prototype.clone();
    const featured = consultation.featured ?? index === 1;
    card.attr('data-package', consultation.id);
    card.toggleClass('featured', featured).toggleClass('pricing-card--featured', featured);
    card.find('.pricing-title').text(consultation.name);
    card.find('.pricing-duration').text(consultation.durationMinutes ? `${consultation.durationMinutes} minutes` : 'Scoped engagement');
    card.find('.pricing-desc').text(consultation.description);
    card.find('.pricing-badge').first().text(featured ? 'Popular' : index === 3 ? 'Advisory' : 'Consultation')
      .toggleClass('pricing-badge--popular', featured);
    const price = card.find('.pricing-price-wrap').first().empty();
    if (consultation.feeLabel) {
      price.append($('<div class="pricing-price pricing-price--text"></div>').text(consultation.feeLabel));
    } else if (consultation.fee === null) {
      price.append($('<div class="pricing-price pricing-price--text"></div>').text('By enquiry'));
    } else {
      price.append($('<span class="pricing-currency-sym"></span>').text('$'));
      price.append($('<span class="pricing-price"></span>').text(String(consultation.fee)));
      price.append($('<span class="pricing-currency"></span>').text('USD'));
    }
    const link = card.find('.pricing-action a').first();
    link.attr('href', safeHref({ url: consultation.buttonUrl || (consultation.bookable ? `book.html?type=${encodeURIComponent(consultation.id)}` : '#contact') }));
    link.find('span').first().text(consultation.buttonText || (consultation.bookable ? 'Book' : 'Enquire'));
    grid.append(card);
  });
}

function updateHome($: CheerioAPI, page: CmsPage, consultations: Consultation[]) {
  updateHero($, section(page, 'hero'));
  updateAbout($, section(page, 'about'));
  const pillars = section(page, 'pillars');
  if (pillars) {
    updateCards($, '.pillars', '.pillar', pillars.items, 'h3', 'p', undefined, '.pillar-num');
    if (pillars.heading) $('.pillars').attr('aria-label', [pillars.eyebrow, pillars.heading].filter(Boolean).join(': '));
    if (pillars.description || pillars.body) $('.pillars').attr('aria-description', pillars.description || pillars.body || '');
  }

  const expertise = section(page, 'expertise');
  if (expertise) {
    setText($, '#expertise .exp-title', expertise.heading);
    setText($, '#expertise .exp-eyebrow-text', expertise.eyebrow);
    if (expertise.description || expertise.body) $('#expertise .exp-head').attr('aria-description', expertise.description || expertise.body || '');
    updateCards($, '#expertise .exp-grid', '.exp-card', expertise.items, '.exp-card-title', '.exp-card-desc');
  }

  const services = section(page, 'services');
  if (services) {
    updateButton($, '#services .svc-btn-outline', services.primaryButtonText, services.primaryButtonUrl);
    setText($, '#services .svc-title', services.heading);
    setText($, '#services .svc-eyebrow', services.eyebrow);
    if (services.description || services.body) $('#services .svc-head').attr('aria-description', services.description || services.body || '');
    updateCards($, '#services .svc-grid', '.svc-card', services.items, '.svc-card-title', '.svc-card-desc');
    updateButton($, '#services .svc-cta-btn', services.secondaryButtonText, services.secondaryButtonUrl);
  }

  const philosophy = section(page, 'philosophy');
  if (philosophy) {
    setText($, '#philosophy .philosophy blockquote', philosophy.heading);
    setText($, '#philosophy .philosophy .attrib', philosophy.description || philosophy.body);
    setText($, '#philosophy .philosophy .eyebrow', philosophy.eyebrow);
  }
  const pricing = section(page, 'pricing');
  updatePricing($, pricing, consultations);

  const approach = section(page, 'approach');
  if (approach) {
    setText($, '#approach .approach-title', approach.heading);
    setText($, '#approach .approach-eyebrow', approach.eyebrow);
    setText($, '#approach .approach-desc', approach.description || approach.body);
    updateCards($, '#approach .approach-steps-col', '.approach-step-card', approach.items, '.approach-step-title', '.approach-step-desc');
  }

  const insights = section(page, 'insights');
  if (insights) {
    updateButton($, '#insights .insights-btn-outline', insights.primaryButtonText, insights.primaryButtonUrl);
    setText($, '#insights .insights-heading', insights.heading);
    setText($, '#insights .insights-eyebrow', insights.eyebrow);
    setText($, '#insights .insights-lead', insights.description || insights.body);
    updateCards($, '#insights .insights-grid', '.insight-card', insights.items, '.insight-title a', '.insight-desc', '.insight-title a');
  }

  const faq = section(page, 'faq');
  if (faq) {
    setText($, '#faq .faq-heading', faq.heading);
    setText($, '#faq .faq-eyebrow', faq.eyebrow);
    setText($, '#faq .faq-subhead', faq.description || faq.body);
    const container = $('#faq .faq-accordion');
    const originals = container.find('.faq-item');
    if (faq.items?.length && originals.length) {
      const prototype = originals.first().clone();
      originals.remove();
      sorted(faq.items).forEach((item, index) => {
        const node = prototype.clone().removeAttr('open');
        if (index === 0) node.attr('open', '');
        node.find('.faq-question span').first().text(item.title || '');
        node.find('.faq-answer p').text(item.description || item.body || '');
        container.append(node);
      });
    }
  }

  const contact = section(page, 'contact');
  if (contact) {
    if (contact.primaryButtonText) setText($, '#contact .contact-submit-btn span', contact.primaryButtonText);
    const contactHeading = $('#contact .contact-title').first();
    if (contact.heading && contactHeading.length) {
      const words = contact.heading.trim().split(/\s+/);
      contactHeading.empty().append(words.slice(0, -1).join(' '), ' ', $('<em></em>').text(words.at(-1) || ''));
    }
    setText($, '#contact .contact-eyebrow', contact.eyebrow);
    setText($, '#contact .contact-desc', contact.description || contact.body);
    const fields: Record<string, string> = {
      'Name placeholder': '#eq-name', 'Email placeholder': '#eq-email',
      'Company placeholder': '#eq-company', 'Phone placeholder': '#eq-phone',
      'Topic placeholder': '#eq-topic', 'Message placeholder': '#eq-message',
    };
    for (const item of contact.items || []) {
      const selector = fields[item.title || ''];
      if (selector && item.description) $(selector).attr('placeholder', item.description);
      if (item.title === 'Form' && item.description) setText($, '.contact-form-title', item.description);
      if (item.title === 'Response time' && item.description) setText($, '.contact-form-subtitle', item.description);
      if (item.title === 'Direct email' && item.description && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.description)) {
        $('#contact .contact-channel-link').attr('href', `mailto:${item.description}`).text(item.description);
      }
      if (item.title === 'Confidentiality' && item.description) setText($, '#contact .contact-channel-subtext', item.description);
    }
  }

  const chrome = page.siteChrome;
  if (chrome) {
    setText($, '.logo-name', chrome.brandName);
    setText($, '.logo-tag', chrome.tagline);
    setText($, '.footer-brand-desc', chrome.footerIntro);
    setText($, '.footer-tagline', chrome.footerTagline);
    if (chrome.copyrightText) {
      const copyright = $('.footer-copy').first();
      const year = copyright.find('#year').first();
      copyright.empty();
      if (year.length) copyright.append(year);
      copyright.append(` ${chrome.copyrightText}`);
    }
    const address = chrome.footerEmail;
    if (address && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      $('.footer-brand-contact a').attr('href', `mailto:${address}`).text(address);
    }
    updateLinkList($, '.footer-nav[aria-label="Footer navigation"]', chrome.exploreLinks);
    updateLinkList($, '.footer-nav[aria-label="Legal navigation"]', chrome.legalLinks);
  }
  if (consultations.length) {
    $('#pricing-grid').attr('data-cms-managed', 'true');
  }
}

function updateLegalPage($: CheerioAPI, page: CmsPage) {
  const content = section(page, 'about') || section(page, 'faq') || section(page, 'contact');
  if (!content) return;
  setText($, 'main h1', content.heading || page.title);
  setText($, 'main .eyebrow', content.eyebrow);
  const container = $('main .container.narrow');
  const firstHeading = container.children('h2').first();
  let intro = container.children('p:not(.eyebrow):not(.muted)').first();
  if (intro.length && firstHeading.length && intro.index() > firstHeading.index()) intro = $();
  if (content.description) {
    if (intro.length) intro.text(content.description);
    else {
      const node = $('<p></p>').text(content.description);
      if (firstHeading.length) firstHeading.before(node);
      else $('main h1').after(node);
    }
  }
  const existing = container.find('h2, p').toArray();
  const firstDynamic = existing.findIndex((node) => $(node).is('h2'));
  if (firstDynamic < 0 || !content.items?.length) return;
  existing.slice(firstDynamic).forEach((node) => $(node).remove());
  sorted(content.items).forEach((item) => {
    const heading = $('<h2></h2>').text(item.title || '');
    const paragraph = $('<p></p>').text(item.description || item.body || '');
    if ((item.title || '').toLowerCase() === 'contact' && (item.description || '').includes('@')) {
      const description = item.description || '';
      const email = description.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
      if (email) {
        const start = description.indexOf(email);
        paragraph.empty().append(description.slice(0, start))
          .append($('<a></a>').attr('href', `mailto:${email}`).text(email))
          .append(description.slice(start + email.length));
      }
    }
    container.append(heading, paragraph);
  });
}

function updateBookingPage($: CheerioAPI, page: CmsPage | null, homepage: CmsPage | null, consultations: Consultation[]) {
  if (!page) return;
  const content = section(page, 'about');
  if (!content) return;
  setText($, 'main h1', content.heading || page.title);
  setText($, 'main .lead', content.description);
  const steps = sorted(content.items).filter((item) => (item.title || '').startsWith('Step '));
  steps.forEach((item, index) => {
    const step = $('#step-' + (index + 1) + ' h2');
    if (step.length) step.text(item.description || item.title || '');
  });
  const confirmation = content.items?.find((item) => item.title === 'Confirmation');
  if (confirmation?.description) setText($, '#step-success > p', confirmation.description);
  const pricing = section(page, 'pricing') || section(homepage, 'pricing');
  if (pricing) {
    const stepOne = $('#step-1');
    setText($, '#step-1 h2', pricing.heading);
    if (pricing.eyebrow) stepOne.attr('aria-label', pricing.eyebrow);
    if (pricing.description || pricing.body) stepOne.attr('aria-description', pricing.description || pricing.body || '');
    setText($, '#step-1 > .muted', pricing.disclaimer);
  }
  const options = $('#consult-options');
  if (options.length && consultations.length) {
    options.empty();
    consultations.forEach((item) => {
      const option = item.bookable
        ? $('<button type="button" class="consult-option" aria-pressed="false"></button>').attr('data-id', item.id)
        : $('<a class="consult-option" href="/#contact" style="text-decoration:none"></a>');
      option.append('<span class="radio" aria-hidden="true"></span>');
      const copy = $('<span></span>').append($('<strong></strong>').text(item.name)).append('<br>')
        .append($('<span class="muted"></span>').text(item.description));
      const fee = item.feeLabel || (item.fee === null ? 'By enquiry' : item.fee === 0 ? 'Complimentary' : `$${item.fee} USD`);
      const detail = $('<span class="fee-col"></span>').append($('<strong></strong>').text(fee)).append('<br>')
        .append($('<span class="muted"></span>').text(item.bookable ? `${item.durationMinutes} min` : 'Enquire'));
      option.append(copy, detail);
      options.append(option);
    });
  }
}

function updateManagePage($: CheerioAPI, page: CmsPage | null) {
  if (!page) return;
  const content = section(page, 'about');
  if (!content) return;
  setText($, 'main h1', content.heading || page.title);
  setText($, 'main .lead', content.description);
  const items = sorted(content.items);
  if (items[0]?.description) $('#mg-token').attr('placeholder', items[0].description);
  if (items[1]?.description) $('#mg-action').attr('aria-description', items[1].description);
  if (items[2]?.description) $('#mg-note').attr('placeholder', items[2].description);
}

export async function renderLegacyBody(
  templateName: string,
  page: CmsPage | null = null,
  consultations: Consultation[] = [],
  homepage: CmsPage | null = null,
) {
  const $ = await parseTemplate(templateName);
  if (templateName === 'index.html' && page) updateHome($, page, consultations);
  else if (templateName === 'privacy.html' || templateName === 'terms.html') {
    if (page) updateLegalPage($, page);
  } else if (templateName === 'book.html') updateBookingPage($, page, homepage, consultations);
  else if (templateName === 'manage.html') updateManagePage($, page);
  return $('body').html() || '';
}
