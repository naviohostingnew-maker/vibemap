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

// The Reveal card — third wow-moment. Renders the ready vibe-profile over the
// Aurora mesh: archetype hero image (Ф2=C static asset), gradient vibe_title,
// summary, trait chips, and Volly's note. Structurally complete on Aurora tokens;
// final visual polish lands in D.2.C. Server component (no interactivity).
export function RevealCard({ vibeTitle, vibeSummary, traits, vollyNote, archetype }: RevealCardProps) {
  const meta = ARCHETYPES.find((a) => a.slug === archetype)

  return (
    <div
      className="w-full max-w-md rounded-card border border-white bg-glass-bg-strong p-7 lg:max-w-lg lg:p-9"
      style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
    >
      {meta && (
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-portrait">
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
        <p className="mt-5 font-body text-[11px] uppercase leading-[1.3] tracking-[0.04em] text-ink-50">
          {meta.name}
        </p>
      )}

      <h1 className="mt-1 font-display text-[2.5rem] leading-[1.05] text-ink">
        <span className="accent-word">{vibeTitle}</span>
      </h1>

      <p className="mt-4 font-body text-[16px] leading-[1.55] text-ink-70">{vibeSummary}</p>

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

      <p className="mt-5 font-display text-[15px] italic leading-[1.5] text-rose-deep">{vollyNote}</p>

      <Link href="/feed" className="cta-pill mt-7 block w-full text-center">
        Дальше
      </Link>
    </div>
  )
}
