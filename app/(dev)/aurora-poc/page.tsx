import { AuroraBackground } from '@/components/ui/AuroraBackground'
import { AccentWord } from '@/components/ui/AccentWord'

/**
 * DEV PoC for Aurora visuals (Sprint 1.2.B.2). Not linked from nav.
 * REMOVE in Sprint 1.2.B.3 cleanup together with public/dev-screenshots/.
 */
export default function AuroraPocPage() {
  return (
    <AuroraBackground>
      <main className="flex min-h-screen items-center justify-center p-7">
        <div
          className="w-full max-w-md rounded-card border border-white p-8"
          style={{
            background: '#ffffffb0',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          {/* (i) cyrillic + latin, latin accent mid-string */}
          <h1 className="font-display text-5xl leading-none text-ink">
            <AccentWord text="Привет, я Volly." accent="Volly" />
          </h1>
          {/* (ii) cyrillic sentence-initial accent (case-sensitive, index 0) */}
          <p className="mt-5 font-display text-3xl leading-tight text-ink">
            <AccentWord text="Близкие или незнакомцы" accent="Близкие" />
          </p>
          {/* (iii) mid-sentence accent */}
          <p className="mt-5 text-base leading-relaxed text-ink-70">
            <AccentWord text="20 коротких вопросов" accent="20 коротких" />
          </p>
        </div>
      </main>
    </AuroraBackground>
  )
}
