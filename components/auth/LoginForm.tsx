'use client'

import { useState, type FormEvent } from 'react'
import { createBrowserClient } from '@/lib/supabase/browser'

type Status = 'idle' | 'sending' | 'sent' | 'error'

// Magic-link form. 1.3.3.A Aurora restyle: zinc inputs/button -> §5 input-field pattern
// + .cta-pill, all states (idle/sending/sent/error) live inside the login glass card.
// The flow is untouched (signInWithOtp + PKCE + emailRedirectTo /auth/callback). Laid out
// provider-extensible (Fork 1 = A): the future Yandex SSO button drops into the marked
// slot below without a re-layout.
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

  // Sent — a quiet confirmation replaces the form in the same glass card.
  if (status === 'sent') {
    return (
      <div className="mt-6 text-center">
        <p className="font-body text-sm leading-relaxed text-ink-70">
          Проверьте почту — отправили ссылку на {email}. Может попасть в спам.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-4 font-body text-sm text-ink-50 underline transition-colors hover:text-ink"
        >
          Отправить ещё раз
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="mt-6">
      <input
        type="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        // §5 input-field pattern (SOT-patched this commit): solid white field on glass,
        // ink-30 border -> ink on focus, 2px ink focus-visible (keyboard) outline.
        className="w-full rounded-input border border-ink-30 bg-white px-4 py-[14px] font-body text-[16px] text-ink placeholder:text-ink-50 transition-colors focus:border-ink focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      />
      {status === 'error' && (
        // Form-level error — §5 says inline rose-deep, no new error color introduced.
        <p className="mt-2 font-body text-sm text-rose-deep">{errorMsg}</p>
      )}
      <button type="submit" disabled={status === 'sending'} className="cta-pill mt-4 w-full text-center disabled:opacity-50">
        {status === 'sending' ? 'Отправляю…' : 'Получить ссылку'}
      </button>

      {/* Provider-extensible slot (Fork 1 = A). Yandex SSO drops in here later without a
          re-layout. Kept unrendered for now — an "или" divider with nothing after it reads
          as unfinished, so the email-only login stays clean. Adding a provider = render:
            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-ink-30" />
              <span className="font-body text-xs uppercase tracking-[0.04em] text-ink-50">или</span>
              <span className="h-px flex-1 bg-ink-30" />
            </div>
            <button type="button" className="flex w-full items-center justify-center gap-2 rounded-pill border border-ink-30 py-3 ...">
              Войти через Яндекс
            </button> */}
    </form>
  )
}
