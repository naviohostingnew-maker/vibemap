type AnswerOption = { key: string; label: string }

// Presentational answer options for the 20Q card. Buttons render their true
// (enabled) look — interactivity (tap -> submitAnswer + redirect to step+1) is
// wired in C.3, where this file becomes a 'use client' island. No handlers here
// by design; not disabled either, so the C.2 screenshot shows the real card.
export function OptionList({ options }: { options: AnswerOption[] }) {
  return (
    <ul className="mt-7 flex flex-col gap-[9px]">
      {options.map((opt) => (
        <li key={opt.key}>
          <button
            type="button"
            className="w-full rounded-card border border-ink-30 bg-white/50 px-4 py-3.5 text-left font-body text-[14px] leading-[1.55] text-ink transition-colors hover:border-ink hover:bg-white/80"
          >
            {opt.label}
          </button>
        </li>
      ))}
    </ul>
  )
}
