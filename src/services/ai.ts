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
 * Получить API-ключ из переменных окружения
 */
function getApiKey(): string {
  const key = import.meta.env.VITE_OPENAI_API_KEY;
  if (!key) {
    throw new Error(
      'API-ключ OpenAI не найден. Добавьте VITE_OPENAI_API_KEY в переменные окружения.'
    );
  }
  return key;
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
    const apiKey = getApiKey();
    const model = getModel();
    const systemPrompt = getSystemPrompt(mode);

    // Формируем массив сообщений
    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ];

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: mode === 'chat' ? 0.7 : 0.6,
        max_tokens: 2000,
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
 */
export function isApiConfigured(): boolean {
  return !!import.meta.env.VITE_OPENAI_API_KEY;
}

/**
 * Получить текущую модель
 */
export function getCurrentModel(): string {
  return getModel();
}
