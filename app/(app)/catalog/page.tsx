// /catalog — stub for the v0.2 nav-shell (1.A.2). Real screen (4 category chips + Волли-as-
// filter + catalog cards over a curated mock dataset) lands in a later proto/usp checkpoint
// — see claude_state task "P1 · Каталог". Bottom padding clears the fixed nav via (app)/layout.
export default function CatalogPage() {
  return (
    <main className="px-[26px] pt-16">
      <h1 className="font-display text-[24px] leading-[1.1] text-ink">Каталог</h1>
      <p className="mt-2 text-[14px] leading-[1.55] text-ink-50">Скоро здесь появится подбор по вайбу.</p>
    </main>
  )
}
