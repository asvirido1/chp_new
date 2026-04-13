begin;

alter table public.reports
  add column if not exists voice_note_path text,
  add column if not exists transcript_raw text,
  add column if not exists transcript_clean text,
  add column if not exists transcript_status text not null default 'idle',
  add column if not exists transcript_language text,
  add column if not exists transcript_provider text,
  add column if not exists transcript_error text;

update public.reports
set transcript_status = 'idle'
where transcript_status is null;

commit;
