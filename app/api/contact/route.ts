import { NextResponse } from 'next/server';
import { sendEnquiryViaSmtp } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, topic, message } = body;

    if (!name || !email || !topic || !message) {
      return NextResponse.json(
        { ok: false, error: 'Please provide all required fields.' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const submittedAt = new Date().toISOString();

    // 1. Forward to Strapi backend database
    const strapiUrl =
      process.env.STRAPI_URL ||
      process.env.NEXT_PUBLIC_STRAPI_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://admin.birendramishra.com'
        : 'http://localhost:1337');
    try {
      await fetch(`${strapiUrl}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            name,
            email,
            topic,
            message,
            submittedAt,
          },
        }),
      });
    } catch (strapiErr) {
      console.warn('[Contact Route] Strapi enquiry storage skipped/failed:', strapiErr);
    }

    // 2. Primary: Send via Google / Hostinger SMTP (Nodemailer)
    let smtpSuccess = false;
    try {
      smtpSuccess = await sendEnquiryViaSmtp({
        name,
        email,
        topic,
        message,
        submittedAt,
      });
    } catch (smtpErr) {
      console.warn('[Contact Route] SMTP transmission error:', smtpErr);
    }

    // 3. Fallback: If SMTP is not yet configured, forward to Google Apps Script
    if (!smtpSuccess) {
      const appsScriptUrl = process.env.APPS_SCRIPT_URL || '';
      if (appsScriptUrl) {
        try {
          await fetch(appsScriptUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
              action: 'enquiry',
              name,
              email,
              topic,
              message,
              consent: true,
            }),
          });
        } catch (scriptErr) {
          console.warn('[Contact Route] Google Apps Script fallback failed:', scriptErr);
        }
      }
    }

    return NextResponse.json({
      ok: true,
      message: 'Thank you. Your confidential enquiry has been received and will be answered shortly.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || 'Server error processing enquiry.' },
      { status: 500 }
    );
  }
}

