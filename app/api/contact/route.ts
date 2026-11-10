import { NextResponse } from 'next/server';

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

    // Forward to Strapi backend if available
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
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
            submittedAt: new Date().toISOString(),
          },
        }),
      });
    } catch {
      // Continue even if Strapi is not running locally
    }

    // Forward to Google Apps Script for instant email notification & Google Sheet logging
    const appsScriptUrl =
      process.env.APPS_SCRIPT_URL ||
      'https://script.google.com/macros/s/AKfycbwpZ7ZS4eO-cQmFa6trn3ilRPpmjMmAvhpxLCi4vwQvhljtatoj_DTq_oOQ46QBjxq6/exec';

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
      } catch (err) {
        console.warn('[Contact Route] Google Apps Script notification failed:', err);
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

