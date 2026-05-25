import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Heart, MapPin, Users } from 'lucide-react'
import { categoryIcon } from '@/components/volly/ResultCard'
import { VibeReasonBlock } from '@/components/volly/VibeReasonBlock'
import { VollyAskBar } from '@/components/volly/VollyAskBar'
import { VollyChip } from '@/components/volly/VollyChip'
import { MOCK_PLACES, getPlaceById, priceLabel } from '@/lib/catalog/mock-places'

// /place/[id] (2.B) — the place detail screen. Data is the static mock catalog [🎭]; an unknown
// id 404s. Photo block (placeholder icon §15.3) + VibeReasonBlock §20 + info (price/distance/
// vibeTags — NO time: Place carries none, and the event-vs-restaurant booking model is a
// session-#3 fork) + social proof (only if friendsVisited) + contextual ask-bar §13 (Sparkles =
// chat entry) + the §5 primary ink CTA «Забронировать». The slide-up booking sheet is session
// #3, so the CTA is a stub here.

export function generateStaticParams() {
  return MOCK_PLACES.map((p) => ({ id: p.id }))
}

function fmtDistance(km: number): string {
  return km >= 10 ? `${Math.round(km)} км` : `${km} км`
}

function friendsWord(n: number): string {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return 'друг'
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return 'друга'
  return 'друзей'
}

export default function PlacePage({ params }: { params: { id: string } }) {
  const place = getPlaceById(params.id)
  if (!place) notFound()

  const Icon = categoryIcon(place.photoPlaceholder)

  return (
    <main>
      {/* Photo block — placeholder icon, back + save overlays */}
      <div className="relative flex h-[180px] items-center justify-center bg-glass-bg">
        <Icon size={44} strokeWidth={1.5} className="text-ink-30" aria-hidden />
        <Link
          href="/catalog"
          aria-label="Назад в каталог"
          className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface-volly"
        >
          <ArrowLeft size={17} strokeWidth={1.5} className="text-ink" aria-hidden />
        </Link>
        <button
          type="button"
          aria-label="Сохранить"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface-volly text-ink-50"
        >
          <Heart size={17} strokeWidth={1.5} aria-hidden />
        </button>
      </div>

      <div className="px-[18px] pt-3.5">
        <h1 className="font-display text-[18px] font-medium leading-[1.2] text-ink">{place.name}</h1>
        <p className="mt-0.5 font-body text-[13px] text-ink-50">
          {priceLabel(place.priceTier)} · {fmtDistance(place.distanceKm)} от тебя
        </p>
      </div>

      {/* «Почему по вайбу» §20 — the screen's single accent gradient lives in the heading */}
      <div className="mt-3 px-[18px]">
        <VibeReasonBlock title="Почему по вайбу" accent="вайбу" body={place.vibeReason} />
      </div>

      {/* Info — vibe tags as read-only trait chips §16.3 */}
      <div className="mt-3 flex items-start gap-2 px-[18px]">
        <MapPin size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-ink-30" aria-hidden />
        <div className="flex flex-wrap gap-1.5">
          {place.vibeTags.map((t) => (
            <VollyChip key={t} kind="trait" label={t} />
          ))}
        </div>
      </div>

      {/* Social proof — only when friends have been here */}
      {place.friendsVisited ? (
        <div className="mt-3 flex items-center gap-2 px-[18px]">
          <Users size={16} strokeWidth={1.5} className="shrink-0 text-ink-30" aria-hidden />
          <span className="font-body text-[12px] text-ink-50">
            {place.friendsVisited} {friendsWord(place.friendsVisited)} {place.friendsVisited === 1 ? 'был' : 'были'} здесь
          </span>
        </div>
      ) : null}

      {/* Contextual chat entry §13 (Sparkles → /volly) */}
      <div className="mt-4 px-[18px]">
        <VollyAskBar variant="chat" hint="Спроси Volly об этом месте" href="/volly" />
      </div>

      {/* Primary CTA §5 — solid ink, one per screen. Booking sheet is session #3 (stub). */}
      <div className="mt-4 border-t border-ink-30 px-[18px] py-3">
        <button
          type="button"
          className="w-full rounded-pill bg-ink py-[13px] text-center font-body text-[15px] font-medium text-white"
        >
          Забронировать
        </button>
      </div>
    </main>
  )
}
