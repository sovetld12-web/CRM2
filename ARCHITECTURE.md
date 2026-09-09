# Архитектура проекта

## 📁 Структура проекта

```
src/
├── components/          # Переиспользуемые компоненты
│   ├── Sidebar.tsx      # Боковое меню с drag-and-drop
│   ├── Modal.tsx        # Модальное окно
│   ├── Accordion.tsx    # Сворачиваемый блок
│   ├── LeadCard.tsx     # Карточка лида
│   ├── ProjectCard.tsx  # Карточка проекта
│   ├── ClientCard.tsx   # Карточка клиента
│   ├── MonthlyPlan.tsx  # План на месяц
│   ├── PlanFactForecast.tsx  # План-факт-прогноз
│   └── History.tsx      # История показателей
│
├── contexts/            # React Context API
│   ├── ThemeContext.tsx     # Тема (темная/светлая)
│   ├── DataContext.tsx      # Данные CRM (лиды, проекты, задачи)
│   └── PeriodContext.tsx    # Выбранный период (месяц/год)
│
├── pages/               # Страницы приложения
│   ├── Dashboard.tsx        # Центр управления
│   ├── Leads.tsx            # Лиды
│   ├── Production.tsx       # Производство
│   ├── Money.tsx            # Деньги
│   ├── Tasks.tsx            # Задачи
│   ├── Invoices.tsx         # Счета
│   ├── Expenses.tsx         # Затраты
│   ├── Bank.tsx             # Банк
│   ├── Marketing.tsx        # Маркетинг
│   ├── AIAssistant.tsx      # AI-помощник
│   ├── Documents.tsx        # Документы
│   ├── SleepingBase.tsx     # Спящая база
│   ├── DataManager.tsx      # Загрузка данных
│   └── Import.tsx           # Импорт данных
│
├── prompts/             # Системные промпты для AI
│   ├── salesAssistant.ts    # Промпт для конструктора ответов
│   └── chatAssistant.ts     # Промпт для чата с AI
│
├── services/            # Сервисы
│   └── ai.ts                # Сервис для работы с OpenAI API
│
├── App.tsx              # Главный компонент приложения
├── main.tsx             # Точка входа
├── index.css            # Глобальные стили
└── vite-env.d.ts        # TypeScript типы для Vite
```

---

## 🎯 Контексты (Context API)

### ThemeContext

Управляет темой приложения (темная/светлая).

**Хранение:** `localStorage` (ключ: `theme`)

**Использование:**
```tsx
const { theme, toggleTheme } = useTheme();
```

### DataContext

Управляет всеми данными CRM.

**Хранение:** `localStorage`

**Ключи:**
- `crm_leads` — лиды
- `crm_projects` — проекты
- `crm_tasks` — задачи
- `crm_money` — финансовые операции
- `crm_sleeping` — спящая база

**Использование:**
```tsx
const { 
  leads, 
  addLead, 
  updateLead, 
  deleteLead,
  projects,
  addProject,
  // ...
} = useData();
```

**Автоматические переходы:**
- При изменении статуса лида на "Договор заключен" или "Продажа" → автоматически создается проект
- При закрытии проекта → клиент автоматически добавляется в спящую базу
- При закрытии проекта → автоматически создается задача "Выставить счет и акт"

### PeriodContext

Управляет выбранным периодом (месяц/год) для фильтрации данных.

**Хранение:** `localStorage` (ключ: `crm_period`)

**Использование:**
```tsx
const { selectedMonth, selectedYear, setSelectedMonth, setSelectedYear } = usePeriod();
```

---

## 📊 Модели данных

### Lead (Лид)

```typescript
interface Lead {
  id: string;
  date: string;              // Дата создания
  company: string;           // Название компании
  contact: string;           // Имя контакта
  phone: string;             // Телефон / ник
  source: string;            // Источник (Аномалия, Профи.ру, ...)
  stage: string;             // Этап воронки
  product: string;           // Продукт (Рекрутинг, Консалтинг, ...)
  project: string;           // Проект / вакансия
  sum: number;               // Сумма сделки
  paid: number;              // Оплачено
  nextStep: string;          // Следующий шаг
  nextStepDate: string;      // Дата следующего шага
  responsible: string;       // Ответственный
  comment: string;           // Комментарий
  createdAt: string;         // Дата создания (ISO)
}
```

**Этапы воронки:**
- Новая заявка
- Заявка
- Связались
- Созвон
- Предложение
- Переговоры
- Договор
- Оплачено
- Отказ
- Отложено
- Спящая база

### Project (Проект)

