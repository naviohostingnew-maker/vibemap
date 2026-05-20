'use client'

import { useState, type FormEvent } from 'react'
import { Mail } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase/browser'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    const supabase = createBrowserClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      setStatus('error')
      setErrorMsg(error.message)
    } else {
      setStatus('sent')
    }
  }

  if (status === 'sent') {
    return (
      <div className="text-center">
        <p className="text-sm text-zinc-300">
          Проверьте почту — отправили ссылку на {email}. Может попасть в спам.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-4 text-sm text-zinc-400 underline transition hover:text-zinc-200"
        >
          Отправить ещё раз
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        type="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 focus:border-zinc-500 focus:outline-none"
      />
      {status === 'error' && (
        <p className="mt-2 text-sm text-red-400">{errorMsg}</p>
      )}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-white py-3 font-medium text-zinc-900 transition hover:bg-zinc-100 disabled:opacity-50"
      >
        <Mail className="h-4 w-4" />
        Получить ссылку
      </button>
    </form>
  )
}
