// Pure step-access guard for the 20Q onboarding flow — no DB, no JSX, so it is
// unit-testable via node:test (relative import). The page layers auth/provision
// gates and the data fetch on top of this arithmetic.

export const TOTAL_QUESTIONS = 20

export type StepResolution =
  | { kind: 'render'; step: number }
  | { kind: 'redirect'; step: number }
  | { kind: 'complete' }

// Resolves what to do for a requested onboarding step.
//   answeredCount — questions this user has already answered (0..20+).
//   requestedStep — the [step] route param parsed to a number (may be invalid).
//
// Render window = 1 .. min(answeredCount + 1, TOTAL_QUESTIONS): the user may
// revisit any answered question (back-link) or land on the next unanswered one,
// but cannot skip ahead. Any out-of-range / non-integer input redirects to the
// resume step (next unanswered) — this also blocks manual URL tampering. Once
// every question is answered the flow is finished and hands off to completion.
export function resolveStep(answeredCount: number, requestedStep: number): StepResolution {
  // Defensive >= (not ==): treat any overflow as a finished flow.
  if (answeredCount >= TOTAL_QUESTIONS) return { kind: 'complete' }

  // Furthest viewable step — the next unanswered question.
  const resumeStep = Math.min(answeredCount + 1, TOTAL_QUESTIONS)

  const valid =
    Number.isInteger(requestedStep) && requestedStep >= 1 && requestedStep <= resumeStep

  return valid ? { kind: 'render', step: requestedStep } : { kind: 'redirect', step: resumeStep }
}
