create extension if not exists pgcrypto;

create table if not exists public.portfolio_videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  description text not null,
  video_url text not null,
  storage_provider text not null default 'aws_s3',
  s3_object_key text,
  s3_bucket text,
  bytes bigint,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.portfolio_videos
add column if not exists storage_provider text not null default 'aws_s3';

alter table public.portfolio_videos
add column if not exists s3_object_key text;

alter table public.portfolio_videos
add column if not exists s3_bucket text;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'portfolio_videos'
      and column_name = 'azure_blob_name'
  ) then
    alter table public.portfolio_videos alter column azure_blob_name drop not null;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'portfolio_videos'
      and column_name = 'azure_container'
  ) then
    alter table public.portfolio_videos alter column azure_container drop not null;
  end if;
end $$;

alter table public.portfolio_videos enable row level security;

drop policy if exists "Published videos are public" on public.portfolio_videos;

create policy "Published videos are public"
on public.portfolio_videos
for select
using (published = true);

create index if not exists portfolio_videos_published_created_at_idx
on public.portfolio_videos (published, created_at desc);