```typescript
interface Project {
  id: string;
  client: string;            // Клиент
  vacancy: string;           // Вакансия / проект
  sum: number;               // Сумма проекта
  days: number;              // Дней в работе
  status: string;            // Статус (В работе, На паузе, Закрыт)
  startDate: string;         // Дата начала
  sourceLeadId?: string;     // ID исходного лида
  endDate?: string;          // Дата завершения
  responsible?: string;      // Ответственный
  contact?: string;          // Контакт
  phone?: string;            // Телефон
  firstCandidateDate?: string;  // Дата первого кандидата
  offerDate?: string;        // Дата оффера
  workStartDate?: string;    // Дата выхода на работу
  paid?: number;             // Оплачено
  directCosts?: number;      // Прямые затраты
  expectedPaymentDate?: string;  // Ожидаемая дата оплаты
  paymentProbability?: number;   // Вероятность оплаты (%)
  closingNorm?: number;      // Норматив закрытия (дни)
  comment?: string;          // Комментарий
  pauseReason?: string;      // Причина паузы
  pauseDate?: string;        // Дата паузы
}
```

### Task (Задача)

```typescript
interface Task {
  id: string;
  title: string;             // Название задачи
  priority: string;          // Приоритет (low, normal, high, critical)
  source: string;            // Источник (crm, ai, manual)
  dueDate: string;           // Срок выполнения
  done: boolean;             // Выполнена
  createdAt: string;         // Дата создания
}
```

### MoneyOperation (Финансовая операция)

```typescript
interface MoneyOperation {
  id: string;
  date: string;              // Дата операции
  type: string;              // Тип (income, expense)
  counterparty: string;      // Контрагент
  category: string;          // Категория
  paymentType: string;       // Вид оплаты
  sum: number;               // Сумма
  description: string;       // Описание
}
```

### SleepingClient (Клиент в спящей базе)

```typescript
interface SleepingClient {
  id: string;
  client: string;            // Название компании
  contact: string;           // Имя контакта
  phone: string;             // Телефон / ник
  source: string;            // Источник
  product: string;           // Продукт
  project: string;           // Проект
  ltv: number;               // LTV (пожизненная ценность)
  nextStep: string;          // Следующий шаг
  nextStepDate: string;      // Дата следующего шага
  lastContactDate: string;   // Дата последнего контакта
  comment: string;           // Комментарий
  createdAt: string;         // Дата создания
}
```

---

## 🔄 Бизнес-логика

### Автоматические переходы

#### 1. Лид → Проект

**Триггер:** Изменение статуса лида на "Договор заключен" или "Продажа"

**Действия:**
1. Создается новый проект в Production
2. Копируются данные из лида:
   - client = lead.company
   - vacancy = lead.project
   - sum = lead.sum
   - contact = lead.contact
   - phone = lead.phone
   - responsible = lead.responsible
   - comment = lead.comment
3. startDate = текущая дата
4. status = "В работе"

#### 2. Проект → Спящая база

**Триггер:** Закрытие проекта (status = "Закрыт")

**Действия:**
1. Проверяется, есть ли клиент уже в спящей базе
2. Если нет:
   - Создается новая запись в sleepingClients
   - ltv = сумма всех закрытых проектов этого клиента
   - lastContactDate = текущая дата
   - nextStep = "Повторное касание"
   - nextStepDate = текущая дата + 30 дней
3. Если есть:
   - Обновляется ltv (добавляется сумма нового проекта)
   - Обновляется lastContactDate
   - Добавляется комментарий о закрытии проекта

#### 3. Проект → Задача

**Триггер:** Закрытие проекта (status = "Закрыт")

**Действия:**
1. Создается новая задача
2. title = "Выставить счет и акт: {client} / {vacancy}"
3. priority = "critical"
4. dueDate = текущая дата
5. done = false

### Расчет LTV

**Формула:**
```
LTV = Сумма всех закрытых проектов клиента
```

**Пример:**
- Клиент "ООО Пример"
- Проект 1: 50,000 ₽ (закрыт)
- Проект 2: 70,000 ₽ (закрыт)
- Проект 3: 30,000 ₽ (в работе)
- **LTV = 120,000 ₽** (только закрытые проекты)

### Расчет дней без касания

**Формула:**
```
Дней без касания = Текущая дата - lastContactDate
```

**Цветовая индикация:**
- 🟢 До 30 дней — зеленый
- 🟡 31-60 дней — желтый
- 🔴 Более 60 дней — красный

### Расчет конверсии

**Формула:**
```
Конверсия = (Количество продаж / Количество лидов) × 100%
```

**Пример:**
- Лидов: 100
- Продаж: 10
- **Конверсия = 10%**

### Расчет маржи

**Формула:**
```
Маржа = ((Выручка - Прямые затраты) / Выручка) × 100%
```

**Пример:**
- Выручка: 100,000 ₽
- Прямые затраты: 30,000 ₽
- **Маржа = 70%**

---

## 🎨 Компоненты

### Sidebar

Боковое меню с drag-and-drop для изменения порядка вкладок.

**Особенности:**
- Использует `@dnd-kit` для drag-and-drop
- Порядок вкладок сохраняется в `localStorage`
- Подсветка важных вкладок (Загрузка данных)
- Мобильная версия с кнопкой меню

**Использование:**
```tsx
<Sidebar 
  currentPage={currentPage} 
  onPageChange={setCurrentPage}
  isOpen={sidebarOpen}
  onToggle={() => setSidebarOpen(!sidebarOpen)}
/>
```

