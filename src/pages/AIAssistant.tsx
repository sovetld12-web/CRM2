import { useState, useRef, useEffect } from 'react';
import { sendToOpenAI, isApiConfigured, getCurrentModel, AIMessage } from '../services/ai';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  loading?: boolean;
  error?: boolean;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<AIMessage[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const apiConfigured = isApiConfigured();
  const currentModel = getCurrentModel();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!apiConfigured) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content:
            '⚠️ API-ключ OpenAI не настроен. Добавьте переменную `VITE_OPENAI_API_KEY` в переменные окружения на Amvera.',
          timestamp: new Date(),
          error: true,
        },
      ]);
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Добавляем индикатор загрузки
    const loadingId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      {
        id: loadingId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        loading: true,
      },
    ]);

    try {
      const response = await sendToOpenAI(input.trim(), conversationHistory);

      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? {
                ...m,
                content: response.success
                  ? response.content || 'Пустой ответ'
                  : `❌ Ошибка: ${response.error}`,
                loading: false,
                error: !response.success,
              }
            : m
        )
      );

      if (response.success) {
        setConversationHistory((prev) => [
          ...prev,
          { role: 'user', content: input.trim() },
          { role: 'assistant', content: response.content || '' },
        ]);
      }
    } catch (error) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? {
                ...m,
                content: `❌ Ошибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
                loading: false,
                error: true,
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setConversationHistory([]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Извлекаем "Готовый ответ клиенту" из ответа AI
  const extractAnswer = (content: string): string => {
    const match = content.match(/###\s*Готовый ответ клиенту\s*\n([\s\S]*?)(?=###|$)/i);
    return match ? match[1].trim() : content;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <i className="fas fa-robot text-indigo-400"></i>
            AI-конструктор ответов
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Помогаю составлять ответы клиентам на Profi.ru, Avito, hh.ru и других площадках
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-3 py-2 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/30 transition-all"
          >
            <i className="fas fa-cog mr-1"></i>Настройки
          </button>
          <button
            onClick={clearConversation}
            className="px-3 py-2 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/50 border border-slate-700/50 hover:border-red-500/30 transition-all"
          >
            <i className="fas fa-trash mr-1"></i>Очистить
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="glass-card p-4 mb-4">
          <h3 className="text-sm font-semibold text-white mb-3">Настройки AI</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Статус API</label>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${apiConfigured ? 'bg-emerald-400' : 'bg-red-400'}`}
                ></span>
                <span className="text-sm text-slate-300">
                  {apiConfigured ? 'Подключено' : 'Не настроено'}
                </span>
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Модель</label>
              <p className="text-sm text-slate-300">{currentModel}</p>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-slate-400 mb-1 block">Как настроить</label>
              <div className="text-xs text-slate-400 bg-slate-900/50 p-3 rounded-lg font-mono">
                <p># В переменных окружения Amvera добавьте:</p>
                <p className="text-indigo-300 mt-1">VITE_OPENAI_API_KEY=sk-...</p>
                <p className="text-indigo-300">VITE_OPENAI_MODEL=gpt-4o-mini</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto glass-card p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <i className="fas fa-comments text-4xl text-indigo-400/30 mb-4"></i>
            <h3 className="text-lg font-medium text-slate-300 mb-2">Начните диалог</h3>
            <p className="text-sm text-slate-500 max-w-md">
              Вставьте запрос клиента с Profi.ru, Avito, hh.ru или любой другой площадки.
              AI проанализирует его и подготовит готовый ответ.
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg">
              <button
                onClick={() =>
                  setInput(
                    'Клиент с Profi.ru пишет: "Нужен рекрутер для подбора менеджеров по продажам. Бюджет 50 000. Срок — месяц."'
                  )
                }
                className="text-left p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-indigo-500/30 transition-all text-xs text-slate-400"
              >
                💬 Пример: запрос на подбор
              </button>
              <button
                onClick={() =>
                  setInput(
                    'Клиент с Avito: "Ищем HR-специалиста в штат, полный день, ведение кадров, подбор, адаптация."'
                  )
                }
                className="text-left p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-indigo-500/30 transition-all text-xs text-slate-400"
              >
                💬 Пример: вакансия в штат
              </button>
              <button
                onClick={() =>
                  setInput(
                    'Клиент с hh.ru: "Нужно построить отдел продаж с нуля. Подобрать РОПа и 5 менеджеров. Разработать мотивацию и KPI."'
                  )
                }
                className="text-left p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-indigo-500/30 transition-all text-xs text-slate-400"
              >
                💬 Пример: комплексный проект
              </button>
              <button
                onClick={() =>
                  setInput(
                    'Клиент в Telegram: "Сколько стоит подобрать главного бухгалтера? И какие гарантии?"'
                  )
                }
                className="text-left p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-indigo-500/30 transition-all text-xs text-slate-400"
              >
                💬 Пример: вопрос о цене
              </button>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-indigo-500/20 border border-indigo-500/30 text-white'
                  : msg.error
                  ? 'bg-red-500/10 border border-red-500/20 text-red-300'
                  : 'bg-slate-800/50 border border-slate-700/30 text-slate-200'
              }`}
            >
              {msg.loading ? (
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                    <span
                      className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></span>
                  </div>
                  <span className="text-xs text-slate-400">AI анализирует запрос...</span>
                </div>
              ) : (
                <>
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                  {msg.role === 'assistant' && !msg.error && (
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-700/30">
                      <button
                        onClick={() => copyToClipboard(extractAnswer(msg.content))}
                        className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                      >
                        <i className="fas fa-copy"></i>
                        Копировать ответ
                      </button>
                      <button
                        onClick={() => copyToClipboard(msg.content)}
                        className="text-xs text-slate-400 hover:text-slate-300 transition-colors flex items-center gap-1"
                      >
                        <i className="fas fa-clipboard"></i>
                        Копировать всё
                      </button>
                    </div>
                  )}
                </>
              )}
              <div className="text-[10px] text-slate-500 mt-2">
                {msg.timestamp.toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="mt-4 glass-card p-3">
        <div className="flex gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Вставьте запрос клиента или опишите ситуацию..."
            className="flex-1 bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 resize-none focus:outline-none focus:border-indigo-500/50 transition-colors"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="btn-primary self-end disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-[10px] text-slate-500">
            Enter — отправить · Shift+Enter — новая строка
          </p>
          <p className="text-[10px] text-slate-500">
            Модель: {currentModel} · {apiConfigured ? '🟢 API подключен' : '🔴 API не настроен'}
          </p>
        </div>
      </div>
    </div>
  );
}
