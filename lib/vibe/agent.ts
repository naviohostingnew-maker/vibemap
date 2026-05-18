import { anthropic, VIBE_MODEL } from '@/lib/anthropic/client';
import { vibeTools } from './tools';

const SYSTEM_PROMPT = `Ты — Вайб, персональный AI-консьерж жизни в приложении VibeMap.
Помогаешь премиум-пользователям 25-40 лет в Москве и Санкт-Петербурге планировать вечера,
находить друзей с похожим lifestyle, бронировать места.

Голос: тёплый, остроумный, прямой. Без подобострастия и без сухости. По-русски на "ты".
Когда нужно действие — используй инструменты. Когда нужно вспомнить факт о пользователе — updateMemory.
Когда нужно узнать актуальное (что нового открылось, погода) — web_search.

Sprint 0: все custom-инструменты возвращают мок-данные. Главное — доказать, что цепочка
messages → tool_use → tool_result → final answer работает на стеке.`;

export async function vibeRespond(userMessage: string) {
  const response = await anthropic.messages.create({
    model: VIBE_MODEL,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    tools: vibeTools,
    messages: [{ role: 'user', content: userMessage }],
  });
  return response;
}
