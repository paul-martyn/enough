# Enough

Личный помощник (PWA). Первая функция — трекер задач. Дальше: идеи, финансы и т.д.

Данные хранятся **локально в браузере** (IndexedDB через Dexie), архитектура —
local-first и готова к будущей облачной синхронизации.

## Стек

- **Vite + React + TypeScript**
- **Dexie.js** — хранилище (IndexedDB)
- **React Router** (HashRouter — совместим с GitHub Pages)
- **Tailwind CSS** — стили
- **vite-plugin-pwa** — установка на телефон, офлайн, авто-обновление

## Разработка

```bash
npm install
npm run dev        # локальный сервер с hot-reload
```

Открой адрес из консоли (обычно http://localhost:5173/enough/).

## Сборка

```bash
npm run build      # проверка типов + production-сборка в dist/
npm run preview    # локальный предпросмотр собранной версии
```

## Иконки

Плейсхолдер-иконки генерируются скриптом:

```bash
node scripts/generate-icons.mjs
```

Замени файлы в `public/` на свои, когда захочешь.

## Деплой

Пуш в ветку `main` → GitHub Actions собирает и публикует на GitHub Pages
(`.github/workflows/deploy.yml`). Через ~1–2 минуты обновление доступно по адресу
`https://<username>.github.io/enough/`.

**Настройка (один раз):** в репозитории на GitHub → Settings → Pages →
Source: **GitHub Actions**.

> Имя репозитория `enough` зашито в `vite.config.ts` (`base`) и в `index.html`.
> Если переименуешь репозиторий — поменяй и там.

## Структура

```
src/
  db/database.ts            # Dexie: схема всех таблиц
  features/
    tasks/                  # трекер задач
      types.ts              # модель Task
      TaskRepository.ts     # единственная точка доступа к данным задач
      useTasks.ts           # реактивный список (liveQuery)
      TasksPage.tsx         # UI
  shared/                   # общие компоненты (навигация, заглушки)
  App.tsx                   # роутинг + мобильный каркас
```

**Правило:** UI обращается к данным только через `*Repository`, никогда напрямую
к Dexie. Так добавление облачной синхронизации не затронет интерфейс.
