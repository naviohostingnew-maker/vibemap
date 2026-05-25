// /volly — stub for the v0.2 nav-shell (1.A.2). The Волли chat screen (chat header §14.5,
// voice bubbles §14, in-chat result cards §15.1 — voice MOCKED) lands in checkpoint 1.B.
// Bottom padding clears the fixed nav via (app)/layout.
export default function VollyPage() {
  return (
    <main className="px-[26px] pt-16">
      <h1 className="font-display text-[24px] leading-[1.1] text-ink">Волли</h1>
      <p className="mt-2 text-[14px] leading-[1.55] text-ink-50">Чат с Волли скоро откроется.</p>
    </main>
  )
}
