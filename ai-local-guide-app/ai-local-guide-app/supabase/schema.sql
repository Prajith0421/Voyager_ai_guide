-- Run this in your Supabase SQL editor

create table if not exists saved_places (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  place_id text not null,
  name text not null,
  category text not null,
  lat double precision not null,
  lng double precision not null,
  address text,
  created_at timestamptz default now()
);

create table if not exists saved_chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  messages jsonb not null default '[]',
  location_label text,
  created_at timestamptz default now()
);

alter table saved_places enable row level security;
alter table saved_chats enable row level security;

create policy "Users manage own saved places"
  on saved_places for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own saved chats"
  on saved_chats for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
