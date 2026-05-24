import { AuroraBackground } from '@/components/ui/AuroraBackground'
import { BottomNav } from '@/components/ui/BottomNav'

// (app) shell — the authed surface (Лента / Я). Renders the Aurora mesh once for the
// whole group (the (auth) screens each render their own AuroraBackground; here it
// lives in the layout) plus the bottom nav. NO auth gate at the layout level
// (decision Fork C): gating stays per-page, because each route owns a different
// redirect contract (onboarding / vibe-profile guards differ per screen). Children
// get bottom padding so content clears the fixed ~64px nav + the iOS safe area.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuroraBackground>
      <div style={{ paddingBottom: 'calc(4rem + env(safe-area-inset-bottom))' }}>
        {children}
      </div>
      <BottomNav />
    </AuroraBackground>
  )
}
