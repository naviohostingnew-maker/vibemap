import { redirect, notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { ensureUserProvisioned } from '@/lib/supabase/provisioning'
import { resolveStep, TOTAL_QUESTIONS } from '@/lib/onboarding/steps'

type AnswerOption = { key: string; label: string }

// Dynamic 20Q onboarding route. C.1 scope: auth + provision gate, step-access
// guard (resume + manual-URL protection), question fetch. Rendering is a bare
// placeholder on purpose — real Aurora styling lands in C.2 (after tokens sync).
export default async function OnboardingStepPage({
  params,
}: {
  params: { step: string }
}) {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Safety net — every vibemap table FKs to vibemap.users.id.
  await ensureUserProvisioned(supabase, user)

  // Early-gate: onboarding already finished for this user — the flow is closed.
  const { data: userRow } = await supabase
    .schema('vibemap')
    .from('users')
    .select('onboarding_completed_at')
    .eq('id', user.id)
    .single()
  if (userRow?.onboarding_completed_at) redirect('/feed')

  // How many questions this user has answered (RLS scopes the count to them).
  const { count } = await supabase
    .schema('vibemap')
    .from('user_answers')
    .select('*', { count: 'exact', head: true })
  const answeredCount = count ?? 0

  const resolution = resolveStep(answeredCount, Number(params.step))
  if (resolution.kind === 'complete') redirect('/onboarding/complete')
  if (resolution.kind === 'redirect') redirect(`/onboarding/${resolution.step}`)

  // resolution.kind === 'render'
  const { data: question } = await supabase
    .schema('vibemap')
    .from('questions')
    .select('id, order_num, category, text, accent_word, options')
    .eq('order_num', resolution.step)
    .single()

  // Steps 1..20 are all seeded — a miss is a data-integrity fault, not a 404 route.
  if (!question) notFound()

  const options = question.options as AnswerOption[]

  // Placeholder markup — no Aurora styling yet (C.2 guardrail). Proves the data
  // flow: gate -> guard -> fetch -> render the right question for the step.
  return (
    <main>
      <p>
        {resolution.step} / {TOTAL_QUESTIONS}
      </p>
      <h1>{question.text}</h1>
      <ul>
        {options.map((opt) => (
          <li key={opt.key}>
            {opt.key}. {opt.label}
          </li>
        ))}
      </ul>
    </main>
  )
}
