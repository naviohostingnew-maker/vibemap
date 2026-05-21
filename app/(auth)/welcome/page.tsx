import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { AuroraBackground } from '@/components/ui/AuroraBackground'
import { AccentWord } from '@/components/ui/AccentWord'

// First sight of Volly. Reached from auth callback when onboarding_completed_at IS NULL.
export default async function WelcomePage() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <AuroraBackground>
      <main className="flex min-h-screen items-center justify-center px-6 py-12">
        <div
          className="w-full max-w-md rounded-card border border-white p-8 text-center"
          style={{
            // raised alpha (tokens §4) for long-text readability over the mesh
            background: '#ffffffd0',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          <h1 className="font-display text-5xl leading-none text-ink">
            <AccentWord text="Привет, я Volly." accent="Volly" />
          </h1>
          {/* USP axis — memory + fit. Copy frozen by scope, do not paraphrase. */}
          <p className="mt-6 font-body text-lg font-medium leading-relaxed text-ink-70">
            Чем больше я узнаю о тебе, тем точнее буду подсказывать вечера, людей и
            места, что попадают в точку.
          </p>
          <p className="mt-4 font-body text-base leading-relaxed text-ink-50">
            Начнём с 20 коротких вопросов — это займёт 3–4 минуты.
          </p>
          <Link href="/onboarding/1" className="cta-pill mt-8">
            Поехали
          </Link>
        </div>
      </main>
    </AuroraBackground>
  )
}
