import { Sparkles, Pencil } from 'lucide-react'
import { VoiceBubble, type VoiceMessage } from '@/components/volly/VoiceBubble'
import { VollyChip } from '@/components/volly/VollyChip'

// /volly — the Волли chat (1.B). Chat header §14.5 + a feed of voice bubbles §14 with in-chat
// result cards §15.1; voice is MOCKED (§14.3/§14.4 — deterministic waveform by id, tap-to-
// reveal transcript, stub play). This replaces the 1.A.2 stub; the route is unchanged. Real
// SpeechKit is a separate discovery session (fork B) — not touched here.
//
// Mock dialog is plain serializable data (category is a string key, not an icon component) so
// it can cross the server→client boundary into VoiceBubble cleanly.
const MOCK_DIALOG: VoiceMessage[] = [
  {
    id: 'm1-user-friday',
    variant: 'user',
    transcript: 'Хочу в пятницу вечером куда-нибудь спокойное, недалеко от центра.',
    durationSec: 5,
  },
  {
    id: 'm2-volly-quiet-places',
    variant: 'volly',
    transcript: 'Собрала три тихих места под твой пятничный вечер. Загляни — кажется, тебе зайдёт.',
    durationSec: 7,
    cards: [
      {
        id: 'c1-courtyard',
        title: 'Тихий дворик',
        meta: 'Винный бар · Патрики · 0.8 км',
        category: 'bar',
        actionLabel: 'Забронировать',
      },
      {
        id: 'c2-tea',
        title: 'Чайная «Промежуток»',
        meta: 'Чайная · Китай-город · 1.2 км',
        category: 'cafe',
        actionLabel: 'Открыть',
      },
    ],
  },
]

// Volly's follow-up suggestions — seed chips (§16.1). Tap-targets that will drop the word into
// the composer; the composer is wired in a later session, so they are no-ops for now.
const SUGGESTIONS = ['ещё спокойнее', 'ближе к центру', 'удиви меня']

export default function VollyPage() {
  return (
    <main>
      {/* Chat header §14.5 */}
      <header className="flex items-center justify-between border-b border-ink-30 px-[18px] py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-accent-magenta">
            <Sparkles size={15} strokeWidth={1.5} className="text-white" aria-hidden />
          </span>
          <span className="font-display text-[17px] font-medium text-ink">Волли</span>
        </div>
        <button type="button" aria-label="Новый чат" className="text-ink-50 transition-colors active:text-ink">
          <Pencil size={18} strokeWidth={1.5} aria-hidden />
        </button>
      </header>

      {/* Bubble feed */}
      <div className="flex flex-col gap-4 px-[18px] py-4">
        {MOCK_DIALOG.map((m) => (
          <VoiceBubble key={m.id} message={m} />
        ))}

        {/* Seed-chip suggestions, aligned under Volly's bubble (past the 30px avatar + gap). */}
        <div className="flex flex-wrap gap-2 pl-[38px]">
          {SUGGESTIONS.map((s) => (
            <VollyChip key={s} kind="seed" label={s} />
          ))}
        </div>
      </div>
    </main>
  )
}
