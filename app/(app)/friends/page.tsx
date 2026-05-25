// /friends — stub for the v0.2 nav-shell (1.A.2). Real screens (Знакомства person-cards §18,
// Друзья list, segment toggle §19) land in Pillar 2 — see claude_state task "P2 · Социальный
// граф". Bottom padding clears the fixed nav via (app)/layout.
export default function FriendsPage() {
  return (
    <main className="px-[26px] pt-16">
      <h1 className="font-display text-[24px] leading-[1.1] text-ink">Друзья</h1>
      <p className="mt-2 text-[14px] leading-[1.55] text-ink-50">Здесь будут твои друзья и знакомства.</p>
    </main>
  )
}
