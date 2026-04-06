# Drizzle to Supabase Public Schema

## Current state
- Target project URL: `https://tfppszsyrmfnewonnvlw.supabase.co`
- `public` schema is empty.
- `auth` and `storage` contain only standard Supabase objects.
- `storage.buckets` is empty.
- Current backend already uses Postgres via `DATABASE_URL` in `lib/db/src/index.ts` and `lib/db/drizzle.config.ts`.

## Recommended migration path
Prefer reviewed SQL over `drizzle-kit push` for the first deploy.

Why:
- The target `public` schema is empty, so the SQL is straightforward to review.
- The repo currently uses schema sync, not versioned SQL migrations.
- A reviewed SQL file is safer for the first production-like deployment to Supabase.

Use this file first:
- `docs/supabase/chpok_public_schema.sql`

Use `drizzle-kit push` only after:
- `DATABASE_URL` points to the target Supabase Postgres instance
- the reviewed SQL matches the current Drizzle schema
- you accept direct schema-sync behavior

## Expected application objects

### Enum types
- `public.provider_category`
- `public.report_status`
- `public.media_type`

### Tables
- `public.profiles`
- `public.reports`
- `public.report_media`
- `public.report_status_history`
- `public.admin_notes`

### Foreign keys
- `report_media.report_id -> reports.id` with `on delete cascade`
- `report_status_history.report_id -> reports.id` with `on delete cascade`
- `admin_notes.report_id -> reports.id` with `on delete cascade`

### Constraints and defaults
- all primary keys use `uuid default gen_random_uuid()`
- `profiles.user_id` is unique
- counters use integer defaults of `0`
- timestamps use `default now()`

## Scope boundaries for this step

### Included in this step
- create project tables in `public`
- create project enum types in `public`
- point existing Express + Drizzle backend at Supabase via `DATABASE_URL`

### Explicitly not included in this step
- Supabase Auth integration in runtime code
- linking app users to `auth.users`
- Supabase Storage upload implementation
- creating Storage buckets
- RLS policies for project tables
- switching backend to `@supabase/supabase-js`

## Safe application order
1. Confirm `public` is still empty.
2. Review `docs/supabase/chpok_public_schema.sql`.
3. Apply the SQL to Supabase.
4. Re-run a read-only schema audit.
5. Set `DATABASE_URL` to the Supabase Postgres connection string.
6. Run the backend against Supabase.
7. Smoke-test API routes.

## Post-apply verification checklist

### MCP checks
- `list_tables` for `public` returns 5 project tables
- `list_tables` for `public` shows the expected foreign keys
- `storage.buckets` remains unchanged unless intentionally created later

### SQL checks
Ready-made queries:
- `docs/supabase/post_apply_checks.sql`

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
order by table_name;
```

Expected:
- `admin_notes`
- `profiles`
- `report_media`
- `report_status_history`
- `reports`

```sql
select t.typname as enum_name, e.enumlabel as enum_value
from pg_type t
join pg_enum e on e.enumtypid = t.oid
join pg_namespace n on n.oid = t.typnamespace
where n.nspname = 'public'
order by t.typname, e.enumsortorder;
```

Expected enums:
- `media_type`
- `provider_category`
- `report_status`

### Runtime checks
- `pnpm --filter @workspace/api-server run dev`
- `GET /api/healthz`
- `GET /api/providers`
- `GET /api/admin/reports`
- `POST /api/reports` with a minimal valid body

## Caveats
- The generated SQL intentionally does not add indexes beyond PK/unique constraints because the current Drizzle schema does not declare them.
- RLS is intentionally postponed. The backend currently expects direct database access with one connection role.
- If a future sprint links profiles or reports to `auth.users`, that should be a separate schema change.