### Accordion

Сворачиваемый блок для дашборда.

**Особенности:**
- Состояние (открыт/закрыт) сохраняется в `localStorage`
- Плавная анимация
- Иконка стрелки меняется при сворачивании

**Использование:**
```tsx
<Accordion 
  id="monthly-plan" 
  title="План на месяц" 
  subtitle="Плановые показатели и факт"
  defaultOpen={true}
>
  <MonthlyPlan />
</Accordion>
```

### LeadCard

Модальное окно с карточкой лида.

**Особенности:**
- Все поля из ТЗ
- Темная стилистика
- Кнопки "Сохранить" и "Новая запись"
- Валидация обязательных полей

**Использование:**
```tsx
<LeadCard
  lead={selectedLead}
  onClose={() => setSelectedLead(null)}
  onSave={(leadData) => updateLead(lead.id, leadData)}
  onNew={() => {}}
/>
```

---

## 🤖 AI-интеграция

### Структура

```
src/
├── prompts/
│   ├── salesAssistant.ts    # Системный промпт для конструктора
│   └── chatAssistant.ts     # Системный промпт для чата
└── services/
    └── ai.ts                # Сервис для работы с OpenAI API
```

### Системные промпты

**salesAssistant.ts** — промпт для конструктора ответов:
- Роль: HR-эксперт, рекрутер, HRBP
- Задача: помогать отвечать клиентам
- Цель: вывести клиента на созвон
- Формат ответа: анализ → готовый ответ → объяснение → следующий шаг

**chatAssistant.ts** — промпт для чата:
- Роль: AI-советник по бизнесу
- Задача: помогать думать, анализировать, находить идеи
- Стиль: профессиональный, уверенный, по-человечески

### Сервис AI

**Функции:**
- `sendToOpenAI(userMessage, history, mode)` — отправка запроса в OpenAI
- `saveApiKey(key)` — сохранение API-ключа в localStorage
- `getSavedApiKey()` — получение сохраненного ключа
- `isApiConfigured()` — проверка настройки API

**Использование:**
```tsx
const response = await sendToOpenAI(
  'Текст запроса клиента',
  conversationHistory,
  'sales' // или 'chat'
);

if (response.success) {
  console.log(response.content);
}
```

---

## 📊 Графики и инфографика

### Используемые библиотеки

**Recharts** — библиотека для создания графиков

**Типы графиков:**
- `AreaChart` — динамика выручки
- `BarChart` — лиды и сделки по месяцам
- `PieChart` — источники лидов
- Горизонтальные бары — воронка продаж

### Пример использования

```tsx
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

<AreaChart data={monthlyData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="month" />
  <YAxis />
  <Tooltip />
  <Area type="monotone" dataKey="выручка" stroke="#10b981" fill="#10b981" />
</AreaChart>
```

---

## 💾 Хранение данных

### localStorage

Все данные хранятся в localStorage браузера:

| Ключ | Описание |
|------|----------|
| `crm_leads` | Лиды |
| `crm_projects` | Проекты |
| `crm_tasks` | Задачи |
| `crm_money` | Финансовые операции |
| `crm_sleeping` | Спящая база |
| `crm_menu_order` | Порядок вкладок |
| `crm_period` | Выбранный период |
| `theme` | Тема (dark/light) |
| `openai_api_key` | API-ключ OpenAI |

### Ограничения

- **Размер:** ~5-10 MB (зависит от браузера)
- **Доступ:** только в рамках одного домена
- **Синхронизация:** нет (данные локальные)

**Рекомендация:** Регулярно делайте экспорт данных через вкладку "Загрузка данных".

---

## 🔒 Безопасность

### API-ключ OpenAI

**Проблема:** API-ключ виден в клиентском коде

**Решения:**

1. **Ввод через интерфейс** (текущий вариант)
   - Пользователь вводит ключ в настройках
   - Ключ сохраняется в localStorage
   - Ключ виден только пользователю

2. **Backend-прокси** (рекомендуется для продакшена)
   - Создать Node.js сервер
   - Хранить ключ только на сервере
   - Фронтенд обращается к серверу
   - Сервер пересылает запросы в OpenAI

### Данные пользователей

- Данные хранятся только в localStorage
- Данные не передаются на сервер
- Каждый пользователь видит только свои данные
- Данные привязаны к браузеру и устройству

---

## 🚀 Оптимизация

### Производительность

- ✅ Code splitting (динамические импорты)
- ✅ Lazy loading компонентов
- ✅ Минификация CSS и JS
- ✅ Оптимизация изображений
- ✅ Gzip сжатие

### Размер бандла

Текущий размер:
- `index.html`: ~2.4 KB
- `index.css`: ~51 KB (gzip: ~9 KB)
- `index.js`: ~836 KB (gzip: ~218 KB)

**Рекомендации:**
- Использовать dynamic imports для больших компонентов
- Разделить код на чанки
- Удалить неиспользуемые зависимости

---

**Версия документации:** 1.0  
**Дата обновления:** 2026-09-08
