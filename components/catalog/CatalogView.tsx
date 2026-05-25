'use client'

import { useState } from 'react'
import { Search, Sparkles } from 'lucide-react'
import { VollyChip } from '@/components/volly/VollyChip'
import { VollyAskBar } from '@/components/volly/VollyAskBar'
import { ResultCard } from '@/components/volly/ResultCard'
import {
  MOCK_PLACES,
  CATALOG_CATEGORIES,
  CATEGORY_LABEL,
  placeMeta,
  type CatalogCategory,
} from '@/lib/catalog/mock-places'
import { SEED_FILTERS, vollyFilterLine, rerankBySeed } from '@/lib/catalog/volly-filter'

// /catalog body (§13/§15.2/§16). No manual filters — Volly IS the filter: a 4-chip section
// switcher, the §13 ask-bar (Mic), seed-chip starters, and a DETERMINISTIC mock re-rank under a
// query [🎭 this session]. Tapping the idle ask-bar drops in a canned voice query so the
// "Волли отфильтровал" state is reachable without a composer (the composer lands later).

// A tap on the idle Mic strip stands in for a spoken query until the composer exists.
const DEMO_VOICE_QUERY = 'негромко, где-нибудь в центре'

function placesWord(n: number): string {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return 'место'
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return 'места'
  return 'мест'
}

export function CatalogView() {
  const [category, setCategory] = useState<CatalogCategory>('event')
  const [query, setQuery] = useState<string | null>(null)

  const inCategory = MOCK_PLACES.filter((p) => p.category === category)
  const list = query ? rerankBySeed(inCategory, query).slice(0, 3) : inCategory

  const selectCategory = (c: CatalogCategory) => {
    setCategory(c)
    setQuery(null) // a fresh section starts unfiltered
  }

  return (
    <main className="px-[18px] pb-2 pt-5">
      <header className="mb-3 flex items-center justify-between">
        <h1 className="font-display text-[20px] font-medium text-ink">Каталог</h1>
        <Search size={20} strokeWidth={1.5} className="text-ink-50" aria-hidden />
      </header>

      {/* Section chips §16.2 — exactly one active */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {CATALOG_CATEGORIES.map((c) => (
          <VollyChip
            key={c}
            kind="category"
            label={CATEGORY_LABEL[c]}
            selected={c === category}
            onClick={() => selectCategory(c)}
          />
        ))}
      </div>

      {/* Volly-as-filter ask-bar §13 (Mic) */}
      <div className="mb-3">
        <VollyAskBar
          variant="mic"
          hint="Скажи Волли — район, кухня, настроение…"
          value={query}
          onClick={() => setQuery(DEMO_VOICE_QUERY)}
          onReset={() => setQuery(null)}
        />
      </div>

      {query ? (
        // Filtered state — interpretation line + reset (§-mock screen 05)
        <div className="mb-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles size={14} strokeWidth={1.5} className="text-accent-magenta" aria-hidden />
              <span className="font-body text-[13px] font-medium text-ink">
                Волли нашёл {list.length} {placesWord(list.length)}
              </span>
            </span>
            <button
              type="button"
              onClick={() => setQuery(null)}
              className="font-body text-[12px] text-accent-magenta"
            >
              Сбросить
            </button>
          </div>
          <p className="mt-1 font-body text-[12px] text-ink-50">{vollyFilterLine(query)}</p>
        </div>
      ) : (
        // Idle state — vibe anchor + seed-chip starters §16.1
        <>
          <div className="mb-2 flex items-center gap-1.5">
            <Sparkles size={14} strokeWidth={1.5} className="text-accent-magenta" aria-hidden />
            <span className="font-body text-[13px] font-medium text-ink">Под твой вайб «тихие вечера»</span>
          </div>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {SEED_FILTERS.map((s) => (
              <VollyChip key={s} kind="seed" label={s} onClick={() => setQuery(s)} />
            ))}
          </div>
        </>
      )}

      {/* Catalog list — full cards §15.2 */}
      <div className="flex flex-col gap-3">
        {list.map((p) => (
          <ResultCard
            key={p.id}
            density="full"
            title={p.name}
            meta={placeMeta(p)}
            category={p.photoPlaceholder}
            href={`/place/${p.id}`}
          />
        ))}
      </div>
    </main>
  )
}
