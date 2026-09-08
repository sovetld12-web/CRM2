import { useState, useRef, useEffect } from 'react';
import { sendToOpenAI, isApiConfigured, getCurrentModel, AIMessage, AssistantMode, saveApiKey, getSavedApiKey } from '../services/ai';
import { useData } from '../contexts/DataContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  loading?: boolean;
  error?: boolean;
}

interface ClientInfo {
  date: string;
  contact: string;
  company: string;
  phone: string;
  source: string;
  product: string;
  sum: number;
  project: string;
}

type TabMode = 'sales' | 'chat';

export default function AIAssistant() {
  const { addLead } = useData();
  const [activeTab, setActiveTab] = useState<TabMode>('chat');
  const [messages, setMessages] = useState<Record<TabMode, ChatMessage[]>>({
    sales: [],
    chat: [],
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Record<TabMode, AIMessage[]>>({
    sales: [],
    chat: [],
  });
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getSavedApiKey() || '');
  const [showClientForm, setShowClientForm] = useState(false);
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    date: new Date().toISOString().split('T')[0],
    contact: '',
    company: '',
    phone: '',
    source: 'Профи',
    product: 'Рекрутинг',
    sum: 0,
    project: '',
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const apiConfigured = isApiConfigured();
  const currentModel = getCurrentModel();
  const currentMessages = messages[activeTab];
  const currentHistory = conversationHistory[activeTab];

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      saveApiKey(apiKeyInput.trim());
      alert('API-ключ сохранен!');
      window.location.reload();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!apiConfigured) {
      setMessages((prev) => ({
        ...prev,
        [activeTab]: [
          ...prev[activeTab],
          {
            id: Date.now().toString(),
            role: 'assistant',
            content:
              '⚠️ API-ключ OpenAI не настроен. Добавьте переменную `VITE_OPENAI_API_KEY` в переменные окружения на Amvera.',
            timestamp: new Date(),
            error: true,
          },
        ],
      }));
      return;
    }

    // Автоматическое создание лида в конструкторе ответов
    if (activeTab === 'sales' && clientInfo.contact) {
      addLead({
        date: clientInfo.date,
        company: clientInfo.company,
        contact: clientInfo.contact,
        phone: clientInfo.phone,
        source: clientInfo.source,
        stage: 'Заявка',
        product: clientInfo.product,
        project: clientInfo.project,
        sum: clientInfo.sum,
        paid: 0,
        nextStep: '',
        nextStepDate: '',
        responsible: 'Любовь',
        comment: `Запрос клиента: ${input.trim().substring(0, 200)}...`,
      });
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => ({
      ...prev,
      [activeTab]: [...prev[activeTab], userMessage],
    }));
    setInput('');
    setIsLoading(true);

    const loadingId = (Date.now() + 1).toString();
    setMessages((prev) => ({
      ...prev,
      [activeTab]: [
        ...prev[activeTab],
        {
          id: loadingId,
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          loading: true,
        },
      ],
    }));

    try {
      const mode: AssistantMode = activeTab;
      const response = await sendToOpenAI(input.trim(), currentHistory, mode);

      setMessages((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].map((m) =>
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
        ),
      }));

      if (response.success) {
        setConversationHistory((prev) => ({
          ...prev,
          [activeTab]: [
            ...prev[activeTab],
            { role: 'user', content: input.trim() },
            { role: 'assistant', content: response.content || '' },
          ],
        }));
      }
    } catch (error) {
      setMessages((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].map((m) =>
          m.id === loadingId
            ? {
                ...m,
                content: `❌ Ошибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
                loading: false,
                error: true,
              }
            : m
        ),
      }));
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
    setMessages((prev) => ({ ...prev, [activeTab]: [] }));
    setConversationHistory((prev) => ({ ...prev, [activeTab]: [] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const extractAnswer = (content: string): string => {
    const match = content.match(/###\s*Готовый ответ клиенту\s*\n([\s\S]*?)(?=###|$)/i);
    return match ? match[1].trim() : content;
  };

  const tabs: { id: TabMode; label: string; icon: string; description: string }[] = [
    {
      id: 'chat',
      label: 'Чат с AI',
      icon: 'fas fa-comments',
      description: 'Свободное общение, советы, идеи, анализ',
    },
    {
      id: 'sales',
      label: 'Конструктор ответов',
      icon: 'fas fa-magic',
      description: 'Готовые ответы клиентам с площадок',
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <i className="fas fa-robot text-indigo-400"></i>
            AI-помощник
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {tabs.find((t) => t.id === activeTab)?.description}
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

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'text-indigo-400 border-indigo-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <i className={tab.icon}></i>
            {tab.label}
          </button>
        ))}
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
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Текущий режим</label>
              <p className="text-sm text-slate-300">
                {activeTab === 'chat' ? '💬 Свободный чат' : '✨ Конструктор ответов'}
              </p>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Сообщений в истории</label>
              <p className="text-sm text-slate-300">{currentHistory.length / 2 | 0}</p>
            </div>
            
            {/* API Key Input */}
            <div className="sm:col-span-2">
              <label className="text-xs text-slate-400 mb-1 block">API-ключ OpenAI</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="sk-..."
                  className="flex-1 bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                />
                <button
                  onClick={handleSaveApiKey}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Сохранить
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Получите ключ на <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">platform.openai.com</a>
              </p>
            </div>
            
            <div className="sm:col-span-2">
              <label className="text-xs text-slate-400 mb-1 block">Альтернативный способ настройки</label>
              <div className="text-xs text-slate-400 bg-slate-900/50 p-3 rounded-lg font-mono">
                <p># В переменных окружения Amvera добавьте:</p>
                <p className="text-indigo-300 mt-1">VITE_OPENAI_API_KEY=sk-...</p>
                <p className="text-indigo-300">VITE_OPENAI_MODEL=gpt-4o-mini</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Client Info Form for Sales Tab */}
      {activeTab === 'sales' && (
        <div className="glass-card p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <i className="fas fa-user-plus text-indigo-400"></i>
              Информация о клиенте
            </h3>
            <button
              onClick={() => setShowClientForm(!showClientForm)}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {showClientForm ? 'Скрыть форму' : 'Показать форму'}
            </button>
          </div>
          
          {showClientForm && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Дата обращения</label>
                <input
                  type="date"
                  value={clientInfo.date}
                  onChange={(e) => setClientInfo({ ...clientInfo, date: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Имя контакта *</label>
                <input
                  type="text"
                  value={clientInfo.contact}
                  onChange={(e) => setClientInfo({ ...clientInfo, contact: e.target.value })}
                  placeholder="Иван Иванов"
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Компания</label>
                <input
                  type="text"
                  value={clientInfo.company}
                  onChange={(e) => setClientInfo({ ...clientInfo, company: e.target.value })}
                  placeholder="ООО Пример"
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Телефон / ник</label>
                <input
                  type="text"
                  value={clientInfo.phone}
                  onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                  placeholder="+7 999 123-45-67"
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Источник</label>
                <select
                  value={clientInfo.source}
                  onChange={(e) => setClientInfo({ ...clientInfo, source: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50"
                >
                  <option value="Профи">Профи</option>
                  <option value="Авито">Авито</option>
                  <option value="hh.ru">hh.ru</option>
                  <option value="Рекомендация">Рекомендация</option>
                  <option value="Другое">Другое</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Продукт</label>
                <select
                  value={clientInfo.product}
                  onChange={(e) => setClientInfo({ ...clientInfo, product: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50"
                >
                  <option value="Рекрутинг">Рекрутинг</option>
                  <option value="Консалтинг">Консалтинг</option>
                  <option value="Абонентка">Абонентка</option>
                  <option value="KPI">KPI</option>
                  <option value="Адаптация">Адаптация</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Сумма / чек (₽)</label>
                <input
                  type="number"
                  value={clientInfo.sum}
                  onChange={(e) => setClientInfo({ ...clientInfo, sum: Number(e.target.value) })}
                  placeholder="50000"
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Проект / вакансия</label>
                <input
                  type="text"
                  value={clientInfo.project}
                  onChange={(e) => setClientInfo({ ...clientInfo, project: e.target.value })}
                  placeholder="Менеджер по продажам"
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>
          )}
          
          {!showClientForm && clientInfo.contact && (
            <div className="text-xs text-slate-400">
              <i className="fas fa-check-circle text-emerald-400 mr-1"></i>
              Клиент: <span className="text-white">{clientInfo.contact}</span>
              {clientInfo.company && <span className="ml-2">({clientInfo.company})</span>}
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto glass-card p-4 space-y-4">
        {currentMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            {activeTab === 'chat' ? (
              <>
                <i className="fas fa-comments text-4xl text-indigo-400/30 mb-4"></i>
                <h3 className="text-lg font-medium text-slate-300 mb-2">Чат с AI-советником</h3>
                <p className="text-sm text-slate-500 max-w-md mb-6">
                  Задавайте любые вопросы: по бизнесу, HR, продажам, стратегиям.
                  AI поможет подумать, проанализировать, найти идеи.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl w-full">
                  <button
                    onClick={() =>
                      setInput('Помоги разобраться: у меня 5 зависших вакансий по 30+ дней. Как принять решение по каждой?')
                    }
                    className="text-left p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-indigo-500/30 transition-all text-xs text-slate-400"
                  >
                    💼 Разбор зависших вакансий
                  </button>
                  <button
                    onClick={() =>
                      setInput('Как выстроить систему работы со спящей базой клиентов?')
                    }
                    className="text-left p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-indigo-500/30 transition-all text-xs text-slate-400"
                  >
                    🔄 Работа со спящей базой
                  </button>
                  <button
                    onClick={() =>
                      setInput('Какие метрики стоит отслеживать для оценки эффективности рекрутингового агентства?')
                    }
                    className="text-left p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-indigo-500/30 transition-all text-xs text-slate-400"
                  >
                    📊 Метрики агентства
                  </button>
                  <button
                    onClick={() =>
                      setInput('Нужно придумать контент-план на неделю для Telegram-канала по HR')
                    }
                    className="text-left p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-indigo-500/30 transition-all text-xs text-slate-400"
                  >
                    📝 Контент-план
                  </button>
                  <button
                    onClick={() =>
                      setInput('Клиент говорит "дорого". Как отработать возражение?')
                    }
                    className="text-left p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-indigo-500/30 transition-all text-xs text-slate-400"
                  >
                    💰 Работа с возражениями
                  </button>
                  <button
                    onClick={() =>
                      setInput('Подумай вместе со мной: стоит ли мне нанимать первого сотрудника в команду?')
                    }
                    className="text-left p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-indigo-500/30 transition-all text-xs text-slate-400"
                  >
                    🤔 Стратегические вопросы
                  </button>
                </div>
              </>
            ) : (
              <>
                <i className="fas fa-magic text-4xl text-indigo-400/30 mb-4"></i>
                <h3 className="text-lg font-medium text-slate-300 mb-2">Конструктор ответов</h3>
                <p className="text-sm text-slate-500 max-w-md mb-6">
                  Вставьте запрос клиента с Profi.ru, Avito, hh.ru или любой другой площадки.
                  AI проанализирует его и подготовит готовый ответ.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl w-full">
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
                    💼 Пример: вакансия в штат
                  </button>
                  <button
                    onClick={() =>
                      setInput(
                        'Клиент с hh.ru: "Нужно построить отдел продаж с нуля. Подобрать РОПа и 5 менеджеров. Разработать мотивацию и KPI."'
                      )
                    }
                    className="text-left p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-indigo-500/30 transition-all text-xs text-slate-400"
                  >
                    🏗️ Пример: комплексный проект
                  </button>
                  <button
                    onClick={() =>
                      setInput(
                        'Клиент в Telegram: "Сколько стоит подобрать главного бухгалтера? И какие гарантии?"'
                      )
                    }
                    className="text-left p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-indigo-500/30 transition-all text-xs text-slate-400"
                  >
                    💰 Пример: вопрос о цене
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {currentMessages.map((msg) => (
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
                  <span className="text-xs text-slate-400">
                    {activeTab === 'chat' ? 'AI думает...' : 'AI анализирует запрос...'}
                  </span>
                </div>
              ) : (
                <>
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                  {msg.role === 'assistant' && !msg.error && (
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-700/30">
                      {activeTab === 'sales' && (
                        <button
                          onClick={() => copyToClipboard(extractAnswer(msg.content))}
                          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                        >
                          <i className="fas fa-copy"></i>
                          Копировать ответ
                        </button>
                      )}
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
            placeholder={
              activeTab === 'chat'
                ? 'Задайте вопрос или опишите ситуацию...'
                : 'Вставьте запрос клиента или опишите ситуацию...'
            }
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
            {activeTab === 'chat' ? '💬 Чат' : '✨ Конструктор'} · {currentModel} ·{' '}
            {apiConfigured ? '🟢 API подключен' : '🔴 API не настроен'}
          </p>
        </div>
      </div>
    </div>
  );
}
