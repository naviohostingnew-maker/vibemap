'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { RevealFailed } from './RevealFailed'

// γ-hybrid loading: on mount, triggers the (synchronous, ~13s) Reveal generation
// and holds a designed waiting state until it resolves. ready -> router.refresh()
// so the server component re-reads the DB row (single source of truth, per
// discovery) and swaps in <RevealCard>. failed -> <RevealFailed> with retry. A
// rare {status:'generating'} (another request already in flight) polls via refresh.
// Final visual polish of this waiting state lands in D.2.C.
export function RevealGenerating() {
  const router = useRouter()
  const [failed, setFailed] = useState(false)
  const firedRef = useRef(false)

  const run = async () => {
    setFailed(false)
    try {
      const res = await fetch('/api/vibe/reveal', { method: 'POST' })
      const body = (await res.json().catch(() => ({}))) as { status?: string }
      if (body.status === 'ready') {
        router.refresh()
      } else if (body.status === 'generating') {
        // Another request is mid-flight — re-read shortly; the row will flip to ready.
        setTimeout(() => router.refresh(), 2500)
      } else {
        setFailed(true)
      }
    } catch {
      setFailed(true)
    }
  }

  // Fire exactly once on mount (ref-guarded against React StrictMode double-invoke).
  useEffect(() => {
    if (firedRef.current) return
    firedRef.current = true
    void run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const retry = () => {
    void run()
  }

  if (failed) return <RevealFailed onRetry={retry} />

  return (
    <div
      className="reveal-breathe w-full max-w-md rounded-card border border-white bg-glass-bg-strong p-7 text-center lg:max-w-lg lg:p-9"
      style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
      aria-busy="true"
    >
      {/* Shimmer placeholders — the card's title/text materializing (anticipation). */}
      <div className="space-y-3" aria-hidden>
        <div className="reveal-shimmer mx-auto h-7 w-3/4 rounded-pill" />
        <div className="reveal-shimmer mx-auto h-3 w-1/2 rounded-pill opacity-70" />
      </div>
      <h1 className="mt-7 font-display text-[1.75rem] leading-[1.1] text-ink">
        Volly изучает твой вайб…
      </h1>
      <p className="mt-3 font-body text-[15px] leading-[1.55] text-ink-70">
        Собираю портрет из твоих ответов. Это займёт пару мгновений.
      </p>
    </div>
  )
}
