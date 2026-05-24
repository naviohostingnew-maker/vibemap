'use client'

interface RevealFailedProps {
  onRetry: () => void
}

// Shown when a Reveal generation attempt fails (parse/LLM/API error). Gives the
// user one clear action — retry — which re-triggers generation. Presentational;
// the retry handler lives in <RevealGenerating>.
export function RevealFailed({ onRetry }: RevealFailedProps) {
  return (
    <div
      className="w-full max-w-md rounded-card border border-white bg-glass-bg-strong p-7 text-center lg:max-w-lg lg:p-9"
      style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
    >
      <h1 className="font-display text-[1.75rem] leading-[1.1] text-ink">
        Volly не собрал профиль с первого раза
      </h1>
      <p className="mt-3 font-body text-[15px] leading-[1.55] text-ink-70">
        Иногда так бывает — давай попробуем ещё раз.
      </p>
      <button type="button" onClick={onRetry} className="cta-pill mt-7 block w-full text-center">
        Попробовать ещё раз
      </button>
    </div>
  )
}
