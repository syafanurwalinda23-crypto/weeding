create extension if not exists pgcrypto;

create table if not exists public.wedding_comments (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 80),
  attendance text not null check (attendance in ('Hadir', 'Berhalangan')),
  message text not null check (char_length(trim(message)) between 1 and 500),
  created_at timestamptz not null default now()
);

create index if not exists wedding_comments_created_at_idx
  on public.wedding_comments (created_at desc);

alter table public.wedding_comments enable row level security;

drop policy if exists "Public can read wedding comments" on public.wedding_comments;
create policy "Public can read wedding comments"
  on public.wedding_comments
  for select
  to anon
  using (true);

drop policy if exists "Public can insert wedding comments" on public.wedding_comments;
create policy "Public can insert wedding comments"
  on public.wedding_comments
  for insert
  to anon
  with check (
    char_length(trim(name)) between 1 and 80
    and attendance in ('Hadir', 'Berhalangan')
    and char_length(trim(message)) between 1 and 500
  );
