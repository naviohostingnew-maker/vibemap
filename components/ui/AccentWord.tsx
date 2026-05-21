import { splitAccent } from '@/lib/ui/accent'

interface AccentWordProps {
  text: string
  accent: string
}

/**
 * Renders `text` with the first case-sensitive occurrence of `accent` styled as
 * a gradient italic display word (`.accent-word`, see globals.css §Aurora).
 * Falls back to plain text — plus a dev-only warning — when `accent` is not
 * found, so a copy/seed mismatch is loud in development but never breaks render.
 */
export function AccentWord({ text, accent }: AccentWordProps) {
  const parts = splitAccent(text, accent)

  if (!parts) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[AccentWord] accent "${accent}" not found in text "${text}"`)
    }
    return <span>{text}</span>
  }

  return (
    <span>
      {parts.before}
      <em className="accent-word">{parts.match}</em>
      {parts.after}
    </span>
  )
}
