'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles, User } from 'lucide-react'

// §11 Bottom navigation — the tab-bar of the (app) shell. This is CHROME, not a
// glass "card": full-bleed (edge-to-edge), hairline border on the TOP edge only,
// zero radius — see aurora-tokens §11. Fill/blur are §4 glass (strong #d0 so the
// labels read over the mesh). Two tabs only for v0.1.3 — Лента (the feed) and Я
// (profile); Login + full /me restyle land in 1.3.x, Discovery/Chat in Sprint 2,
// so no extra tabs here. Active tab is derived from the route (usePathname): ink +
// a ~5px pip; inactive is ink-30. Line icons at stroke 1.5 to match the inline-SVG
// line language of OptionList (Sparkles = AI-curated feed; NOT Compass, which reads
// as Discovery — a separate Sprint 2 mode).
const TABS = [
  { href: '/feed', label: 'Лента', Icon: Sparkles },
  { href: '/me', label: 'Я', Icon: User },
] as const

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Основная навигация"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-white bg-glass-bg-strong"
      style={{
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <ul className="mx-auto flex h-16 max-w-md items-stretch">
        {TABS.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`flex h-full flex-col items-center justify-center gap-1 text-[11px] transition-colors ${
                  active ? 'text-ink' : 'text-ink-30'
                }`}
              >
                <Icon size={22} strokeWidth={1.5} aria-hidden />
                <span className="leading-none">{label}</span>
                <span
                  aria-hidden
                  className={`mt-0.5 h-[5px] w-[5px] rounded-full ${active ? 'bg-ink' : 'bg-transparent'}`}
                />
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
