'use client'

import { useState, useTransition } from 'react'
import { Heart } from 'lucide-react'
import { toggleFeedLike } from '@/app/(app)/feed/actions'

interface LikeButtonProps {
  cardId: string
  liked: boolean
}

// Ф4 like control. Optimistic toggle (the heart fills instantly), then the server
// action persists to vibe_memories; on error we roll back to the previous state. A
// like is a sub-second mutation, so no toast/loading state (that γ-hybrid treatment
// is for long-running work like Reveal/feed-comments). a11y: a real <button> with
// aria-pressed reflecting liked; the Heart glyph is decorative (aria-hidden) and the
// accessible name comes from aria-label.
export function LikeButton({ cardId, liked: initialLiked }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [, startTransition] = useTransition()

  const onClick = () => {
    const prev = liked
    setLiked(!prev) // optimistic
    startTransition(async () => {
      try {
        await toggleFeedLike(cardId, prev)
      } catch {
        setLiked(prev) // rollback on failure
      }
    })
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={liked}
      aria-label={liked ? 'Убрать из понравившегося' : 'Нравится'}
      className="rounded-pill p-1 text-ink-30 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      <Heart
        size={20}
        strokeWidth={1.5}
        aria-hidden
        className={liked ? 'text-rose-deep' : ''}
        fill={liked ? 'currentColor' : 'none'}
      />
    </button>
  )
}
