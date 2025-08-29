import { createClient } from '@supabase/supabase-js'

// Minimal, typed data-access layer. Keep DB dumb; map to UI shapes here.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const db = createClient(supabaseUrl, supabaseAnonKey)

// UI-facing types used by pages (kept small and stable)
export interface PlayerUI {
  id: string
  name: string
  position: string
  team_name: string
  points_multiplier: number
  price: number
  goals_scored: number
}

export interface PlayerDB {
  id: string
  name: string
  team: string
  position: string
  price: number
  goals: number
}

export interface UserTeamDB {
  id: string
  user_id: string
  player_id: string
  bought_at: string
  sold_at: string | null
}

// players
export async function fetchPlayers(): Promise<PlayerUI[]> {
  const { data, error } = await db
    .from('players')
    .select('*')
    .order('name')

  if (error) {
    console.error('fetchPlayers error:', error)
    return []
  }

  return (data || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    position: p.position,
    team_name: p.team,
    points_multiplier: 1, // keep logic in TS; simple default
    price: p.price,
    goals_scored: p.goals ?? 0,
  }))
}

export async function fetchPlayersSorted(): Promise<PlayerDB[]> {
  const { data, error } = await db
    .from('players')
    .select('*')
    .order('team', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('fetchPlayersSorted error:', error)
    return []
  }
  return (data || []) as PlayerDB[]
}

export async function fetchUserTeamActive(userId: string): Promise<UserTeamDB[]> {
  const { data, error } = await db
    .from('user_teams')
    .select('*')
    .eq('user_id', userId)
    .is('sold_at', null)

  if (error) {
    console.error('fetchUserTeamActive error:', error)
    return []
  }
  return (data || []) as UserTeamDB[]
}

export async function fetchUserTeamAll(userId: string): Promise<UserTeamDB[]> {
  const { data, error } = await db
    .from('user_teams')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    console.error('fetchUserTeamAll error:', error)
    return []
  }
  return (data || []) as UserTeamDB[]
}

export async function fetchSettingValue(key: string): Promise<string | null> {
  const { data, error } = await db
    .from('game_settings')
    .select('value')
    .eq('key', key)
    .single()

  if (error) {
    console.warn('fetchSettingValue error:', error)
    return null
  }
  return (data as any)?.value ?? null
}

export async function countUserBuysAfter(userId: string, isoDate: string): Promise<number> {
  const { data, error } = await db
    .from('user_teams')
    .select('id')
    .eq('user_id', userId)
    .gte('bought_at', isoDate)

  if (error) {
    console.error('countUserBuysAfter error:', error)
    return 0
  }
  return data?.length ?? 0
}

export async function fetchGoalsForPlayerBetweenCount(playerId: string, fromIso: string, toIso?: string): Promise<number> {
  let query = db
    .from('goals')
    .select('id')
    .eq('player_id', playerId)
    .gte('created_at', fromIso)

  if (toIso) {
    query = query.lt('created_at', toIso)
  }

  const { data, error } = await query
  if (error) {
    console.error('fetchGoalsForPlayerBetweenCount error:', error)
    return 0
  }
  return data?.length ?? 0
}

export async function fetchGoalsForPlayerBetween(playerId: string, fromIso: string, toIso?: string): Promise<Array<{ team_code: string | null }>> {
  let query = db
    .from('goals')
    .select('team_code, created_at')
    .eq('player_id', playerId)
    .gte('created_at', fromIso)

  if (toIso) query = query.lt('created_at', toIso)

  const { data, error } = await query.order('created_at', { ascending: true })
  if (error) {
    console.error('fetchGoalsForPlayerBetween error:', error)
    return []
  }
  return (data || []) as Array<{ team_code: string | null }>
}

export async function ensureUserExists(userId: string, email?: string | null, displayName?: string | null): Promise<boolean> {
  const safeEmail = email || `${userId}@local`
  const safeName = displayName || (email ? email.split('@')[0] : 'Gebruiker')
  const { error } = await db
    .from('users')
    .upsert({ id: userId, email: safeEmail, display_name: safeName }, { onConflict: 'id' })
    .select('id')
    .single()
  if (error) {
    console.error('ensureUserExists error:', error)
    return false
  }
  return true
}

export async function buyUserTeam(userId: string, playerId: string, price: number): Promise<boolean> {
  void price;
  const { error } = await db
    .from('user_teams')
    .insert({
      user_id: userId,
      player_id: playerId,
      bought_at: new Date().toISOString(),
      // price fields intentionally not stored; logic stays in TS
    })

  if (error) {
    console.error('buyUserTeam error:', error)
    return false
  }
  return true
}

export async function sellUserTeam(userTeamId: string): Promise<boolean> {
  const { error } = await db
    .from('user_teams')
    .update({ sold_at: new Date().toISOString() })
    .eq('id', userTeamId)

  if (error) {
    console.error('sellUserTeam error:', error)
    return false
  }
  return true
}

export async function fetchAllUserTeamsWithPlayers(): Promise<Array<{ user_id: string; bought_at: string; sold_at: string | null; player: { id: string; team: string; price: number }; user?: { display_name: string; email: string } }>> {
  const { data, error } = await db
    .from('user_teams')
    .select(`
      user_id,
      bought_at,
      sold_at,
      players (
        id,
        team,
        price
      ),
      users (
        display_name,
        email
      )
    `)

  if (error) {
    console.error('fetchAllUserTeamsWithPlayers error:', error)
    return []
  }

  return (data || []).map((row: any) => ({
    user_id: row.user_id,
    bought_at: row.bought_at,
    sold_at: row.sold_at,
    player: row.players,
    user: row.users,
  }))
}

