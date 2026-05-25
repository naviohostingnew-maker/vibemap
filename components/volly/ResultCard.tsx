import { Music, UtensilsCrossed, Wine, Coffee, Plane, Ticket } from 'lucide-react'

// ResultCard — Volly hands results back as CARDS inside her bubble, not as prose (UX-spec).
// This is the COMPACT density (aurora-tokens §15.1): the in-chat card. The full density
// (§15.2 — photo-block catalog/feed card) lands with the Каталог screen (session #2).
//
// §15.1: hairline ink-30 border, r-card radius, 48×48 preview with a category placeholder
// icon (§15.3), title + meta, and a SPLIT footer of two text actions divided by a vertical
// hairline. The in-chat action is a text-accent, NOT a solid button — the solid ink CTA (§5)
// is one-per-screen and belongs to the screen, not to a bubble.

export type ResultCategory = 'concert' | 'restaurant' | 'bar' | 'cafe' | 'trip' | 'event'

const CATEGORY_ICON = {
  concert: Music,
  restaurant: UtensilsCrossed,
  bar: Wine,
  cafe: Coffee,
  trip: Plane,
  event: Ticket,
} as const

export function ResultCard({
  density = 'compact',
  title,
  meta,
  category,
  actionLabel,
  onDetails,
  onAction,
}: {
  density?: 'compact'
  title: string
  meta: string
  category: ResultCategory
  actionLabel: string
  onDetails?: () => void
  onAction?: () => void
}) {
  void density // only 'compact' exists this checkpoint; kept for the §15.2 full density later
  const Icon = CATEGORY_ICON[category]

  return (
    <div className="overflow-hidden rounded-card border border-ink-30 bg-surface-volly">
      <div className="flex items-center gap-3 p-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-input bg-glass-bg">
          <Icon size={20} strokeWidth={1.5} className="text-ink-30" aria-hidden />
        </span>
        <span className="min-w-0">
          <span className="block truncate font-body text-[14px] font-medium leading-[1.3] text-ink">
            {title}
          </span>
          <span className="mt-0.5 block truncate font-body text-[13px] leading-[1.4] text-ink-50">
            {meta}
          </span>
        </span>
      </div>
      {/* Split footer — two actions divided by a vertical hairline (§15.1). */}
      <div className="flex border-t border-ink-30 text-[13px]">
        <button
          type="button"
          onClick={onDetails}
          className="flex-1 border-r border-ink-30 py-2.5 font-body text-ink-50 transition-colors active:text-ink"
        >
          Подробнее
        </button>
        <button
          type="button"
          onClick={onAction}
          className="flex-1 py-2.5 font-body font-medium text-accent-magenta transition-transform active:scale-95"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  )
}
