import Link from 'next/link'
import { Sparkles, Mic, X } from 'lucide-react'

// VollyAskBar — the "Спроси Волли" call-strip on content screens (aurora-tokens §13). NOT a §4
// glass card — an inline control. Two leading-icon variants:
//   • chat — Sparkles: a tap opens the Волли chat (Лента, Знакомства, карточка места).
//   • mic  — Mic: the strip is itself the voice filter on the spot (Каталог, §15-filter).
// Idle = ambient glass-bg + prompt hint. Active (a query is set, §-mock catalog screen 05) =
// accent-magenta hairline, shows the query, and an X reset. The whole idle strip is one tap-
// target — a Link when `href` is given (chat entry), else a button with `onClick`.

const IDLE_CLASS =
  'flex w-full items-center gap-2 rounded-card border border-white bg-glass-bg px-3 py-[11px] text-left'

export function VollyAskBar({
  variant,
  hint,
  value = null,
  href,
  onClick,
  onReset,
}: {
  variant: 'chat' | 'mic'
  hint: string
  value?: string | null
  href?: string
  onClick?: () => void
  onReset?: () => void
}) {
  const Icon = variant === 'mic' ? Mic : Sparkles

  // Active — holds the query, accent hairline, X reset.
  if (value) {
    return (
      <div className="flex items-center gap-2 rounded-card border border-accent-magenta bg-glass-bg px-3 py-[10px]">
        <Icon size={18} strokeWidth={1.5} className="shrink-0 text-accent-magenta" aria-hidden />
        <span className="min-w-0 flex-1 truncate font-body text-[13px] text-ink">«{value}»</span>
        <button type="button" aria-label="Сбросить фильтр" onClick={onReset} className="shrink-0 text-ink-50 transition-colors active:text-ink">
          <X size={16} strokeWidth={1.5} aria-hidden />
        </button>
      </div>
    )
  }

  // Idle — prompt hint, whole strip is the tap-target. Link when href is given (chat entry).
  const inner = (
    <>
      <Icon size={18} strokeWidth={1.5} className="shrink-0 text-accent-magenta" aria-hidden />
      <span className="font-body text-[13px] text-ink-50">{hint}</span>
    </>
  )

  if (href) {
    return (
      <Link href={href} aria-label={hint} className={IDLE_CLASS}>
        {inner}
      </Link>
    )
  }

  return (
    <button type="button" aria-label={hint} onClick={onClick} className={IDLE_CLASS}>
      {inner}
    </button>
  )
}
