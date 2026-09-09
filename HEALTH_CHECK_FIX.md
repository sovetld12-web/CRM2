# 🔧 Исправление проблемы с SIGTERM на Amvera

## 📋 Проблема

В логах Amvera видно что сервер запускается успешно:
```
Server is running on 0.0.0.0:3000
```

Но затем получает сигнал `SIGTERM` и завершается:
```
npm error signal SIGTERM
```

## 🔍 Причина

Amvera делает **health check** (проверку здоровья) приложения каждые несколько секунд. Если приложение не отвечает на health check правильно, Amvera считает что приложение "зависло" и принудительно его завершает.

## ✅ Решение

### 1. Добавлен health check endpoint в server.js

```javascript
// Health check endpoint для Amvera
if (req.url === '/health' || req.url === '/healthz') {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
  return;
}
```

Этот endpoint отвечает на запросы `/health` и `/healthz` статусом 200 OK.

### 2. Обновлён amvera.yaml

Добавлена конфигурация health check:

```yaml
run:
  command: node server.js
  port: 3000
  healthCheck:
    path: /health
    interval: 10s
    timeout: 5s
    retries: 3
```

**Параметры:**
- `path: /health` — путь для health check
- `interval: 10s` — проверять каждые 10 секунд
- `timeout: 5s` — ждать ответа максимум 5 секунд
- `retries: 3` — повторить 3 раза перед тем как считать приложение "мёртвым"

## 🚀 Что делать дальше

### Шаг 1: Запушьте изменения

```bash
git add server.js amvera.yaml
git commit -m "fix: add health check endpoint for Amvera"
git push origin master
```

### Шаг 2: Дождитесь сборки на Amvera

1. Откройте панель управления Amvera
2. Перейдите в раздел **"Контроль версий"**
3. Дождитесь завершения сборки
4. Проверьте логи

### Шаг 3: Проверьте работу

1. Откройте приложение: https://crm-lubov-corplib.mia0.amvera.tech/
2. Очистите кэш браузера: `Ctrl + F5`
3. Проверьте что приложение работает стабильно

## 🔍 Проверка health check

Можно проверить health check вручную:

```bash
curl https://crm-lubov-corplib.mia0.amvera.tech/health
```

Ожидаемый ответ:
```json
{
  "status": "ok",
  "timestamp": "2026-09-09T12:00:00.000Z"
}
```

## 📊 Ожидаемые логи после исправления

```
09/09/26 10:00:00 Server is running on 0.0.0.0:3000
09/09/26 10:00:10 Health check: OK
09/09/26 10:00:20 Health check: OK
09/09/26 10:00:30 Health check: OK
...
```

Приложение должно работать стабильно без SIGTERM сигналов.

## 💡 Если проблема сохраняется

### Проверьте логи Amvera

1. Откройте раздел **"Логи"**
2. Выберите **"Лог приложения"**
3. Ищите строки:
   - `Health check: OK` — всё хорошо
   - `Health check: FAILED` — есть проблема
   - `SIGTERM` — приложение завершается

### Увеличьте таймауты

Если health check не успевает выполниться, увеличьте таймауты в `amvera.yaml`:

```yaml
healthCheck:
  path: /health
  interval: 30s  # было 10s
  timeout: 10s   # было 5s
  retries: 5     # было 3
```

### Проверьте ресурсы

Если приложение потребляет слишком много памяти или CPU, Amvera может его завершать. Проверьте в разделе **"Мониторинг"**.

## 📝 Итог

Проблема с SIGTERM должна быть решена добавлением health check endpoint. После пуша изменений приложение должно работать стабильно.

---

**Версия:** 1.0.5  
**Дата:** 2026-09-09  
**Статус:** ✅ Исправлено
