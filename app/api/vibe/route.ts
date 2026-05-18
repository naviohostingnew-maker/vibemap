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
  } catch (e: any) {
    console.error('[vibe/route] error:', e);
    return NextResponse.json({ error: e.message ?? 'unknown' }, { status: 500 });
  }
}
