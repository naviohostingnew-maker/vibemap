import type { FeedCard as FeedCardData } from '@/lib/vibe/feed/cards'
import { LikeButton } from './LikeButton'

interface FeedCardProps {
  card: FeedCardData
  // Volly's per-card comment. A string -> rendered in the §9 speaker block. Undefined
  // -> not generated yet: shimmers, unless the batch failed (commentsFailed).
  comment?: string
  // Batch generation failed -> the slot shows a quiet placeholder instead of an
  // infinite shimmer (a failed batch never resolves). Retry lives in FeedCommentSync.
  commentsFailed: boolean
  // Whether the current user has liked this card (Ф4) — drives the LikeButton's
  // initial state; the button then owns optimistic toggling.
  liked: boolean
}

// Feed idea-card (decision Ф1=A / card spec). §4 glass-strong panel, single column,
// read top-to-bottom: kind eyebrow + like heart, title, body, hairline, then Volly's
// note as a named reply. The §9 "Volly speaks" block mirrors RevealCard verbatim
// (shared pattern — must stay identical; <VollySpeaks> extraction is backlog 0.1.3).
// The static card is the suggestion; the Volly comment is the personalizing layer.
export function FeedCard({ card, comment, commentsFailed, liked }: FeedCardProps) {
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
        {/* Like heart (Ф4) — interactive toggle; no accent gradient (§ one-accent-
            per-screen, 6 cards): liked = rose-deep fill, else ink-30 outline. */}
        <LikeButton cardId={card.id} liked={liked} />
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
        {comment !== undefined ? (
          <p className="mt-2 font-display text-[15px] italic leading-[1.5] text-rose-deep">{comment}</p>
        ) : commentsFailed ? (
          // Failed batch — quiet static placeholder (genderless), never an endless shimmer.
          <p className="mt-2 font-body text-[13px] leading-[1.5] text-ink-50">Впечатления Volly появятся позже.</p>
        ) : (
          // Still generating — shimmer slot (reuses .reveal-shimmer, no new class).
          <div className="mt-3 space-y-2" aria-hidden>
            <div className="reveal-shimmer h-3 w-full rounded-pill opacity-70" />
            <div className="reveal-shimmer h-3 w-2/3 rounded-pill opacity-70" />
          </div>
        )}
      </div>
    </div>
  )
}
