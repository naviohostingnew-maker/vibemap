import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { ensureUserProvisioned } from '@/lib/supabase/provisioning'
import { ARCHETYPES } from '@/lib/vibe/reveal/archetypes'
import { SignOutButton } from '@/components/auth/SignOutButton'

// /me — the profile screen. 1.3.3.B restructure (Fork 2 = restyle + restructure): besides
// the account section it now surfaces the user's vibe-identity — a durable mirror of the
// Reveal card (archetype mood-strip + name + vibe_title + summary + traits), MINUS the
// reveal-moment parts (no volly_note, no §9 "Volly speaks" block, no CTA): /me is a
// persistent reference surface, not the reveal moment. No hard gate beyond auth — the
// account/sign-out always render; the identity block shows an empty-state until a vibe
// profile is ready (a non-onboarded user can still reach /me to sign out).
export default async function MePage() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Safety net: ensure the vibemap.users row exists even if callback provisioning was skipped.
  await ensureUserProvisioned(supabase, user)

  // Vibe-identity — mirrors the Reveal read pattern, minus volly_note (excluded on /me).
  const { data: profile } = await supabase
    .schema('vibemap')
    .from('user_vibe_profile')
    .select('status, vibe_title, vibe_summary, traits, archetype')
    .eq('user_id', user.id)
    .maybeSingle()

  const ready =
    profile?.status === 'ready' && profile.vibe_title && profile.vibe_summary && profile.archetype
  const meta = ready ? ARCHETYPES.find((a) => a.slug === profile.archetype) : undefined
  const traits = (profile?.traits ?? []) as string[]
  // Fade the mood-strip's lower edge into the glass — no hard rectangle (tokens §10).
  const moodFade = 'linear-gradient(to bottom, #000 60%, transparent 100%)'

  return (
    <main className="mx-auto min-h-screen max-w-md px-[26px] pt-16">
      <h1 className="font-display text-4xl leading-none text-ink">Ваш профиль</h1>

      {ready ? (
        // Vibe-identity — durable mirror of RevealCard's top (no volly_note / §9 / CTA).
        <section
          className="mt-7 w-full rounded-card border border-white bg-glass-bg-strong p-7"
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
              />
            </div>
          )}
          {meta && (
            <p className="mt-4 font-body text-[11px] uppercase leading-[1.3] tracking-[0.04em] text-ink-50">
              {meta.name}
            </p>
          )}
          {/* vibe_title carries the single accent-gradient of the screen (§2/§10). */}
          <h2 className="mt-1 font-display text-[2rem] leading-[1.1] text-ink lg:text-[2.875rem] lg:leading-[1.05]">
            <span className="accent-word">{profile.vibe_title}</span>
          </h2>
          <p className="mt-4 font-body text-[16px] leading-[1.6] text-ink-70">{profile.vibe_summary}</p>
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
        </section>
      ) : (
        // No ready profile yet — a quiet, genderless prompt (no accent-gradient). /reveal
        // self-gates onward to onboarding if the 20Q isn't finished, so it's one entry point.
        <section className="mt-7 w-full rounded-card border border-white bg-glass-bg-strong p-7">
          <h2 className="font-display text-2xl leading-tight text-ink">Ваш вайб-портрет ещё впереди</h2>
          <p className="mt-2 font-body text-sm leading-relaxed text-ink-70">
            Volly соберёт его из ваших ответов.
          </p>
          <Link
            href="/reveal"
            className="mt-5 inline-block rounded-pill border border-ink-30 px-5 py-2 font-body text-sm text-ink-70 transition-colors hover:border-ink hover:text-ink"
          >
            Пройти знакомство
          </Link>
        </section>
      )}

      <div className="mt-6 rounded-card border border-white bg-glass-bg-strong p-6">
        <p className="font-body text-sm text-ink-50">Email</p>
        <p className="font-body text-ink">{user.email}</p>
      </div>
      <div className="mt-6">
        <SignOutButton />
      </div>
    </main>
  )
}
