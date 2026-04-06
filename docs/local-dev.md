# Local Dev

## Backend against Supabase Postgres

Для текущего этапа у `ЧПОК` уже подтвержден рабочий runtime path без смены архитектуры:

- backend остается на `Express`
- database layer остается на `Drizzle + pg`
- подключение идет через `DATABASE_URL`
- для локального окружения рабочим оказался `session pooler`, а не direct host

### Что важно помнить

- Не вставляй реальный пароль БД в git, документацию или чат.
- `@workspace/api-server` сейчас не читает `.env` автоматически.
- Значит локальный env-файл можно хранить рядом с пакетом, но перед запуском его нужно явно `source`-нуть в shell.
- Для этого локального Node/pg окружения сработал `sslmode=no-verify`.
- Direct host вида `db.<project-ref>.supabase.co` локально уже давал `ENOTFOUND`, поэтому его не стоит считать основным локальным путем.

### Рекомендуемый локальный setup

1. Скопируй `artifacts/api-server/.env.example` в локальный файл `artifacts/api-server/.env.local`.
2. Подставь свой реальный пароль в `DATABASE_URL`.
3. Оставь host в формате session pooler и не убирай `?sslmode=no-verify`, пока это окружение не перестанет требовать его.
4. Экспортируй переменные в текущий shell и запусти backend.

Пример команд:

```sh
set -a
source artifacts/api-server/.env.local
set +a
pnpm --filter @workspace/api-server run dev
```

Альтернатива без файла:

```sh
DATABASE_URL='postgresql://postgres.PROJECT_REF:YOUR_DB_PASSWORD@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=no-verify' \
PORT=8080 \
pnpm --filter @workspace/api-server run dev
```

### Формат рабочего DATABASE_URL

Шаблон:

```text
postgresql://postgres.PROJECT_REF:YOUR_DB_PASSWORD@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=no-verify
```

Где:

- `PROJECT_REF` для текущего проекта: `tfppszsyrmfnewonnvlw`
- `YOUR_DB_PASSWORD` хранится только локально

### Media upload для dev/staging

Минимальный рабочий media flow в этом проекте использует отдельный backend upload route
и один public bucket в Supabase Storage. Это staging/dev compromise: он удобен для
локальной проверки и админского preview, но не является финальной production-схемой
доступа к медиа.

Нужные переменные для backend:

```text
SUPABASE_URL=https://tfppszsyrmfnewonnvlw.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
SUPABASE_STORAGE_BUCKET=report-media
```

### Admin guard для dev/staging

Минимальная защита админки в текущем спринте сделана как временный staging/dev guard:

- backend требует `x-admin-secret` только на `/api/admin/*`
- admin UI показывает небольшую форму входа и открывается только после ввода секрета
- секрет не вшивается в клиентский bundle и хранится только в `sessionStorage`

Нужные переменные:

```text
# backend
ADMIN_SECRET=replace-with-a-long-random-string

# admin
VITE_ADMIN_GUARD_ENABLED=true
VITE_ADMIN_GUARD_TITLE=CHPOK Admin
```

### Минимальная проверка после старта

После запуска backend имеет смысл повторить уже подтвержденные smoke-checks:

- `GET /api/healthz`
- `GET /api/providers`
- `GET /api/admin/reports`

Если параллельно поднят `admin`, его dev proxy уже может ходить на локальный API по `/api`.

### Что делать со smoke-данными

Текущие smoke-данные не мешают самому runtime path, но для чистоты ручных проверок лучше удалить их вручную, когда они перестанут быть нужны.

Практичное правило:

- оставить, если они нужны как стабильный тестовый fixture для ближайшего спринта
- удалить вручную, если начинаются путать ручную проверку списка жалоб, заметок или профиля пользователя

На текущем этапе я бы не завязывал документацию или код на существование этих smoke-данных.
