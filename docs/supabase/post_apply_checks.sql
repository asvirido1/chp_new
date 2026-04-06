-- Read-only verification queries for Chpok public schema on Supabase.

-- 1) Tables in public schema
select table_name
from information_schema.tables
where table_schema = 'public'
order by table_name;

-- 2) Columns, nullability, defaults
select
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
from information_schema.columns
where table_schema = 'public'
order by table_name, ordinal_position;

-- 3) Foreign keys
select
  tc.table_name,
  kcu.column_name,
  ccu.table_name as foreign_table_name,
  ccu.column_name as foreign_column_name,
  rc.delete_rule
from information_schema.table_constraints tc
join information_schema.key_column_usage kcu
  on tc.constraint_name = kcu.constraint_name
  and tc.table_schema = kcu.table_schema
join information_schema.constraint_column_usage ccu
  on ccu.constraint_name = tc.constraint_name
  and ccu.table_schema = tc.table_schema
join information_schema.referential_constraints rc
  on rc.constraint_name = tc.constraint_name
  and rc.constraint_schema = tc.table_schema
where tc.constraint_type = 'FOREIGN KEY'
  and tc.table_schema = 'public'
order by tc.table_name, kcu.column_name;

-- 4) Enum values
select
  t.typname as enum_name,
  e.enumlabel as enum_value
from pg_type t
join pg_enum e on e.enumtypid = t.oid
join pg_namespace n on n.oid = t.typnamespace
where n.nspname = 'public'
order by t.typname, e.enumsortorder;

-- 5) Primary key and unique constraints
select
  tc.table_name,
  tc.constraint_type,
  tc.constraint_name,
  string_agg(kcu.column_name, ', ' order by kcu.ordinal_position) as columns
from information_schema.table_constraints tc
left join information_schema.key_column_usage kcu
  on tc.constraint_name = kcu.constraint_name
  and tc.table_schema = kcu.table_schema
where tc.table_schema = 'public'
  and tc.constraint_type in ('PRIMARY KEY', 'UNIQUE')
group by tc.table_name, tc.constraint_type, tc.constraint_name
order by tc.table_name, tc.constraint_type, tc.constraint_name;

-- 6) Key defaults for generated IDs and counters
select
  table_name,
  column_name,
  column_default
from information_schema.columns
where table_schema = 'public'
  and (
    (column_name = 'id' and column_default is not null)
    or (column_name in ('report_count', 'reports_resolved', 'points', 'media_count'))
    or (column_name in ('created_at', 'updated_at'))
    or (column_name in ('is_anonymous', 'status'))
  )
order by table_name, column_name;

-- 7) Row counts
select 'profiles' as table_name, count(*) as row_count from public.profiles
union all
select 'reports', count(*) from public.reports
union all
select 'report_media', count(*) from public.report_media
union all
select 'report_status_history', count(*) from public.report_status_history
union all
select 'admin_notes', count(*) from public.admin_notes
order by table_name;
