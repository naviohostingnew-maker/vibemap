import Image from 'next/image'
import Link from 'next/link'
import { ARCHETYPES } from '@/lib/vibe/reveal/archetypes'
import type { ArchetypeSlug } from '@/lib/vibe/reveal/parse'

interface RevealCardProps {
  vibeTitle: string
  vibeSummary: string
  traits: string[]
  vollyNote: string
  archetype: ArchetypeSlug
}

// The Reveal card — third wow-moment. Read top-to-bottom as a gift (D.2.C variant A,
// single column both viewports): the archetype image is a restrained MOOD strip
// (constrained height + fade so it melts into the glass, never dominates); the TEXT
// carries the wow — gradient vibe_title (display-xl §2), summary, trait chips, and
// Volly's note as a named reply (brand-dot + wordmark, §6/§9). Server component.
export function RevealCard({ vibeTitle, vibeSummary, traits, vollyNote, archetype }: RevealCardProps) {
  const meta = ARCHETYPES.find((a) => a.slug === archetype)
  // Fade the strip's lower edge into the glass — no hard rectangle (tokens §10).
  const moodFade = 'linear-gradient(to bottom, #000 60%, transparent 100%)'

  return (
    <div
      className="w-full max-w-md rounded-card border border-white bg-glass-bg-strong p-7 lg:max-w-lg lg:p-9"
      style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
    >
      {meta && (
        <div
          className="relative h-40 w-full overflow-hidden rounded-portrait lg:h-52"
          style={{ maskImage: moodFade, WebkitMaskImage: moodFade }}
        >
          <Image
            src={meta.image}
            alt={meta.name}
            fill
            className="object-cover"
            sizes="(max-width: 512px) 90vw, 512px"
            priority
          />
        </div>
      )}

      {meta && (
        <p className="mt-4 font-body text-[11px] uppercase leading-[1.3] tracking-[0.04em] text-ink-50">
          {meta.name}
        </p>
      )}

      <h1 className="mt-1 font-display text-[2rem] leading-[1.1] text-ink lg:text-[2.875rem] lg:leading-[1.05]">
        <span className="accent-word">{vibeTitle}</span>
      </h1>

      <p className="mt-4 font-body text-[16px] leading-[1.6] text-ink-70">{vibeSummary}</p>

      {traits.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2">
          {traits.map((trait, i) => (
            <li
              key={i}
              className="rounded-pill border border-ink-30 px-3 py-1 font-body text-[13px] leading-[1.4] text-ink-70"
            >
              {trait}
            </li>
          ))}
        </ul>
      )}

      {/* Volly speaks — a reply from a named companion, not decorative copy (§9). */}
      <div className="mt-6 border-t border-ink-30 pt-5">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-block h-[9px] w-[9px] rounded-full"
            style={{ backgroundImage: 'linear-gradient(110deg, var(--accent-magenta), var(--accent-orange))' }}
          />
          <span className="font-display text-[15px] italic leading-none text-ink">Volly</span>
        </div>
        <p className="mt-2 font-display text-[15px] italic leading-[1.5] text-rose-deep">{vollyNote}</p>
      </div>

      <Link href="/feed" className="cta-pill mt-7 block w-full text-center">
        Дальше
      </Link>
    </div>
  )
}
