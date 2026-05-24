'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

// γ-hybrid comment loader for /feed. Unlike RevealGenerating — whose poll is
// remount-driven (router.refresh remounts the whole screen, so a fresh firedRef
// re-fires) — the feed cards are persistent and this is a SIBLING that does NOT
// remount on router.refresh. So it runs an EXPLICIT re-POST poll-loop: firedRef
// guards only the initial StrictMode double-mount; thereafter the loop re-POSTs on
// {generating} until the row flips ready|failed. ready -> router.refresh so the
// server re-reads user_feed_comments and swaps shimmer for text. failed/non-200 ->
// a quiet batch-level retry banner (the engine generates the whole batch in one
// Sonnet call, so retry is batch-wide, not per-card). Mounted only while the row is
// not yet ready (the page gates this), so a ready reload fires no needless POST.
const POLL_MS = 2500

export function FeedCommentSync() {
  const router = useRouter()
  const [failed, setFailed] = useState(false)
  const firedRef = useRef(false)

  const run = async () => {
    setFailed(false)
    try {
      const res = await fetch('/api/vibe/feed', { method: 'POST' })
      const body = (await res.json().catch(() => ({}))) as { status?: string }
      if (!res.ok) {
        setFailed(true)
        return
      }
      if (body.status === 'ready') {
        router.refresh()
      } else if (body.status === 'generating') {
        // Another request is mid-flight — re-POST shortly until the row flips.
        setTimeout(() => void run(), POLL_MS)
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

  if (!failed) return null

  // Genderless copy — no past-tense gender (decision: gender-guard 1.3.1.C/D).
  return (
    <div className="mt-5 rounded-card border border-ink-30 bg-glass-bg p-4 text-center">
      <p className="font-body text-sm text-ink-70">Не удалось загрузить впечатления Volly.</p>
      <button
        type="button"
        onClick={() => void run()}
        className="mt-2 rounded-pill border border-ink-30 px-4 py-1.5 font-body text-sm text-ink-70 transition-colors hover:border-ink hover:text-ink"
      >
        Попробовать снова
      </button>
    </div>
  )
}
