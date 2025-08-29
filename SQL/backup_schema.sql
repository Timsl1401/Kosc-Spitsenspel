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
  team_code text,
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
create index if not exists idx_goals_player_teamcode on goals(player_id, team_code, created_at);
create index if not exists idx_goals_match on goals(match_id);
create index if not exists idx_matches_date on matches(match_date);

-- ============================================================================
-- RLS + GRANTS (open policies for anon; tighten later if needed)
-- ============================================================================

grant usage on schema public to anon;
grant usage on schema public to authenticated;

-- players
grant select, insert, update, delete on table public.players to anon;
grant select, insert, update, delete on table public.players to authenticated;
alter table public.players enable row level security;
drop policy if exists players_all_select on public.players;
create policy players_all_select on public.players for select to anon using (true);
create policy players_all_select_auth on public.players for select to authenticated using (true);
drop policy if exists players_all_insert on public.players;
create policy players_all_insert on public.players for insert to anon with check (true);
create policy players_all_insert_auth on public.players for insert to authenticated with check (true);
drop policy if exists players_all_update on public.players;
create policy players_all_update on public.players for update to anon using (true) with check (true);
create policy players_all_update_auth on public.players for update to authenticated using (true) with check (true);
drop policy if exists players_all_delete on public.players;
create policy players_all_delete on public.players for delete to anon using (true);
create policy players_all_delete_auth on public.players for delete to authenticated using (true);

-- matches
grant select, insert, update, delete on table public.matches to anon;
grant select, insert, update, delete on table public.matches to authenticated;
alter table public.matches enable row level security;
drop policy if exists matches_all_select on public.matches;
create policy matches_all_select on public.matches for select to anon using (true);
create policy matches_all_select_auth on public.matches for select to authenticated using (true);
drop policy if exists matches_all_insert on public.matches;
create policy matches_all_insert on public.matches for insert to anon with check (true);
create policy matches_all_insert_auth on public.matches for insert to authenticated with check (true);
drop policy if exists matches_all_update on public.matches;
create policy matches_all_update on public.matches for update to anon using (true) with check (true);
create policy matches_all_update_auth on public.matches for update to authenticated using (true) with check (true);
drop policy if exists matches_all_delete on public.matches;
create policy matches_all_delete on public.matches for delete to anon using (true);
create policy matches_all_delete_auth on public.matches for delete to authenticated using (true);

-- goals
grant select, insert, update, delete on table public.goals to anon;
grant select, insert, update, delete on table public.goals to authenticated;
alter table public.goals enable row level security;
drop policy if exists goals_all_select on public.goals;
create policy goals_all_select on public.goals for select to anon using (true);
create policy goals_all_select_auth on public.goals for select to authenticated using (true);
drop policy if exists goals_all_insert on public.goals;
create policy goals_all_insert on public.goals for insert to anon with check (true);
create policy goals_all_insert_auth on public.goals for insert to authenticated with check (true);
drop policy if exists goals_all_update on public.goals;
create policy goals_all_update on public.goals for update to anon using (true) with check (true);
create policy goals_all_update_auth on public.goals for update to authenticated using (true) with check (true);
drop policy if exists goals_all_delete on public.goals;
create policy goals_all_delete on public.goals for delete to anon using (true);
create policy goals_all_delete_auth on public.goals for delete to authenticated using (true);

-- user_teams
grant select, insert, update, delete on table public.user_teams to anon;
grant select, insert, update, delete on table public.user_teams to authenticated;
alter table public.user_teams enable row level security;
drop policy if exists user_teams_all_select on public.user_teams;
create policy user_teams_all_select on public.user_teams for select to anon using (true);
create policy user_teams_all_select_auth on public.user_teams for select to authenticated using (true);
drop policy if exists user_teams_all_insert on public.user_teams;
create policy user_teams_all_insert on public.user_teams for insert to anon with check (true);
create policy user_teams_all_insert_auth on public.user_teams for insert to authenticated with check (true);
drop policy if exists user_teams_all_update on public.user_teams;
create policy user_teams_all_update on public.user_teams for update to anon using (true) with check (true);
create policy user_teams_all_update_auth on public.user_teams for update to authenticated using (true) with check (true);
drop policy if exists user_teams_all_delete on public.user_teams;
create policy user_teams_all_delete on public.user_teams for delete to anon using (true);
create policy user_teams_all_delete_auth on public.user_teams for delete to authenticated using (true);

-- game_settings
grant select, insert, update, delete on table public.game_settings to anon;
grant select, insert, update, delete on table public.game_settings to authenticated;
alter table public.game_settings enable row level security;
drop policy if exists game_settings_all_select on public.game_settings;
create policy game_settings_all_select on public.game_settings for select to anon using (true);
create policy game_settings_all_select_auth on public.game_settings for select to authenticated using (true);
drop policy if exists game_settings_all_insert on public.game_settings;
create policy game_settings_all_insert on public.game_settings for insert to anon with check (true);
create policy game_settings_all_insert_auth on public.game_settings for insert to authenticated with check (true);
drop policy if exists game_settings_all_update on public.game_settings;
create policy game_settings_all_update on public.game_settings for update to anon using (true) with check (true);
create policy game_settings_all_update_auth on public.game_settings for update to authenticated using (true) with check (true);
drop policy if exists game_settings_all_delete on public.game_settings;
create policy game_settings_all_delete on public.game_settings for delete to anon using (true);
create policy game_settings_all_delete_auth on public.game_settings for delete to authenticated using (true);

-- feedback
grant select, insert, update, delete on table public.feedback to anon;
grant select, insert, update, delete on table public.feedback to authenticated;
alter table public.feedback enable row level security;
drop policy if exists feedback_all_select on public.feedback;
create policy feedback_all_select on public.feedback for select to anon using (true);
create policy feedback_all_select_auth on public.feedback for select to authenticated using (true);
drop policy if exists feedback_all_insert on public.feedback;
create policy feedback_all_insert on public.feedback for insert to anon with check (true);
create policy feedback_all_insert_auth on public.feedback for insert to authenticated with check (true);
drop policy if exists feedback_all_update on public.feedback;
create policy feedback_all_update on public.feedback for update to anon using (true) with check (true);
create policy feedback_all_update_auth on public.feedback for update to authenticated using (true) with check (true);
drop policy if exists feedback_all_delete on public.feedback;
create policy feedback_all_delete on public.feedback for delete to anon using (true);
create policy feedback_all_delete_auth on public.feedback for delete to authenticated using (true);

-- admin_emails
grant select, insert, update, delete on table public.admin_emails to anon;
grant select, insert, update, delete on table public.admin_emails to authenticated;
alter table public.admin_emails enable row level security;
drop policy if exists admin_emails_all_select on public.admin_emails;
create policy admin_emails_all_select on public.admin_emails for select to anon using (true);
create policy admin_emails_all_select_auth on public.admin_emails for select to authenticated using (true);
drop policy if exists admin_emails_all_insert on public.admin_emails;
create policy admin_emails_all_insert on public.admin_emails for insert to anon with check (true);
create policy admin_emails_all_insert_auth on public.admin_emails for insert to authenticated with check (true);
drop policy if exists admin_emails_all_update on public.admin_emails;
create policy admin_emails_all_update on public.admin_emails for update to anon using (true) with check (true);
create policy admin_emails_all_update_auth on public.admin_emails for update to authenticated using (true) with check (true);
drop policy if exists admin_emails_all_delete on public.admin_emails;
create policy admin_emails_all_delete on public.admin_emails for delete to anon using (true);
create policy admin_emails_all_delete_auth on public.admin_emails for delete to authenticated using (true);
