'use client'

import { useState } from 'react'
import { Mic, Play, Sparkles } from 'lucide-react'
import { waveformHeights, durationLabel } from '@/lib/volly/waveform'
import { ResultCard, type ResultCategory } from '@/components/volly/ResultCard'

// VoiceBubble — a voice message in the Волли chat (aurora-tokens §14). Bubbles are chat
// CHROME, not §4 glass: NO backdrop-blur (there are dozens in a chat — the blur budget is
// §4's). User bubble = solid --accent-magenta; Volly bubble = --surface-volly (#ffffffcc),
// no blur. Voice is MOCKED: the waveform is deterministic by messageId (§14.3), durations are
// fake, the Volly play button is a stub. The transcript is HIDDEN, revealed by a tap (§14.4).
//
// DATA SHAPE (forward-compat — verified against the real-SpeechKit path): a message is
// { id, variant, transcript, durationSec, cards? }. The bubble derives waveform bars from the
// id and never touches audio. Real STT/TTS later fills transcript from recognition,
// durationSec from the clip, and adds an audio source — the bubble does not change.

export type VollyResultCardData = {
  id: string
  title: string
  meta: string
  category: ResultCategory
  actionLabel: string
}

export type VoiceMessage = {
  id: string
  variant: 'user' | 'volly'
  transcript: string
  durationSec: number
  cards?: VollyResultCardData[]
}

const USER_WAVE = 'rgba(255,255,255,0.7)' // §14.3
const VOLLY_WAVE = '#d4537e' // --accent-magenta

function Waveform({ messageId, color }: { messageId: string; color: string }) {
  return (
    <span className="flex items-center gap-[2px]" aria-hidden>
      {waveformHeights(messageId).map((h, i) => (
        <span
          key={i}
          style={{ width: 2, height: h, borderRadius: 1, backgroundColor: color }}
        />
      ))}
    </span>
  )
}

export function VoiceBubble({ message }: { message: VoiceMessage }) {
  const [open, setOpen] = useState(false)
  const isUser = message.variant === 'user'
  const dur = durationLabel(message.durationSec)

  // The waveform+duration is the tap-target that reveals the transcript (§14.4). The play
  // button (Volly) is a separate sibling so we never nest interactive controls.
  const toggle = (
    <button
      type="button"
      aria-expanded={open}
      aria-label={open ? 'Скрыть транскрипт' : 'Показать транскрипт'}
      onClick={() => setOpen((v) => !v)}
      className="flex items-center gap-2"
    >
      <Waveform messageId={message.id} color={isUser ? USER_WAVE : VOLLY_WAVE} />
      <span className={`text-[11px] ${isUser ? 'text-white/85' : 'text-ink-50'}`}>{dur}</span>
    </button>
  )

  if (isUser) {
    return (
      <div className="flex flex-col items-end">
        <div className="max-w-[80%] rounded-[14px_14px_4px_14px] bg-accent-magenta px-[13px] py-[9px] text-white">
          <div className="flex items-center gap-2">
            <Mic size={15} strokeWidth={1.5} className="shrink-0 text-white" aria-hidden />
            {toggle}
          </div>
          {open && (
            <p className="mt-1.5 font-body text-[13px] leading-[1.5] text-white">{message.transcript}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-2">
      {/* Volly avatar — §14.2 */}
      <span className="mt-0.5 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-accent-magenta">
        <Sparkles size={16} strokeWidth={1.5} className="text-white" aria-hidden />
      </span>
      <div className="max-w-[80%] rounded-[4px_14px_14px_14px] bg-surface-volly px-[13px] py-[9px]">
        <div className="flex items-center gap-2">
          {/* Play — stub (mock voice, §14.2) */}
          <button
            type="button"
            aria-label="Проиграть (заглушка)"
            className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-accent-magenta"
          >
            <Play size={12} strokeWidth={1.5} className="text-white" fill="currentColor" aria-hidden />
          </button>
          {toggle}
        </div>
        {open && (
          <p className="mt-1.5 font-body text-[13px] leading-[1.5] text-ink">{message.transcript}</p>
        )}
        {message.cards && message.cards.length > 0 && (
          <div className="mt-2.5 flex flex-col gap-2">
            {message.cards.map((c) => (
              <ResultCard
                key={c.id}
                title={c.title}
                meta={c.meta}
                category={c.category}
                actionLabel={c.actionLabel}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
