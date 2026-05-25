// Deterministic waveform heights for a voice bubble (aurora-tokens §14.3). MOCK voice: the
// bar heights are a STABLE pseudo-random function of the messageId, so they don't shift
// between re-renders.
//
// FORWARD-COMPAT (the load-bearing bit): VoiceBubble consumes a `number[]` of bar heights and
// does NOT care how they were produced. When real Yandex SpeechKit lands, this generator is
// replaced by an amplitude down-sample of the recording into the same `number[]` — the bubble,
// the message model, and every screen using them need no change. The mock is not a dead end.

const MIN_H = 5 // §14.3 — bars vary 5–18px
const MAX_H = 18
const MIN_BARS = 8 // §14.3 — 8–12 bars, fixed per message
const BAR_SPREAD = 5 // 8 + (0..4) = 8..12

// FNV-1a string hash → a deterministic 32-bit seed from the messageId.
function seedFrom(messageId: string): number {
  let h = 2166136261
  for (let i = 0; i < messageId.length; i++) {
    h ^= messageId.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// Stable bar heights (px) for a message. Same messageId → same array, every render.
export function waveformHeights(messageId: string): number[] {
  let s = seedFrom(messageId)
  const count = MIN_BARS + (s % BAR_SPREAD)
  const span = MAX_H - MIN_H + 1
  const heights: number[] = []
  for (let i = 0; i < count; i++) {
    // xorshift32 step — spreads consecutive bars without an external RNG.
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    s >>>= 0
    heights.push(MIN_H + (s % span))
  }
  return heights
}

// Fake duration → "M:SS" label (§14.1/§14.2). Real audio later supplies the seconds; the
// formatter is unchanged.
export function durationLabel(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = Math.floor(totalSeconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}
