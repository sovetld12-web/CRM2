# 🧹 Очистка неиспользуемых зависимостей

## 📋 Проблема

В логах Amvera были предупреждения:

```
npm warn EBADENGINE Unsupported engine
  package: '@supabase/supabase-js@2.112.3'
  required: { node: '>=22.0.0' }
  current: { node: 'v20.20.2' }
```

**Причина:** Supabase требует Node.js 22+, но на Amvera используется Node.js 20.

## ✅ Решение

Удалены **неиспользуемые зависимости** из `package.json`:

### Удалённые зависимости:

**dependencies:**
- ❌ `@supabase/supabase-js` — не используется в коде
- ❌ `canvas-confetti` — не используется
- ❌ `date-fns` — не используется
- ❌ `framer-motion` — не используется
- ❌ `lucide-react` — не используется
- ❌ `react-router-dom` — не используется
- ❌ `uuid` — не используется

**devDependencies:**
- ❌ `@types/canvas-confetti` — не нужен
- ❌ `@types/uuid` — не нужен

### Оставленные зависимости:

**dependencies:**
- ✅ `@dnd-kit/core` — drag-and-drop
- ✅ `@dnd-kit/sortable` — сортировка
- ✅ `@dnd-kit/utilities` — утилиты
- ✅ `react` — React
- ✅ `react-dom` — React DOM
- ✅ `recharts` — графики

**devDependencies:**
- ✅ `@tailwindcss/vite` — Tailwind для Vite
- ✅ `@types/react` — типы React
- ✅ `@types/react-dom` — типы React DOM
- ✅ `@vitejs/plugin-react` — плагин React для Vite
- ✅ `tailwindcss` — Tailwind CSS
- ✅ `typescript` — TypeScript
- ✅ `vite` — Vite

## 🚀 Что делать дальше

### Шаг 1: Запушьте изменения

```bash
git add package.json package-lock.json
git commit -m "chore: remove unused dependencies"
git push origin master
```

### Шаг 2: Дождитесь сборки на Amvera

Проверьте логи — **НЕ должно быть** предупреждений о Supabase и Node.js.

**Ожидаемые логи:**
```
> vite v6.4.3 building for production...
✓ 682 modules transformed.
✓ built in 9.14s
```

**НЕ должно быть:**
```
❌ npm warn EBADENGINE Unsupported engine
❌ package: '@supabase/supabase-js@2.112.3'
```

### Шаг 3: Проверьте работу

1. Откройте приложение: https://crm-lubov-corplib.mia0.amvera.tech/
2. Очистите кэш: `Ctrl + F5`
3. Проверьте что всё работает

## 📊 Преимущества

### До очистки:
- ❌ Предупреждения о несовместимости Node.js
- ❌ Лишние 149 пакетов
- ❌ Медленная сборка
- ❌ Большой размер бандла

### После очистки:
- ✅ Нет предупреждений
- ✅ Меньше пакетов (только нужные)
- ✅ Быстрая сборка
- ✅ Меньший размер бандла
- ✅ Чище код

## 🔍 Проверка

После пуша проверьте логи Amvera:

**Должно быть:**
```
added 50 packages, and audited 51 packages in 5s
```

**НЕ должно быть:**
```
❌ npm warn EBADENGINE
❌ @supabase/supabase-js
```

## 💡 Если остались предупреждения

Если после очистки остались предупреждения о других пакетах:

1. Проверьте что пакет действительно не используется:
   ```bash
   grep -r "название_пакета" src/
   ```

2. Если не используется — удалите из `package.json`

3. Запушьте изменения

## 📝 Итог

Удаление неиспользуемых зависимостей:
- Убирает предупреждения о Node.js
- Ускоряет сборку
- Уменьшает размер бандла
- Делает код чище

---

**Версия:** 1.0.5  
**Дата:** 2026-09-09  
**Статус:** ✅ Готово к пушу