// Admin-specific helpers
export async function adminFetchPlayers(): Promise<PlayerDB[]> {
  const { data, error } = await db
    .from('players')
    .select('*')
    .order('team', { ascending: true })
    .order('name', { ascending: true })
  if (error) {
    console.error('adminFetchPlayers error:', error)
    return []
  }
  return (data || []) as PlayerDB[]
}

export async function adminInsertPlayer(newPlayer: { name: string; team: string; position: string; price: number; goals?: number }): Promise<PlayerDB | null> {
  const { data, error } = await db
    .from('players')
    .insert([{ ...newPlayer, goals: newPlayer.goals ?? 0 }])
    .select('*')
    .single()
  if (error) {
    console.error('adminInsertPlayer error:', error)
    return null
  }
  return data as PlayerDB
}

export async function adminUpdatePlayer(id: string, update: Partial<PlayerDB>): Promise<PlayerDB | null> {
  const { data, error } = await db
    .from('players')
    .update(update)
    .eq('id', id)
    .select('*')
    .single()
  if (error) {
    console.error('adminUpdatePlayer error:', error)
    return null
  }
  return data as PlayerDB
}

export async function adminDeletePlayer(id: string): Promise<boolean> {
  const { error } = await db
    .from('players')
    .delete()
    .eq('id', id)
  if (error) {
    console.error('adminDeletePlayer error:', error)
    return false
  }
  return true
}

export async function adminCreateMatch(payload: { match_date: string; home_team: string; away_team: string; competition_type: string; home_score?: number | null; away_score?: number | null }): Promise<string | null> {
  const { data, error } = await db
    .from('matches')
    .insert([{ ...payload }])
    .select('id')
    .single()
  if (error) {
    console.error('adminCreateMatch error:', error)
    return null
  }
  return (data as any)?.id || null
}

export async function adminInsertGoal(payload: { match_id: string; player_id: string }): Promise<boolean> {
  const { error } = await db
    .from('goals')
    .insert([{ match_id: payload.match_id, player_id: payload.player_id }])
  if (error) {
    console.error('adminInsertGoal error:', error)
    return false
  }
  return true
}

export async function adminInsertGoalWithTeam(payload: { match_id: string | null; player_id: string; team_code?: string | null; created_at?: string | null }): Promise<boolean> {
  const row: any = { player_id: payload.player_id }
  if (payload.match_id) row.match_id = payload.match_id
  if (payload.team_code) row.team_code = payload.team_code
  if (payload.created_at) row.created_at = payload.created_at
  const { error } = await db.from('goals').insert([row])
  if (error) {
    console.error('adminInsertGoalWithTeam error:', error)
    return false
  }
  return true
}

export async function adminIncrementPlayerGoals(playerId: string, incrementBy: number): Promise<boolean> {
  // Fetch current goals then update; keep it simple
  const { data } = await db.from('players').select('goals').eq('id', playerId).single()
  const current = (data as any)?.goals ?? 0
  const { error } = await db.from('players').update({ goals: current + incrementBy }).eq('id', playerId)
  if (error) {
    console.error('adminIncrementPlayerGoals error:', error)
    return false
  }
  return true
}

export async function adminFetchGameSettings(): Promise<Array<{ key: string; value: string }>> {
  const { data, error } = await db.from('game_settings').select('key, value')
  if (error) {
    console.error('adminFetchGameSettings error:', error)
    return []
  }
  return (data || []) as Array<{ key: string; value: string }>
}

export async function adminUpsertGameSetting(key: string, value: string): Promise<boolean> {
  const { error } = await db
    .from('game_settings')
    .upsert({ key, value }, { onConflict: 'key' })
  if (error) {
    console.error('adminUpsertGameSetting error:', error)
    return false
  }
  return true
}

export async function adminFetchFeedback(): Promise<any[]> {
  const { data, error } = await db
    .from('feedback')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    console.error('adminFetchFeedback error:', error)
    return []
  }
  return data as any[]
}

// Admin emails simple helpers (KV list in admin_emails)
export async function getAdminEmails(): Promise<string[]> {
  const { data, error } = await db.from('admin_emails').select('email').order('email')
  if (error) {
    console.error('getAdminEmails error:', error)
    return ['timsl.tsl@gmail.com', 'Henkgerardus51@gmail.com', 'Nickveldhuis25@gmail.com']
  }
  return (data || []).map((r: any) => r.email)
}

export async function addAdminEmail(email: string): Promise<boolean> {
  const { error } = await db.from('admin_emails').insert({ email: email.toLowerCase() })
  if (error) {
    console.error('addAdminEmail error:', error)
    return false
  }
  return true
}

export async function removeAdminEmail(email: string): Promise<boolean> {
  const { error } = await db.from('admin_emails').delete().eq('email', email.toLowerCase())
  if (error) {
    console.error('removeAdminEmail error:', error)
    return false
  }
  return true
}

export async function adminFetchUserTeamsWithPlayersByUser(userId: string): Promise<Array<{ bought_at: string; sold_at: string | null; player: { id: string; name: string; team: string; price: number } }>> {
  const { data, error } = await db
    .from('user_teams')
    .select(`
      bought_at,
      sold_at,
      players (
        id,
        name,
        team,
        price
      )
    `)
    .eq('user_id', userId)
  if (error) {
    console.error('adminFetchUserTeamsWithPlayersByUser error:', error)
    return []
  }
  return (data || []).map((row: any) => ({
    bought_at: row.bought_at,
    sold_at: row.sold_at,
    player: row.players,
  }))
}

export async function adminDeleteUserTeams(userId: string): Promise<boolean> {
  const { error } = await db.from('user_teams').delete().eq('user_id', userId)
  if (error) {
    console.error('adminDeleteUserTeams error:', error)
    return false
  }
  return true
}


