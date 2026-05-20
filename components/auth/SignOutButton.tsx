'use client'

import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/browser'

export function SignOutButton() {
  const router = useRouter()

  const onClick = async () => {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-700"
    >
      Выйти
    </button>
  )
}
