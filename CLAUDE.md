# CLAUDE.md — Chpok project instructions

ВАЖНО: этот файл — короткая рабочая памятка для Claude Code. Следуй ему в каждой сессии.

## 1. Project context

Чпок — civic-tech сервис для фиксации городских нарушений: самокаты, курьеры, каршеринг, такси и автомобили. Пользователь создаёт жалобу/инцидент: фото, категория, сервис/провайдер, описание, геолокация. Админка показывает и модерирует обращения.

Текущая главная задача: довести MVP голосового описания и транскрибации инцидента до рабочего состояния.

Рабочая ветка для транскрибации: `feature/draft-report-transcription`.
Не начинай работу с `main`, если задача касается транскрибации: в `main` нет последней попытки этой фичи.

## 2. Repository layout

- `artifacts/app` — Expo React Native mobile app.
- `artifacts/app/app/new-report.tsx` — основной flow создания жалобы.
- `artifacts/app/lib/voice-notes.ts` — загрузка voice notes и вызов Edge Function.
- `artifacts/api-server` — Express API server.
- `artifacts/api-server/src/routes/reports.ts` — API reports/admin reports.
- `lib/db/src/schema` — Drizzle DB schema.
- `lib/api-spec/openapi.yaml` — OpenAPI contract.
- `lib/api-zod` и `lib/api-client-react` — generated API/types.
- `supabase/migrations` — Supabase SQL migrations.
- `supabase/functions/transcribe-incident/index.ts` — Edge Function for transcription.

## 3. Current transcription target

MVP считается готовым, когда:

1. Пользователь может создать жалобу без голоса, как раньше.
2. Пользователь может записать голосовое описание или выбрать аудиофайл.
3. Аудио загружается в Supabase Storage bucket `report-media`.
4. Вызывается Edge Function `transcribe-incident`.
5. Edge Function отправляет аудио в Fireworks Whisper.
6. Результат сохраняется в `reports`:
   - `voice_note_path`
   - `transcript_raw`
   - `transcript_clean`
   - `transcript_status`
   - `transcript_language`
   - `transcript_provider`
   - `transcript_error`
7. Если описание пустое, `transcript_clean` автоматически подставляется в `description`.
8. Если описание уже есть, пользователь может заменить описание транскриптом или добавить транскрипт ниже.
9. Админка показывает транскрипт, статус и ошибку транскрибации в деталях жалобы.
10. Permission denied для микрофона/камеры/фото не должен крашить приложение.

## 4. Work rules

ОБЯЗАТЕЛЬНО:

- Сначала анализируй текущий код, потом меняй.
- Делай маленькие изменения, не переписывай весь проект.
- Сохраняй существующий flow создания жалобы.
- Проверяй обычный сценарий без аудио после любых изменений.
- Не коммить реальные ключи, токены, URLs продакшн-секретов.
- Используй только `pnpm`. Не используй npm/yarn.
- Не удаляй и не отключай `minimumReleaseAge` в `pnpm-workspace.yaml`.
- Если меняешь `openapi.yaml`, проверь, нужно ли обновить generated clients/types.
- После изменения API/types запускай codegen из `lib/api-spec`, если это применимо.

НЕ ДЕЛАЙ:

- Не переписывай `new-report.tsx` с нуля без крайней необходимости.
- Не меняй названия таблиц/полей транскрибации без причины.
- Не добавляй новый transcription provider, пока используется Fireworks.
- Не ломай загрузку фото ради загрузки аудио.
- Не делай публичным bucket `report-media`.
- Не обходи RLS/storage policies через client-side service role key.

## 5. Common commands

Install:

```bash
pnpm install
```

Root typecheck:

```bash
pnpm run typecheck
```

Build all available packages/apps:

```bash
pnpm run build
```

API codegen after OpenAPI changes:

```bash
pnpm --filter @workspace/api-spec run codegen
```

Mobile app typecheck:

```bash
pnpm --filter @workspace/app run typecheck
```

## 6. Required env variables

Do not invent real values. Use `.env.example` as reference.

Server / Supabase / Edge Function likely needs:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `FIREWORKS_API_KEY`

Mobile app likely needs:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_API_BASE_URL` or `EXPO_PUBLIC_API_HOST` / `EXPO_PUBLIC_DOMAIN`

## 7. Known traps

- Branch trap: transcription work is in `feature/draft-report-transcription`, not `main`.
- Package manager trap: project blocks npm/yarn via `preinstall`; use pnpm only.
- Security trap: never expose `SUPABASE_SERVICE_ROLE_KEY` in mobile app.
- Storage trap: voice notes should stay in private `report-media`; use authenticated policies or signed URLs, not public bucket.
- Auth trap: Edge Function must verify the authenticated user owns the report and the `storagePath` prefix.
- Draft report trap: voice transcription may create/update a draft report; avoid duplicate reports and avoid increasing user points twice for one final complaint.
- Permission trap: iOS/Android microphone/camera/photo denial must show a message, not crash.
- UX trap: audio/transcription errors should not block submitting a text-only complaint.
- Admin trap: if API returns transcript fields but admin UI does not show them, the feature looks broken even when backend works.
- Codegen trap: changing OpenAPI without regenerating clients causes mismatched TypeScript types.

## 8. Manual test checklist

Before calling the task done, describe results for:

1. Create complaint without voice.
2. Create complaint with recorded voice.
3. Create complaint with picked audio file.
4. Deny microphone permission and confirm no crash.
5. Confirm audio object appears in `report-media` under `voice-notes/...`.
6. Confirm Edge Function returns transcript or a clear error.
7. Confirm `reports` has `transcript_status`, `transcript_clean`, and `voice_note_path`.
8. Confirm admin report detail shows transcript/status/error.

## 9. Response format after each work session

Always finish with:

- What changed
- Files changed
- Commands run and results
- What still does not work
- Next recommended step

Самое важное: двигайся маленькими безопасными шагами и не ломай обычную отправку жалобы без голоса.
