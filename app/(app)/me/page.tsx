import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { SignOutButton } from '@/components/auth/SignOutButton'

export default async function MePage() {
  const {
    data: { user },
  } = await createServerClient().auth.getUser()

  if (!user) redirect('/login')

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
