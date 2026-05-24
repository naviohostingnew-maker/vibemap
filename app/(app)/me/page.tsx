import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { ensureUserProvisioned } from '@/lib/supabase/provisioning'
import { SignOutButton } from '@/components/auth/SignOutButton'

// /me — the profile screen. Sprint 1.3.2.A mini-reskin: dropped the dark zinc theme
// for Aurora (the mesh comes from the (app) layout; glass card + ink scale here).
// Content and features are unchanged — email + sign-out only; full restyle is 1.3.x.
export default async function MePage() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Safety net: ensure the vibemap.users row exists even if callback provisioning was skipped.
  await ensureUserProvisioned(supabase, user)

  return (
    <main className="mx-auto min-h-screen max-w-md px-[26px] pt-16">
      <h1 className="font-display text-4xl leading-none text-ink">Ваш профиль</h1>
      <div className="mt-7 rounded-card border border-white bg-glass-bg-strong p-6">
        <p className="font-body text-sm text-ink-50">Email</p>
        <p className="font-body text-ink">{user.email}</p>
      </div>
      <div className="mt-6">
        <SignOutButton />
      </div>
    </main>
  )
}
