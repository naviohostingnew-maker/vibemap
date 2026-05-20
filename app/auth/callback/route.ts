import { NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase/server'

// Magic-link / OAuth callback: exchange the code for a session, then land on /feed.
export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_code', req.url))
  }

  const { error } = await createRouteClient().auth.exchangeCodeForSession(code)
  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, req.url),
    )
  }

  return NextResponse.redirect(new URL('/feed', req.url))
}
