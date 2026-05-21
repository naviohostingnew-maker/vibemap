import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { ensureUserProvisioned } from '@/lib/supabase/provisioning'
import { SignOutButton } from '@/components/auth/SignOutButton'

export default async function MePage() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Safety net: ensure the vibemap.users row exists even if callback provisioning was skipped.
  await ensureUserProvisioned(supabase, user)

  return (
    <div className="mx-auto mt-24 max-w-md">
      <h1 className="mb-6 text-2xl font-medium">Ваш профиль</h1>
      <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <p className="text-sm text-zinc-400">Email</p>
        <p className="text-zinc-100">{user.email}</p>
      </div>
      <SignOutButton />
    </div>
  )
}
