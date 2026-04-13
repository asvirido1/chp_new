begin;

insert into storage.buckets (id, name, public)
values ('report-media', 'report-media', false)
on conflict (id) do update
set public = excluded.public;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'voice uploads insert own prefix'
  ) then
    create policy "voice uploads insert own prefix"
    on storage.objects
    for insert
    to authenticated
    with check (
      bucket_id = 'report-media'
      and name like 'voice-notes/' || (select auth.uid())::text || '/%'
    );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'voice uploads read own prefix'
  ) then
    create policy "voice uploads read own prefix"
    on storage.objects
    for select
    to authenticated
    using (
      bucket_id = 'report-media'
      and name like 'voice-notes/' || (select auth.uid())::text || '/%'
    );
  end if;
end
$$;

commit;
