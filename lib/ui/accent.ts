export interface AccentSplit {
  before: string
  match: string
  after: string
}

/**
 * Split `text` on the first case-sensitive occurrence of `accent`.
 *
 * Case-sensitivity is intentional: the 20Q seed stores `accent_word` with exact
 * casing (7 questions have a sentence-initial capitalised accent), so a loose
 * match would silently miss them. Returns null when `accent` is empty or absent
 * — callers then render the plain text without the gradient effect.
 */
export function splitAccent(text: string, accent: string): AccentSplit | null {
  if (!accent) return null
  const idx = text.indexOf(accent)
  if (idx === -1) return null
  return {
    before: text.slice(0, idx),
    match: accent,
    after: text.slice(idx + accent.length),
  }
}
