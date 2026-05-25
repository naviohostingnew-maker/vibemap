import type { ResultCategory } from '@/components/volly/ResultCard'

// Catalog mock dataset [🎭 simulated — границы прототипа]. There are no places/events/tickets
// tables (confirmed by the architect's bookings discovery): the catalog is a static curated
// module. The Place type is FORWARD-COMPAT (same contract as the 1.B waveform shape): a real
// афиша/каталог API later returns the same shape, so the catalog card, the place screen, and
// the booking metadata-snapshot all keep working unchanged. When a real photo arrives, add
// `photoUrl?` and fall back to `photoPlaceholder`; nothing else moves.

export type CatalogCategory = 'event' | 'restaurant' | 'concert' | 'trip'
export type PriceTier = 1 | 2 | 3 // ₽ / ₽₽ / ₽₽₽

export type Place = {
  id: string
  name: string
  category: CatalogCategory // drives the 4-chip section switcher (§16.2)
  priceTier: PriceTier
  distanceKm: number
  vibeTags: string[] // short "по вайбу" markers — e.g. ['тихо', 'негромко']
  vibeReason: string // Volly's one-line "почему по вайбу" (used on the place card §20)
  photoPlaceholder: ResultCategory // category icon for the photo block until a real photo URL exists
  friendsVisited?: number // social proof — "друзья были здесь"
}

export const CATEGORY_LABEL: Record<CatalogCategory, string> = {
  event: 'События',
  restaurant: 'Рестораны',
  concert: 'Концерты',
  trip: 'Поездки',
}

// Order of the 4 section chips, left→right (§16.2).
export const CATALOG_CATEGORIES: CatalogCategory[] = ['event', 'restaurant', 'concert', 'trip']

export const MOCK_PLACES: Place[] = [
  // — Рестораны —
  { id: 'tiho', name: 'Винный бар «Тихо»', category: 'restaurant', priceTier: 2, distanceKm: 0.4, vibeTags: ['уютно', 'негромко'], vibeReason: 'Низкий свет, тихий зал и список вин на одну страницу — ровно твой неспешный вечер.', photoPlaceholder: 'bar', friendsVisited: 2 },
  { id: 'polka', name: 'Бар «Полка»', category: 'restaurant', priceTier: 2, distanceKm: 0.6, vibeTags: ['тихий', 'книжный'], vibeReason: 'Книжные стеллажи вместо музыки — место, где слышно собеседника.', photoPlaceholder: 'bar' },
  { id: 'svet', name: 'Кафе «Свет»', category: 'restaurant', priceTier: 2, distanceKm: 1.1, vibeTags: ['светло', 'столики у окна'], vibeReason: 'Утренний свет и столики у окна — спокойно начать или закончить день.', photoPlaceholder: 'cafe', friendsVisited: 1 },
  { id: 'vecher', name: 'Чайная «Вечер»', category: 'restaurant', priceTier: 1, distanceKm: 0.7, vibeTags: ['спокойно', 'чай'], vibeReason: 'Сорок видов чая и ноль спешки — твой темп.', photoPlaceholder: 'cafe' },
  // — События —
  { id: 'lecture-art', name: 'Лекция «Тишина в живописи»', category: 'event', priceTier: 1, distanceKm: 2.3, vibeTags: ['камерно', 'вдумчиво'], vibeReason: 'Маленький зал, негромкий разговор об искусстве — без толпы.', photoPlaceholder: 'event', friendsVisited: 3 },
  { id: 'market-quiet', name: 'Вечерний книжный маркет', category: 'event', priceTier: 1, distanceKm: 1.8, vibeTags: ['неспешно', 'книги'], vibeReason: 'Бродить между лотков с книгами под тихий джаз — твоя стихия.', photoPlaceholder: 'event' },
  { id: 'film-club', name: 'Киноклуб: немое кино', category: 'event', priceTier: 2, distanceKm: 3.1, vibeTags: ['атмосферно', 'малый зал'], vibeReason: 'Немое кино под живое фортепиано в зале на 30 мест.', photoPlaceholder: 'event' },
  { id: 'tea-ceremony', name: 'Чайная церемония', category: 'event', priceTier: 2, distanceKm: 2.0, vibeTags: ['медитативно', 'тихо'], vibeReason: 'Час полной тишины и внимания к одному действию.', photoPlaceholder: 'event', friendsVisited: 1 },
  // — Концерты —
  { id: 'piano-night', name: 'Фортепианный вечер', category: 'concert', priceTier: 2, distanceKm: 1.5, vibeTags: ['камерно', 'акустика'], vibeReason: 'Один рояль, тёплый зал, никакого усиления — звук как есть.', photoPlaceholder: 'concert', friendsVisited: 2 },
  { id: 'jazz-quiet', name: 'Тихий джаз-сет', category: 'concert', priceTier: 2, distanceKm: 0.9, vibeTags: ['негромко', 'лаунж'], vibeReason: 'Джаз на полутонах в маленьком баре — фон для разговора, не для танцев.', photoPlaceholder: 'concert' },
  { id: 'cello-solo', name: 'Виолончель соло', category: 'concert', priceTier: 3, distanceKm: 2.7, vibeTags: ['глубоко', 'акустика'], vibeReason: 'Один инструмент на весь зал — звук, в который можно уйти.', photoPlaceholder: 'concert' },
  // — Поездки —
  { id: 'lake-day', name: 'День у тихого озера', category: 'trip', priceTier: 2, distanceKm: 48, vibeTags: ['природа', 'тишина'], vibeReason: 'Час за городом — вода, лес и ни одного экрана.', photoPlaceholder: 'trip', friendsVisited: 1 },
  { id: 'monastery', name: 'Прогулка к скиту', category: 'trip', priceTier: 1, distanceKm: 62, vibeTags: ['уединённо', 'пешком'], vibeReason: 'Тропа, лес и тихое место в конце — для тех, кто любит идти молча.', photoPlaceholder: 'trip' },
  { id: 'village-cafe', name: 'Деревенская кофейня', category: 'trip', priceTier: 2, distanceKm: 35, vibeTags: ['неспешно', 'вид'], vibeReason: 'Кофе на веранде с видом на поля — выходной без плана.', photoPlaceholder: 'trip' },
]

export function getPlaceById(id: string): Place | undefined {
  return MOCK_PLACES.find((p) => p.id === id)
}

// "₽" × tier.
export function priceLabel(tier: PriceTier): string {
  return '₽'.repeat(tier)
}

// Catalog-card meta line: "₽₽ · 0.4 км · уютно, негромко" (§15.2). Distances ≥ 10 км drop the
// decimal to read as a trip, not a walk.
export function placeMeta(p: Place): string {
  const dist = p.distanceKm >= 10 ? `${Math.round(p.distanceKm)} км` : `${p.distanceKm} км`
  return `${priceLabel(p.priceTier)} · ${dist} · ${p.vibeTags.join(', ')}`
}
