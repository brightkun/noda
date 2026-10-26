# Noda

Веб-ассистент для ученика и программиста: заметки в markdown со ссылками `[[другая заметка]]` как в Obsidian, граф связей, вопросы для повторения от AI и интервальное повторение карточек.

## Возможности

- Заметки в markdown. Связи `[[Название]]` и теги `#react` разбираются из текста автоматически.
- Граф связей между заметками с фильтром по тегу.
- Кнопка «Сгенерировать вопросы»: AI составляет 3–5 вопросов с эталонными ответами по тексту заметки.
- Экран «Повторить сегодня»: вы отвечаете своими словами, AI оценивает ответ от 0 до 5 по тексту заметки, следующий показ карточки планируется по лесенке 1 → 3 → 7 дней.
- Тёмная и светлая темы.

Пока без регистрации и входа: все запросы идут от одного демо-пользователя.

## Стек

- **Клиент:** Next.js (App Router), React, TypeScript, Tailwind, shadcn/ui, React Query, Zustand, React Hook Form + zod, `react-markdown`, `react-force-graph-2d`. Архитектура FSD.
- **Сервер:** Node.js, Express 5, TypeScript, PostgreSQL (`pg`, чистый SQL), zod.
- **AI:** [omniroute](https://github.com/diegosouzapw/OmniRoute), OpenAI-совместимый шлюз. Вызывается только с сервера, ключ в браузер не попадает. Ответ модели всегда проходит проверку zod.

## Запуск

Нужны Node.js 20.12 или новее (сервер использует `process.loadEnvFile`) и PostgreSQL.

### 1. База данных

Создайте базу в кодировке UTF-8 (иначе кириллица в заметках не сохранится):

```sql
create database noda encoding 'UTF8' template template0;
```

### 2. Сервер

```bash
cd server
cp .env.example .env     # заполните DB_PASSWORD и, для AI, OMNIROUTE_*
npm install
npm run db:init          # создаёт таблицы
npm run db:seed          # демо-пользователь и заметки из seed-notes/
npm run dev              # http://localhost:5000
```

Переменные `server/.env`:

| Переменная | Назначение |
|---|---|
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | подключение к PostgreSQL |
| `OMNIROUTE_API_KEY` | ключ шлюза omniroute |
| `OMNIROUTE_MODEL` | модель, например `gemini/gemini-3.1-flash-lite` |
| `OMNIROUTE_BASE_URL` | по умолчанию `http://localhost:20128/v1` |

Без `OMNIROUTE_*` всё работает, кроме генерации вопросов и оценки ответов. Совет: закрепляйте конкретную модель. Значение `auto` перебирает провайдеров и бывает медленным.

### 3. Клиент

```bash
cd client
npm install
npm run dev              # разработка, http://localhost:3000
# или для показа:
npm run build && npm start
```

Клиент проксирует `/api/*` на сервер (`next.config.ts`), поэтому CORS не нужен. Другой адрес сервера: переменная `API_URL`.

## Структура

```
client/
  app/            маршруты Next
  pages/          пустая папка: Next не должен принять src/pages за Pages Router
  src/            слои FSD: shared, entities, features, widgets, pages
server/
  db/schema.sql
  src/            route -> controller -> service
seed-notes/       демо-заметки (название заметки = имя файла)
```

## API

Префикс `/api`, все запросы относятся к демо-пользователю.

| Метод | Путь | Что делает |
|---|---|---|
| GET | `/notes`, `/notes/:id` | список с тегами; заметка с исходящими и входящими ссылками |
| POST, PUT, DELETE | `/notes`, `/notes/:id` | создать, изменить, удалить |
| GET | `/graph?tag=` | `{ nodes, links }` в формате `react-force-graph` |
| GET | `/tags` | теги с числом заметок |
| POST | `/notes/:id/questions` | AI создаёт карточки по заметке |
| GET | `/review/today` | карточки, срок которых наступил |
| POST | `/cards/:id/answer` | `{ answer }` → `{ score, feedback, correctAnswer, nextDueAt }` |
