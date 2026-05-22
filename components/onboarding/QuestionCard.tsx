import Link from 'next/link'
import { AccentWord } from '@/components/ui/AccentWord'
import { OptionList } from '@/components/onboarding/OptionList'

type AnswerOption = { key: string; label: string }

interface QuestionCardProps {
  q: { text: string; accent_word: string; options: AnswerOption[] }
  step: number
  total: number
  // submitAnswer bound server-side to this question + step; forwarded to OptionList.
  submitAction: (formData: FormData) => void | Promise<void>
  // The user's prior answer for this question (back-edit highlight), if any.
  selectedKey?: string
}

// 20Q onboarding card (server component). Glass-strong (#d0, tokens §4 text-heavy)
// over the Aurora mesh. Shows position in the flow, the question as a gradient
// accent heading, the four options, and a back-link. Stays a server component:
// it forwards the bound submitAnswer action + selectedKey into OptionList (the
// client island wired in C.3).
export function QuestionCard({ q, step, total, submitAction, selectedKey }: QuestionCardProps) {
  // Bar + counter both track position in the flow (step/total), not answer count,
  // so a back-navigation to q3 reads "3 / 20" even when 20 are answered.
  const progress = Math.round((step / total) * 100)

  return (
    <div
      className="w-full max-w-md rounded-card border border-white bg-glass-bg-strong p-7"
      style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
    >
      <div className="flex items-center gap-3">
        <div className="h-1 flex-1 overflow-hidden rounded-pill bg-ink-30">
          <div
            className="h-full rounded-pill bg-ink-cta transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="font-body text-[13px] leading-[1.5] text-ink-50">
          {step} / {total}
        </span>
      </div>

      <h2 className="mt-6 font-display text-[2rem] leading-[1.08] text-ink">
        <AccentWord text={q.text} accent={q.accent_word} />
      </h2>

      <OptionList options={q.options} submitAction={submitAction} selectedKey={selectedKey} />

      {step > 1 && (
        <Link
          href={`/onboarding/${step - 1}`}
          className="mt-6 inline-block font-body text-[13px] leading-[1.5] text-ink-50 transition-colors hover:text-ink"
        >
          ← Назад
        </Link>
      )}
    </div>
  )
}
