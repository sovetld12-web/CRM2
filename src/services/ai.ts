import { SALES_ASSISTANT_PROMPT } from '../prompts/salesAssistant';
import { CHAT_ASSISTANT_PROMPT } from '../prompts/chatAssistant';

/**
 * Сервис для работы с OpenAI API.
 * API-ключ берётся из переменной окружения VITE_OPENAI_API_KEY
 */

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  success: boolean;
  content?: string;
  error?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export type AssistantMode = 'sales' | 'chat';

/**
 * Получить API-ключ из переменных окружения или localStorage
 * Примечание: API-ключ теперь на сервере, эта функция для обратной совместимости
 */
function getApiKey(): string {
  // API-ключ теперь на сервере, возвращаем заглушку
  return 'server-proxy';
}

/**
 * Сохранить API-ключ в localStorage
 * Примечание: API-ключ теперь на сервере, эта функция для обратной совместимости
 */
export function saveApiKey(key: string): void {
  console.log('API-ключ теперь настраивается на сервере Amvera через переменную OPENAI_API_KEY');
}

/**
 * Получить сохраненный API-ключ
 * Примечание: API-ключ теперь на сервере
 */
export function getSavedApiKey(): string | null {
  return null;
}

/**
 * Получить модель из переменных окружения (по умолчанию gpt-4o-mini)
 */
function getModel(): string {
  return import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini';
}

/**
 * Получить системный промпт в зависимости от режима
 */
function getSystemPrompt(mode: AssistantMode): string {
  switch (mode) {
    case 'sales':
      return SALES_ASSISTANT_PROMPT;
    case 'chat':
      return CHAT_ASSISTANT_PROMPT;
    default:
      return SALES_ASSISTANT_PROMPT;
  }
}

/**
 * Отправить запрос к OpenAI API
 * @param userMessage - сообщение пользователя
 * @param conversationHistory - история диалога
 * @param mode - режим работы ('sales' для конструктора ответов, 'chat' для свободного общения)
 */
export async function sendToOpenAI(
  userMessage: string,
  conversationHistory: AIMessage[] = [],
  mode: AssistantMode = 'sales'
): Promise<AIResponse> {
  try {
    const model = getModel();
    const systemPrompt = getSystemPrompt(mode);

    // Формируем массив сообщений
    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ];

    // Используем серверный прокси вместо прямого запроса к OpenAI
    const response = await fetch('/api/openai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `Ошибка API: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    return {
      success: true,
      content: data.choices[0]?.message?.content || '',
      usage: data.usage,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Проверить, настроен ли API-ключ
 * Примечание: API-ключ теперь на сервере, всегда возвращаем true
 */
export function isApiConfigured(): boolean {
  return true;
}

/**
 * Получить текущую модель
 */
export function getCurrentModel(): string {
  return getModel();
}
