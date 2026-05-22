'use server'

import { redirect } from 'next/navigation'
import { createRouteClient } from '@/lib/supabase/server'
import { ANSWER_KEYS, type AnswerKey } from '@/lib/supabase/enums'
import { nextDestination } from '@/lib/onboarding/steps'

// Server action for the 20Q flow. questionId + step are bound server-side in the
// page (.bind) — the client can't forge which question or position it answers;
// only answer_key arrives via FormData, so it is the one value validated here.
// Upserts the answer (onConflict covers both a first answer and a back-edit),
// then redirects forward: the next step, or completion after the final question.
export async function submitAnswer(questionId: string, step: number, formData: FormData) {
  const raw = formData.get('answer_key')
  if (typeof raw !== 'string' || !ANSWER_KEYS.includes(raw as AnswerKey)) {
    throw new Error(`submitAnswer: invalid answer_key ${JSON.stringify(raw)}`)
  }
  const answerKey = raw as AnswerKey

  const supabase = createRouteClient()

  // Re-derive the user server-side — never trust the client for identity.
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .schema('vibemap')
    .from('user_answers')
    .upsert(
      { user_id: user.id, question_id: questionId, answer_key: answerKey },
      { onConflict: 'user_id,question_id' },
    )
  if (error) throw error

  // redirect() throws NEXT_REDIRECT by design — keep it outside any try/catch.
  const dest = nextDestination(step)
  redirect(dest.kind === 'complete' ? '/onboarding/complete' : `/onboarding/${dest.step}`)
}
