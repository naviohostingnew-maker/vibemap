import { CatalogView } from '@/components/catalog/CatalogView'

// /catalog (2.A) — overview + Волли-as-filter over a curated mock dataset [🎭]. The interactive
// body (section chips, ask-bar, seed filter, list) lives in the client CatalogView; this server
// page is the route entry. Bottom padding clears the fixed nav via (app)/layout. Replaces the
// 1.A.2 stub; route unchanged.
export default function CatalogPage() {
  return <CatalogView />
}
