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

