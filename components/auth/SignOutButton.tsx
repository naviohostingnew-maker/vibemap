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
      className="rounded-pill border border-ink-30 px-5 py-2 font-body text-sm text-ink-70 transition-colors hover:border-ink hover:text-ink"
    >
      Выйти
    </button>
  )
}
