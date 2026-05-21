import { NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase/server'
import { ensureUserProvisioned } from '@/lib/supabase/provisioning'

// Magic-link / OAuth callback: exchange the code for a session, then land on /feed.
export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_code', req.url))
  }

  const supabase = createRouteClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, req.url),
    )
  }

  // Provision the vibemap.users row before redirecting — all downstream tables FK to it.
  if (data.user) {
    await ensureUserProvisioned(supabase, data.user)
  }

  return NextResponse.redirect(new URL('/feed', req.url))
}
