import type { Tool } from '@anthropic-ai/sdk/resources/messages';

export const vibeCustomTools: Tool[] = [
  {
    name: 'searchEvents',
    description: 'Поиск событий в городе: концерты, спектакли, стендап, лекции, экскурсии. Sprint 0: мок-данные.',
    input_schema: {
      type: 'object',
      properties: {
        city: { type: 'string', description: 'Город на русском' },
        category: { type: 'string', enum: ['concert', 'standup', 'theatre', 'lecture', 'tour', 'any'] },
        date_from: { type: 'string', description: 'ISO date' },
        budget_max_rub: { type: 'number' },
      },
      required: ['city'],
    },
  },
  {
    name: 'searchRestaurants',
    description: 'Поиск ресторанов по городу, кухне и бюджету. Sprint 0: мок.',
    input_schema: {
      type: 'object',
      properties: {
        city: { type: 'string' },
        cuisine: { type: 'string' },
        budget_max_rub: { type: 'number' },
        time: { type: 'string', description: 'HH:mm' },
      },
      required: ['city'],
    },
  },
  {
    name: 'updateMemory',
    description: 'Сохранить факт о пользователе в долгосрочную память Вайба. Sprint 0: мок (логирует в консоль).',
    input_schema: {
      type: 'object',
      properties: {
        memory_type: { type: 'string', enum: ['episodic', 'semantic', 'procedural', 'social'] },
        content: { type: 'string' },
        importance: { type: 'number', description: '1-10' },
      },
      required: ['memory_type', 'content'],
    },
  },
  {
    name: 'inviteFriend',
    description: 'Отправить другу приглашение на событие/ресторан. Sprint 0: мок.',
    input_schema: {
      type: 'object',
      properties: {
        friend_user_id: { type: 'string' },
        booking_id: { type: 'string' },
        message: { type: 'string' },
      },
      required: ['friend_user_id', 'booking_id'],
    },
  },
];

export const webSearchTool = {
  type: 'web_search_20250305' as const,
  name: 'web_search',
  max_uses: 3,
};

export const vibeTools = [...vibeCustomTools, webSearchTool] as any;
