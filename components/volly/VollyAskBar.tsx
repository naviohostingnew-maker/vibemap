import { Sparkles, Mic, X } from 'lucide-react'

// VollyAskBar — the "Спроси Волли" call-strip on content screens (aurora-tokens §13). NOT a §4
// glass card — an inline control. Two leading-icon variants:
//   • chat — Sparkles: a tap opens the Волли chat (Лента, Знакомства).
//   • mic  — Mic: the strip is itself the voice filter on the spot (Каталог, §15-filter).
// Idle = ambient glass-bg + prompt hint. Active (a query is set, §-mock catalog screen 05) =
// accent-magenta hairline, shows the query, and an X reset. The whole idle strip is one tap-
// target; in the active state the X is the action.

export function VollyAskBar({
  variant,
  hint,
  value = null,
  onClick,
  onReset,
}: {
  variant: 'chat' | 'mic'
  hint: string
  value?: string | null
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

  // Idle — prompt hint, whole strip is the tap-target.
  return (
    <button
      type="button"
      aria-label={hint}
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-card border border-white bg-glass-bg px-3 py-[11px] text-left"
    >
      <Icon size={18} strokeWidth={1.5} className="shrink-0 text-accent-magenta" aria-hidden />
      <span className="font-body text-[13px] text-ink-50">{hint}</span>
    </button>
  )
}
