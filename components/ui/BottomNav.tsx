'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Newspaper, Compass, Sparkles, Users, User } from 'lucide-react'

// §12 Bottom navigation v0.2 (proto/usp) — the tab-bar of the (app) shell. CHROME, not a
// glass "card": full-bleed (edge-to-edge), hairline border on the TOP edge only, zero
// radius, fill/blur are §4 glass-strong (#d0 so labels read over the mesh) — geometry is
// UNCHANGED from §11. What changes for v0.2: five tabs (Лента/Каталог/Волли/Друзья/Я) and a
// raised accent center tab. Icon set is REASSIGNED vs §11 on purpose (§12): Каталог IS the
// discovery surface so it takes Compass; Sparkles (the cross-product AI mark) moves to the
// центр-вкладка Волли; Лента takes Newspaper. Active tab is derived from the route
// (usePathname): ink + a ~5px accent-gradient pip above the icon; inactive is ink-30 with a
// transparent pip (keeps icons aligned). The center tab is visually always accent; its
// active-state reads through the label (ink/500 vs ink-30), like the others.
const ACCENT_PIP = 'linear-gradient(110deg, #d4537e, #ef9f27)'

const TABS = [
  { href: '/feed', label: 'Лента', Icon: Newspaper },
  { href: '/catalog', label: 'Каталог', Icon: Compass },
  { href: '/friends', label: 'Друзья', Icon: Users },
  { href: '/me', label: 'Я', Icon: User },
] as const

const VOLLY_HREF = '/volly'

export function BottomNav() {
  const pathname = usePathname()
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  // Build the five slots left→right with Волли in the middle (index 2 of 5).
  const left = TABS.slice(0, 2)
  const right = TABS.slice(2)
  const vollyActive = isActive(VOLLY_HREF)

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
        {left.map((tab) => (
          <RegularTab key={tab.href} {...tab} active={isActive(tab.href)} />
        ))}

        {/* Center tab Волли — raised accent circle (§12). 52×52 solid accent-magenta,
            white Sparkles 26px, 3px white ring, margin-top -24px so it pokes above the bar. */}
        <li className="flex-1">
          <Link
            href={VOLLY_HREF}
            aria-current={vollyActive ? 'page' : undefined}
            className="flex h-full flex-col items-center justify-center gap-1"
          >
            <span
              aria-hidden
              className="-mt-6 flex h-[52px] w-[52px] items-center justify-center rounded-full border-[3px] border-white bg-accent-magenta"
            >
              <Sparkles size={26} strokeWidth={1.5} className="text-white" aria-hidden />
            </span>
            <span
              className={`text-[11px] leading-none ${
                vollyActive ? 'font-medium text-ink' : 'text-ink-30'
              }`}
            >
              Volly
            </span>
          </Link>
        </li>

        {right.map((tab) => (
          <RegularTab key={tab.href} {...tab} active={isActive(tab.href)} />
        ))}
      </ul>
    </nav>
  )
}

function RegularTab({
  href,
  label,
  Icon,
  active,
}: {
  href: string
  label: string
  Icon: typeof Newspaper
  active: boolean
}) {
  return (
    <li className="flex-1">
      <Link
        href={href}
        aria-current={active ? 'page' : undefined}
        className={`flex h-full flex-col items-center justify-center gap-1 text-[11px] transition-colors ${
          active ? 'text-ink' : 'text-ink-30'
        }`}
      >
        <span
          aria-hidden
          className="h-[5px] w-[5px] rounded-full"
          style={active ? { backgroundImage: ACCENT_PIP } : undefined}
        />
        <Icon size={22} strokeWidth={1.5} aria-hidden />
        <span className="leading-none">{label}</span>
      </Link>
    </li>
  )
}
