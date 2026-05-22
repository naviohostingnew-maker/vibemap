import { redirect, notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { ensureUserProvisioned } from '@/lib/supabase/provisioning'
import { resolveStep, TOTAL_QUESTIONS } from '@/lib/onboarding/steps'
import { AuroraBackground } from '@/components/ui/AuroraBackground'
import { QuestionCard } from '@/components/onboarding/QuestionCard'
import { submitAnswer } from './actions'

type AnswerOption = { key: string; label: string }

// Dynamic 20Q onboarding route. Auth + provision gate, step-access guard
// (resume + manual-URL protection), question fetch, then the Aurora question
// card. Option interactivity (submitAnswer) is wired in C.3.
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

  // This user's answers (RLS scopes the rows to them). One read does double duty:
  // the count drives the step-access guard, and the matching row (found after we
  // know the question id) seeds the back-edit highlight — no extra round-trip.
  const { data: answers } = await supabase
    .schema('vibemap')
    .from('user_answers')
    .select('question_id, answer_key')
  const answeredCount = answers?.length ?? 0

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
  // Prior answer for this question (back-edit) — undefined on a fresh question.
  const selectedKey = answers?.find((a) => a.question_id === question.id)?.answer_key

  return (
    <AuroraBackground>
      <main className="flex min-h-screen items-center justify-center px-[26px] py-7">
        <QuestionCard
          q={{ text: question.text, accent_word: question.accent_word, options }}
          step={resolution.step}
          total={TOTAL_QUESTIONS}
          submitAction={submitAnswer.bind(null, question.id, resolution.step)}
          selectedKey={selectedKey}
        />
      </main>
    </AuroraBackground>
  )
}
