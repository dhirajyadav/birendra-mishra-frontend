import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const secret = request.nextUrl.searchParams.get('secret');
    const expectedSecret = process.env.REVALIDATION_SECRET || 'bm-secure-revalidation-token';

    if (secret !== expectedSecret) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const model = body.model;
    const entry = body.entry;

    if (model === 'article' && entry?.slug) {
      revalidatePath(`/insights/${entry.slug}`);
      revalidatePath('/insights');
      revalidatePath('/');
    } else {
      revalidatePath('/', 'layout');
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err: any) {
    return NextResponse.json({ message: 'Error revalidating', error: err.message }, { status: 500 });
  }
}

