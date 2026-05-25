import { Sparkles } from 'lucide-react'
import { AccentWord } from '@/components/ui/AccentWord'

// VibeReasonBlock — the "по вайбу" explainer (aurora-tokens §20): why a place fits, "ваш общий
// вайб" on a friend profile, "почему рекомендовано" in the feed. Carries Volly's voice (§9).
// This is the ONE place §20 sanctions a 1px --accent-magenta outline (like the §5/§10 focus
// state). The micro-heading carries the screen's single AccentWord gradient (§7) — that is the
// one allowed gradient-on-text per screen.
//
// Reusable by design: the API is title/accent/body, NOT place-specific — the friend profile
// (§18 "ваш общий вайб") passes its own copy and reuses this block unchanged.

export function VibeReasonBlock({
  title,
  accent,
  body,
  withTint = true,
}: {
  title: string
  accent: string
  body: string
  withTint?: boolean
}) {
  return (
    <div
      className={`rounded-card border border-accent-magenta px-[14px] py-3 ${withTint ? 'bg-accent-tint' : ''}`}
    >
      <div className="flex items-center gap-1.5">
        <Sparkles size={14} strokeWidth={1.5} className="shrink-0 text-accent-magenta" aria-hidden />
        <span className="font-body text-[13px] font-medium text-ink">
          <AccentWord text={title} accent={accent} />
        </span>
      </div>
      <p className="mt-1.5 font-body text-[13px] leading-[1.5] text-ink-70">{body}</p>
    </div>
  )
}
