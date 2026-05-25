// VollyChip — Volly's three semantic chips (aurora-tokens §16). All three sit in the r-pill
// family but run smaller than §5 buttons.
//   • seed     — Volly's filter starter / suggestion ("район", "удиви меня"). Tap-target: a tap
//                drops the word into the Volly query (composer wired in a later session). §16.1
//   • category — catalog section switcher, exactly one selected at a time (aria-pressed). §16.2
//   • trait    — read-only person trait ("спокойный темп"). Not a control — a <span>. §16.3
// Skin is strictly from aurora-tokens (accent-tint / rose-deep / glass-bg / ink scale).

type VollyChipKind = 'seed' | 'category' | 'trait'

export function VollyChip({
  kind,
  label,
  selected = false,
  onClick,
}: {
  kind: VollyChipKind
  label: string
  selected?: boolean
  onClick?: () => void
}) {
  // §16.3 trait — read-only marker, never a control.
  if (kind === 'trait') {
    return (
      <span className="inline-flex rounded-[12px] border border-ink-30 bg-glass-bg px-[9px] py-[4px] font-body text-[11px] text-ink-70">
        {label}
      </span>
    )
  }

  // §16.1 seed — accent-tint pill, rose-deep micro text, no border; a tap-target.
  if (kind === 'seed') {
    return (
      <button
        type="button"
        onClick={onClick}
        className="inline-flex rounded-[13px] bg-accent-tint px-[10px] py-[5px] font-body text-[11px] text-rose-deep transition-transform active:scale-95"
        style={{ letterSpacing: '0.02em' }}
      >
        {label}
      </button>
    )
  }

  // §16.2 category — idle outlined / selected solid accent. Selection = aria-pressed.
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`inline-flex rounded-[14px] px-[11px] py-[6px] font-body text-[12px] transition-colors ${
        selected
          ? 'bg-accent-magenta font-medium text-white'
          : 'border border-ink-30 bg-glass-bg text-ink'
      }`}
    >
      {label}
    </button>
  )
}
