-- Chpok initial public schema for Supabase Postgres
-- Reviewed SQL for an empty `public` schema.
-- Safe to apply only after confirming that project tables do not already exist.

begin;

create type public.provider_category as enum (
  'delivery',
  'micromobility',
  'carsharing',
  'taxi',
  'car',
  'other'
);

create type public.report_status as enum (
  'new',
  'in_review',
  'confirmed',
  'rejected',
  'resolved',
  'archived'
);

create type public.media_type as enum (
  'photo',
  'video'
);

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id text not null unique,
  display_name text,
  avatar_url text,
  report_count integer not null default 0,
  reports_resolved integer not null default 0,
  points integer not null default 0,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  is_anonymous boolean not null default false,
  category public.provider_category not null,
  provider_id text not null,
  provider_label text not null,
  description text not null,
  status public.report_status not null default 'new',
  device_geo jsonb,
  address_text text,
  device_context jsonb,
  media_count integer not null default 0,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

create table public.report_media (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  media_type public.media_type not null,
  url text not null,
  mime_type text,
  size_bytes integer,
  taken_at timestamp,
  media_geo jsonb,
  created_at timestamp not null default now()
);

create table public.report_status_history (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  from_status public.report_status,
  to_status public.report_status not null,
  changed_by text,
  note text,
  created_at timestamp not null default now()
);

create table public.admin_notes (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  admin_id text,
  text text not null,
  created_at timestamp not null default now()
);

commit;
