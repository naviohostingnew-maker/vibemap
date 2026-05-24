import { Heart } from 'lucide-react'
import type { FeedCard as FeedCardData } from '@/lib/vibe/feed/cards'

interface FeedCardProps {
  card: FeedCardData
  // Volly's per-card comment. A string -> rendered in the §9 speaker block. Undefined
  // -> the comment is still generating, so the slot shimmers (1.3.2.B.2 fills it).
  comment?: string
  // Whether the current user has liked this card (Ф4). B.1 is presentational only —
  // the heart reflects the prop; the interactive <LikeButton> wraps this slot in B.3.
  liked: boolean
}

// Feed idea-card (decision Ф1=A / card spec). §4 glass-strong panel, single column,
// read top-to-bottom: kind eyebrow + like heart, title, body, hairline, then Volly's
// note as a named reply. The §9 "Volly speaks" block mirrors RevealCard verbatim
// (shared pattern — must stay identical; <VollySpeaks> extraction is backlog 0.1.3).
// The static card is the suggestion; the Volly comment is the personalizing layer.
export function FeedCard({ card, comment, liked }: FeedCardProps) {
  return (
    <div
      className="w-full rounded-card border border-white bg-glass-bg-strong p-7"
      style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
    >
      <div className="flex items-center justify-between">
        {/* kind eyebrow — §2 micro, mirrors the RevealCard archetype eyebrow (F4). */}
        <span className="font-body text-[11px] uppercase leading-[1.3] tracking-[0.04em] text-ink-50">
          {card.kind}
        </span>
        {/* Like heart — presentational in B.1 (reflects `liked`); no accent gradient
            here (§ one-accent-per-screen, 6 cards). Interactive toggle lands in B.3. */}
        <Heart
          size={20}
          strokeWidth={1.5}
          aria-hidden
          className={liked ? 'text-rose-deep' : 'text-ink-30'}
          fill={liked ? 'currentColor' : 'none'}
        />
      </div>

      {/* Plain Playfair title — no accent-word: 6 cards would be 6 accents (§2). */}
      <h2 className="mt-2 font-display text-2xl font-normal leading-[1.1] text-ink">{card.title}</h2>

      <p className="mt-3 font-body text-[16px] leading-[1.6] text-ink-70">{card.body}</p>

      {/* Volly speaks — verbatim mirror of RevealCard §9 block. */}
      <div className="mt-6 border-t border-ink-30 pt-5">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-block h-[9px] w-[9px] rounded-full"
            style={{ backgroundImage: 'linear-gradient(110deg, var(--accent-magenta), var(--accent-orange))' }}
          />
          <span className="font-display text-[15px] italic leading-none text-ink">Volly</span>
        </div>
        {comment === undefined ? (
          // Comment still generating — shimmer slot (reuses .reveal-shimmer, no new class).
          <div className="mt-3 space-y-2" aria-hidden>
            <div className="reveal-shimmer h-3 w-full rounded-pill opacity-70" />
            <div className="reveal-shimmer h-3 w-2/3 rounded-pill opacity-70" />
          </div>
        ) : (
          <p className="mt-2 font-display text-[15px] italic leading-[1.5] text-rose-deep">{comment}</p>
        )}
      </div>
    </div>
  )
}
