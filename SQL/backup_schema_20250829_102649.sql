-- Consolidated minimal schema backup for Kosc Spitsenspel (dumb DB)
create extension if not exists "uuid-ossp";

create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  display_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists players (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  team text not null,
  position text not null,
  price integer not null,
  goals integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists matches (
  id uuid primary key default uuid_generate_v4(),
  match_date date not null,
  home_team text not null,
  away_team text not null,
  competition_type text not null,
  home_score integer,
  away_score integer,
  created_at timestamptz not null default now()
);

create table if not exists goals (
  id uuid primary key default uuid_generate_v4(),
  match_id uuid not null references matches(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  minute integer,
  created_at timestamptz not null default now()
);

create table if not exists user_teams (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  player_id uuid not null references players(id) on delete restrict,
  bought_at timestamptz not null default now(),
  sold_at timestamptz
);

create table if not exists game_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

create table if not exists feedback (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  rating integer,
  created_at timestamptz not null default now()
);

create table if not exists admin_emails (
  email text primary key
);

create index if not exists idx_user_teams_user on user_teams(user_id);
create index if not exists idx_user_teams_player_bought_sold on user_teams(player_id, bought_at, sold_at);
create index if not exists idx_goals_player_created on goals(player_id, created_at);
create index if not exists idx_goals_match on goals(match_id);
create index if not exists idx_matches_date on matches(match_date);
