import { AuroraBackground } from '@/components/ui/AuroraBackground'
import { LoginForm } from '@/components/auth/LoginForm'

// /login — magic-link entry. 1.3.3.A Aurora restyle: was a dark zinc card; now a §4
// glass card on the Aurora mesh. Mirrors welcome/reveal — each (auth) page renders its
// own AuroraBackground (there is no shared (auth)/layout). A §6 brand-mark heads the
// card. The auth flow (signInWithOtp + PKCE) is untouched — this is a visual pass.
export default function LoginPage() {
  return (
    <AuroraBackground>
      <main className="flex min-h-screen items-center justify-center px-6 py-12">
        <div
          className="w-full max-w-md rounded-card border border-white bg-glass-bg-strong p-8"
          style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
        >
          {/* Brand-mark (§6): accent-gradient dot + Playfair italic wordmark, cap V upright. */}
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block h-[9px] w-[9px] rounded-full"
              style={{ backgroundImage: 'linear-gradient(110deg, var(--accent-magenta), var(--accent-orange))' }}
            />
            <span className="font-display text-[22px] italic leading-none tracking-[-0.02em] text-ink">
              <span className="not-italic">V</span>ibeMap
            </span>
          </div>

          <h1 className="mt-6 font-display text-3xl leading-none text-ink">Вход</h1>
          <p className="mt-2 font-body text-sm text-ink-70">
            Получите ссылку на почту — мы откроем вас Вайбу
          </p>

          <LoginForm />
        </div>
      </main>
    </AuroraBackground>
  )
}
