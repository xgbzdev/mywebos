-- FireCloud server setup for Supabase.
-- Paste this whole file into: Supabase dashboard > SQL Editor > New query > Run.
-- Safe to run more than once.

-- 1. Devices (Find My Device). Each account only ever sees its own devices.
create table if not exists public.devices (
  id uuid primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (char_length(name) <= 60),
  kind text,
  locate_enabled boolean not null default false,
  lat double precision,
  lon double precision,
  accuracy double precision,
  last_seen timestamptz,
  ring_requested boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.devices enable row level security;
drop policy if exists "devices: owner only" on public.devices;
create policy "devices: owner only" on public.devices
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 2. Private file storage: one folder per account (<user id>/photos, <user id>/apps).
insert into storage.buckets (id, name, public, file_size_limit)
values ('firecloud', 'firecloud', false, 10485760)          -- 10 MB per file
on conflict (id) do update set public = false, file_size_limit = 10485760;

-- Space used by the signed-in account
create or replace function public.firecloud_usage()
returns bigint language sql stable security definer set search_path = '' as $$
  select coalesce(sum((o.metadata->>'size')::bigint), 0)
  from storage.objects o
  where o.bucket_id = 'firecloud'
    and (storage.foldername(o.name))[1] = auth.uid()::text;
$$;
revoke all on function public.firecloud_usage() from public, anon;
grant execute on function public.firecloud_usage() to authenticated;

drop policy if exists "firecloud: read own"   on storage.objects;
drop policy if exists "firecloud: add own"    on storage.objects;
drop policy if exists "firecloud: change own" on storage.objects;
drop policy if exists "firecloud: delete own" on storage.objects;

create policy "firecloud: read own" on storage.objects for select to authenticated
  using (bucket_id = 'firecloud' and (storage.foldername(name))[1] = auth.uid()::text);

-- Uploads only into your own folder, and only while under 100 MB in total
create policy "firecloud: add own" on storage.objects for insert to authenticated
  with check (bucket_id = 'firecloud'
              and (storage.foldername(name))[1] = auth.uid()::text
              and public.firecloud_usage() < 100 * 1024 * 1024);

create policy "firecloud: change own" on storage.objects for update to authenticated
  using (bucket_id = 'firecloud' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'firecloud' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "firecloud: delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'firecloud' and (storage.foldername(name))[1] = auth.uid()::text);

-- 3. Delete my account (the app deletes the user's files first)
create or replace function public.delete_my_account()
returns void language plpgsql security definer set search_path = '' as $$
declare me uuid := auth.uid();
begin
  if me is null then raise exception 'not signed in' using errcode = '42501'; end if;
  delete from public.devices where user_id = me;
  delete from auth.users where id = me;
end;
$$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
