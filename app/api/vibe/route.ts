import { NextRequest, NextResponse } from 'next/server';
import { vibeRespond } from '@/lib/vibe/agent';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'message required' }, { status: 400 });
    }
    const response = await vibeRespond(message);
    return NextResponse.json({ response });
  } catch (e: unknown) {
    console.error('[vibe/route] error:', e);
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
