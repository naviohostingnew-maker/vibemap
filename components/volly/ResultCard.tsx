import Link from 'next/link'
import { Music, UtensilsCrossed, Wine, Coffee, Plane, Ticket } from 'lucide-react'

// ResultCard — Volly hands results back as CARDS, not prose (UX-spec). Two densities, same
// family (aurora-tokens §15):
//   • compact (§15.1) — the in-chat card: 48×48 preview, title+meta, a SPLIT footer of two
//     text actions. The in-chat action is a text-accent, NOT a solid button (the solid ink CTA
//     §5 is one-per-screen and belongs to the screen).
//   • full (§15.2) — the catalog/feed/profile card: a photo block on top (92px in the catalog
//     list) with a category placeholder icon (§15.3), then title + meta + an optional "по вайбу"
//     tag (§16.1). The whole card is a tap-target → the detail screen.

export type ResultCategory = 'concert' | 'restaurant' | 'bar' | 'cafe' | 'trip' | 'event'

const CATEGORY_ICON = {
  concert: Music,
  restaurant: UtensilsCrossed,
  bar: Wine,
  cafe: Coffee,
  trip: Plane,
  event: Ticket,
} as const

type CompactProps = {
  density?: 'compact'
  title: string
  meta: string
  category: ResultCategory
  actionLabel: string
  onDetails?: () => void
  onAction?: () => void
}

type FullProps = {
  density: 'full'
  title: string
  meta: string
  category: ResultCategory
  href: string
  vibeTag?: string
}

export function ResultCard(props: CompactProps | FullProps) {
  const Icon = CATEGORY_ICON[props.category]

  // §15.2 full — photo block + body, whole card links to the detail screen.
  if (props.density === 'full') {
    return (
      <Link
        href={props.href}
        className="block overflow-hidden rounded-card border border-ink-30 bg-surface-volly transition-transform active:scale-[0.99]"
      >
        <div className="flex h-[92px] items-center justify-center bg-glass-bg">
          <Icon size={28} strokeWidth={1.5} className="text-ink-30" aria-hidden />
        </div>
        <div className="px-3 py-2.5">
          <div className="flex items-start justify-between gap-2">
            <span className="font-body text-[14px] font-medium leading-[1.3] text-ink">{props.title}</span>
            {props.vibeTag && (
              <span
                className="shrink-0 rounded-[13px] bg-accent-tint px-[10px] py-[3px] font-body text-[11px] text-rose-deep"
                style={{ letterSpacing: '0.02em' }}
              >
                {props.vibeTag}
              </span>
            )}
          </div>
          <span className="mt-1 block font-body text-[12px] leading-[1.4] text-ink-50">{props.meta}</span>
        </div>
      </Link>
    )
  }

  // §15.1 compact — in-chat card with a split footer.
  return (
    <div className="overflow-hidden rounded-card border border-ink-30 bg-surface-volly">
      <div className="flex items-center gap-3 p-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-input bg-glass-bg">
          <Icon size={20} strokeWidth={1.5} className="text-ink-30" aria-hidden />
        </span>
        <span className="min-w-0">
          <span className="block truncate font-body text-[14px] font-medium leading-[1.3] text-ink">
            {props.title}
          </span>
          <span className="mt-0.5 block truncate font-body text-[13px] leading-[1.4] text-ink-50">
            {props.meta}
          </span>
        </span>
      </div>
      <div className="flex border-t border-ink-30 text-[13px]">
        <button
          type="button"
          onClick={props.onDetails}
          className="flex-1 border-r border-ink-30 py-2.5 font-body text-ink-50 transition-colors active:text-ink"
        >
          Подробнее
        </button>
        <button
          type="button"
          onClick={props.onAction}
          className="flex-1 py-2.5 font-body font-medium text-accent-magenta transition-transform active:scale-95"
        >
          {props.actionLabel}
        </button>
      </div>
    </div>
  )
}
