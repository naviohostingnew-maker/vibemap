'use client'

import { useFormStatus } from 'react-dom'

type AnswerOption = { key: string; label: string }

interface OptionListProps {
  options: AnswerOption[]
  // submitAnswer bound server-side to (questionId, step); form supplies answer_key.
  submitAction: (formData: FormData) => void | Promise<void>
  // The user's prior answer for this question (back-edit highlight); undefined = fresh.
  selectedKey?: string
}

// Decorative selected-state mark (tokens §5 selected, pending SOT patch). aria-hidden:
// selectedness lives in the button's aria-pressed, not in this glyph.
function CheckMark() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0"
    >
      <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// One option = one <form>, so useFormStatus scopes pending to the tapped button
// (React 18.3 has no reliable useFormStatus().data to disambiguate within a single
// form). Native per-button feedback, no client state, progressive enhancement intact.
function OptionButton({ opt, selected }: { opt: AnswerOption; selected: boolean }) {
  const { pending } = useFormStatus()
  const base =
    'flex w-full items-center justify-between gap-3 rounded-card border px-4 py-3.5 text-left font-body text-[14px] leading-[1.55] text-ink transition-colors'
  const state = selected
    ? 'border-ink bg-white'
    : 'border-ink-30 bg-white/50 hover:border-ink hover:bg-white/80'
  const busy = pending ? ' cursor-wait opacity-70' : ''

  return (
    <button
      type="submit"
      name="answer_key"
      value={opt.key}
      aria-pressed={selected}
      aria-busy={pending}
      disabled={pending}
      className={`${base} ${state}${busy}`}
    >
      <span>{opt.label}</span>
      {selected && <CheckMark />}
    </button>
  )
}

// Answer options for the 20Q card (client island). Tap submits instantly — the
// bound server action writes the answer (upsert) and redirects forward.
export function OptionList({ options, submitAction, selectedKey }: OptionListProps) {
  return (
    <ul className="mt-7 flex flex-col gap-[9px]">
      {options.map((opt) => (
        <li key={opt.key}>
          <form action={submitAction}>
            <OptionButton opt={opt} selected={opt.key === selectedKey} />
          </form>
        </li>
      ))}
    </ul>
  )
}
