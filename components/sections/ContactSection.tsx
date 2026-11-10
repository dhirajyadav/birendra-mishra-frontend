'use client';

import React, { useState } from 'react';
import { ContactSectionData } from '@/lib/types';

interface ContactSectionProps {
  data?: ContactSectionData;
  linkedInUrl?: string;
  contactEmail?: string;
}

export default function ContactSection({
  data,
  linkedInUrl = 'https://www.linkedin.com/',
  contactEmail = 'bbm@birendramishra.com',
}: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'Strategic Finance & CFO Advisory',
    message: '',
  });
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | 'info' | null;
    message: string;
  }>({ type: null, message: '' });
  const [loading, setLoading] = useState(false);

  const eyebrow = data?.eyebrow || 'Connect';
  const titleKicker = data?.titleKicker || 'Let’s turn complexity into opportunity';
  const titleMain = data?.titleMain || 'Confidential\nconversations.';
  const description =
    data?.description ||
    'Open to conversations around strategic advisory, board and executive opportunities, corporate finance, and selected collaborations. Share a short note about the context and the discussion you have in mind.';
  const execName = data?.execName || 'Birendra Mishra';
  const execRole =
    data?.execRole || 'Senior Executive | Global Financial Strategy, M&A and Capital Governance';

  const linkedinText = data?.linkedinBadgeText || 'Connect on LinkedIn';
  const finalLinkedInUrl = data?.linkedinUrl || linkedInUrl;

  const formNameLabel = data?.formNameLabel || 'Name';
  const formNamePlaceholder = data?.formNamePlaceholder || 'Your name';
  const formEmailLabel = data?.formEmailLabel || 'Email';
  const formEmailPlaceholder = data?.formEmailPlaceholder || 'you@company.com';
  const formTypeLabel = data?.formTypeLabel || 'Enquiry Type';
  const formMsgLabel = data?.formMessageLabel || 'Message';
  const formMsgPlaceholder =
    data?.formMessagePlaceholder || 'Briefly describe the opportunity or discussion.';
  const submitText = data?.formSubmitText || 'Send confidential enquiry';
  const disclaimer = data?.formDisclaimer || 'All enquiries are held in strict executive confidence.';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setStatus({ type: 'error', message: 'Please enter your name.' });
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address (e.g. you@company.com).' });
      return;
    }
    if (!formData.topic.trim()) {
      setStatus({ type: 'error', message: 'Please select an enquiry type.' });
      return;
    }
    if (!formData.message.trim()) {
      setStatus({ type: 'error', message: 'Please enter your message.' });
      return;
    }

    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const resData = await res.json();
      if (res.ok && resData.ok) {
        setStatus({
          type: 'success',
          message:
            'Thank you. Your confidential enquiry has been received and will be answered shortly.',
        });
        setFormData({
          name: '',
          email: '',
          topic: 'Strategic Finance & CFO Advisory',
          message: '',
        });
      } else {
        throw new Error(resData.error || 'Submission failed');
      }
    } catch {
      // Fallback to mailto
      const mailtoUrl = `mailto:${encodeURIComponent(contactEmail)}?subject=${encodeURIComponent(
        `Enquiry: ${formData.topic} - ${formData.name}`
      )}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\nEnquiry Type: ${formData.topic}\n\nMessage:\n${formData.message}`
      )}`;
      setStatus({
        type: 'success',
        message: 'Opening your email client to complete transmission of your enquiry...',
      });
      window.location.href = mailtoUrl;
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section contact-section" id="contact" aria-label="Contact">
      <div className="container contact-container">
        <div className="contact-frame-card contact-reveal-item">
          <div className="contact-grid">
            {/* Left Column: Executive Overview & Channels */}
            <div className="contact-lead-col">
              <div className="contact-eyebrow-wrap">
                <span className="contact-eyebrow-accent" aria-hidden="true"></span>
                <p className="eyebrow contact-eyebrow">{eyebrow}</p>
              </div>
              <h2 className="contact-title">
                <span className="contact-title-kicker">{titleKicker}</span>
                <span className="contact-title-main">
                  {titleMain.includes('\n') ? (
                    titleMain.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < titleMain.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))
                  ) : (
                    titleMain
                  )}
                </span>
              </h2>
              <p className="contact-desc">{description}</p>

              <div className="contact-exec-profile">
                <div className="contact-exec-name">{execName}</div>
                <div className="contact-exec-role">{execRole}</div>
              </div>

              <div className="contact-channels-bottom">
                <a
                  className="contact-linkedin-badge"
                  href={finalLinkedInUrl}
                  target="_blank"
                  rel="noopener"
                  aria-label="Connect on LinkedIn"
                >
                  <span className="contact-linkedin-icon" aria-hidden="true">
                    in
                  </span>
                  <span className="contact-linkedin-text">{linkedinText}</span>
                  <span className="contact-link-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </div>
            </div>

            {/* Right Column: Clean Executive Enquiry Form */}
            <div className="contact-form-col">
              <form className="contact-form-clean" id="enquiry-form" onSubmit={handleSubmit} noValidate>
                {status.type && (
                  <div className={`alert alert-${status.type}`} role="alert">
                    {status.message}
                  </div>
                )}

                <div className="contact-form-grid-modern">
                  {/* Name & Email (Two Column Row) */}
                  <div className="contact-form-row-duo">
                    <div className="contact-form-group">
                      <label htmlFor="eq-name" className="contact-input-label">
                        {formNameLabel}
                      </label>
                      <input
                        id="eq-name"
                        name="name"
                        required
                        autoComplete="name"
                        placeholder={formNamePlaceholder}
                        className="contact-input-clean"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="contact-form-group">
                      <label htmlFor="eq-email" className="contact-input-label">
                        {formEmailLabel}
                      </label>
                      <input
                        id="eq-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder={formEmailPlaceholder}
                        className="contact-input-clean"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Enquiry Type Dropdown */}
                  <div className="contact-form-group">
                    <label htmlFor="eq-type" className="contact-input-label">
                      {formTypeLabel}
                    </label>
                    <div className="contact-select-container">
                      <select
                        id="eq-type"
                        name="topic"
                        required
                        className="contact-select-clean"
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      >
                        <option value="Strategic Finance & CFO Advisory">
                          Strategic Finance &amp; CFO Advisory
                        </option>
                        <option value="M&A, Investment & Capital Allocation">
                          M&amp;A, Investment &amp; Capital Allocation
                        </option>
                        <option value="Governance, Risk & International Exposure">
                          Governance, Risk &amp; International Exposure
                        </option>
                        <option value="Finance Transformation">Finance Transformation</option>
                        <option value="Board, Corporate Finance & Leadership Opportunities">
                          Board, Corporate Finance &amp; Leadership Opportunities
                        </option>
                      </select>
                      <svg
                        className="contact-select-chevron"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </div>
                  </div>

                  {/* Message Textarea */}
                  <div className="contact-form-group">
                    <label htmlFor="eq-message" className="contact-input-label">
                      {formMsgLabel}
                    </label>
                    <textarea
                      id="eq-message"
                      name="message"
                      rows={4}
                      required
                      placeholder={formMsgPlaceholder}
                      className="contact-textarea-clean"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                  </div>

                  {/* Submit Action & Prototype Disclaimer */}
                  <div className="contact-form-actions">
                    <button
                      type="submit"
                      className="contact-clean-btn"
                      id="enquiry-submit"
                      disabled={loading}
                    >
                      <span>{loading ? 'Sending enquiry…' : submitText}</span>
                      <span className="contact-btn-arrow" aria-hidden="true">
                        ↗
                      </span>
                    </button>
                    <p className="contact-disclaimer-note">{disclaimer}</p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
