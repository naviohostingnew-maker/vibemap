import type { Place } from './mock-places'

// Volly-as-filter [🎭 this session]: a seed tap / query produces a canned "Volly interpretation"
// sub-line and a DETERMINISTIC mock re-rank of the list. Real free-text Volly interpretation via
// the agent is a later checkpoint — NOT here. The shapes (query in → interpretation + ordered
// Place[] out) are what the real agent call will satisfy, so the screen does not change when it
// lands.

export const SEED_FILTERS = ['район', 'кухня', 'сегодня', 'удиви меня'] as const
export type SeedFilter = (typeof SEED_FILTERS)[number]

const SEED_LINE: Record<SeedFilter, string> = {
  район: 'центр · рядом · под твой вайб «тихие вечера»',
  кухня: 'спокойные места с кухней · под твой вайб',
  сегодня: 'открыто сегодня вечером · негромко',
  'удиви меня': 'неожиданное, но в твоём темпе',
}

// "Volly interpretation" sub-line for the active filter (§13 under-bar text).
export function vollyFilterLine(query: string): string {
  if ((SEED_FILTERS as readonly string[]).includes(query)) {
    return SEED_LINE[query as SeedFilter]
  }
  return `«${query}» · под твой вайб «тихие вечера»`
}

// FNV-1a hash → deterministic score for a (placeId, query) pair.
function score(placeId: string, query: string): number {
  let h = 2166136261
  const s = `${placeId}|${query}`
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// Stable re-rank of the current list under a query. Same (list, query) → same order, every render.
export function rerankBySeed(places: Place[], query: string): Place[] {
  return [...places].sort((a, b) => score(a.id, query) - score(b.id, query))
}
