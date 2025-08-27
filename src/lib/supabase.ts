import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are not set. Please check your .env file.')
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing')
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// ============================================================================
// NIEUWE DATABASE TYPES VOOR IMPROVED SCHEMA
// ============================================================================

export interface Team {
  id: string
  name: string
  code: string
  points_per_goal: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Position {
  id: string
  name: string
  short_name: string
  created_at: string
}

export interface Player {
  id: string
  name: string
  team_id: string
  position_id: string
  price: number
  total_goals: number
  is_active: boolean
  created_at: string
  updated_at: string
  // Joined data
  team?: Team
  position?: Position
}

export interface Season {
  id: string
  name: string
  start_date: string
  end_date: string
  is_active: boolean
  transfer_deadline: string | null
  max_team_size: number
  initial_budget: number
  transfers_after_deadline: number
  created_at: string
  updated_at: string
}

export interface Match {
  id: string
  season_id: string
  home_team_id: string
  away_team_id: string
  match_date: string
  home_score: number | null
  away_score: number | null
  status: 'scheduled' | 'live' | 'finished' | 'cancelled'
  competition_type: 'league' | 'cup' | 'friendly'
  is_competitive: boolean
  created_at: string
  updated_at: string
  // Joined data
  home_team?: Team
  away_team?: Team
  season?: Season
}

export interface Goal {
  id: string
  match_id: string
  player_id: string
  minute: number
  is_own_goal: boolean
  is_penalty: boolean
  created_at: string
  // Joined data
  player?: Player
  match?: Match
}

export interface UserProfile {
  id: string
  user_id: string
  display_name: string
  avatar_url: string | null
  is_admin: boolean
  is_active: boolean
  last_login: string | null
  created_at: string
  updated_at: string
}

export interface UserTeam {
  id: string
  user_id: string
  season_id: string
  player_id: string
  bought_at: string
  sold_at: string | null
  bought_price: number
  sold_price: number | null
  points_earned: number
  created_at: string
  updated_at: string
  // Joined data
  player?: Player
  season?: Season
}

export interface Transfer {
  id: string
  user_id: string
  season_id: string
  player_id: string
  action: 'buy' | 'sell'
  price: number
  transfer_date: string
  is_after_deadline: boolean
  created_at: string
  // Joined data
  player?: Player
  season?: Season
}

export interface UserPoints {
  id: string
  user_id: string
  season_id: string
  period: 'daily' | 'weekly' | 'monthly' | 'season'
  period_start: string
  period_end: string
  total_points: number
  team_value: number
  unique_goal_scorers: number
  transfers_made: number
  created_at: string
  updated_at: string
  // Joined data
  season?: Season
}

export interface GameSettings {
  id: string
  key: string
  value: string
  description: string | null
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface Feedback {
  id: string
  user_id: string
  type: 'bug' | 'feature' | 'general'
  subject: string
  message: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  admin_response: string | null
  created_at: string
  updated_at: string
  // Joined data
  user_profile?: UserProfile
}

// ============================================================================
// HELPER FUNCTIES VOOR NIEUWE DATABASE
// ============================================================================

// Functie om punten per team te krijgen (gebruikt database functie)
export const getTeamPoints = async (teamCode: string): Promise<number> => {
  try {
    const { data, error } = await supabase.rpc('get_team_points', { team_code: teamCode })
    if (error) throw error
    return data || 1.0
  } catch (error) {
    console.error('Error getting team points:', error)
    // Fallback naar hardcoded waarden
    switch (teamCode) {
      case 'KOSC1': return 3.0
      case 'KOSC2': return 2.5
      case 'KOSC3': return 2.0
      default: return 1.0
    }
  }
}

// Functie om te checken of transfers toegestaan zijn
export const isTransferAllowed = async (userId?: string, seasonId?: string): Promise<boolean> => {
  try {
    if (!userId || !seasonId) {
      // Fallback naar oude methode als geen seizoen info
      const { data: weekendSetting } = await supabase
        .from('game_settings')
        .select('value')
        .eq('key', 'weekend_transfers_allowed')
        .single()
      
      if (weekendSetting && weekendSetting.value === 'true') {
        return true
      }
      
      const today = new Date()
      const dayOfWeek = today.getDay()
      return dayOfWeek !== 0 && dayOfWeek !== 6
    }

    // Gebruik nieuwe database functie
    const { data, error } = await supabase.rpc('is_transfer_allowed', { 
      user_uuid: userId, 
      season_uuid: seasonId 
    })
    if (error) throw error
    return data || false
  } catch (error) {
    console.error('Error checking transfer allowance:', error)
    return false
  }
}

// Functie om gebruikerspunten te berekenen
export const calculateUserPoints = async (userId: string, seasonId: string): Promise<number> => {
  try {
    const { data, error } = await supabase.rpc('calculate_user_points', { 
      user_uuid: userId, 
      season_uuid: seasonId 
    })
    if (error) throw error
    return data || 0
  } catch (error) {
    console.error('Error calculating user points:', error)
    return 0
  }
}

// Functie om actief seizoen op te halen
export const getActiveSeason = async (): Promise<Season | null> => {
  try {
    const { data, error } = await supabase
      .from('seasons')
      .select('*')
      .eq('is_active', true)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error getting active season:', error)
    return null
  }
}

// Functie om alle teams op te halen
export const getTeams = async (): Promise<Team[]> => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('is_active', true)
      .order('name')
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting teams:', error)
    return []
  }
}

// Functie om alle posities op te halen
export const getPositions = async (): Promise<Position[]> => {
  try {
    const { data, error } = await supabase
      .from('positions')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting positions:', error)
    return []
  }
}

// Functie om spelers op te halen met team en positie info
export const getPlayers = async (): Promise<Player[]> => {
  try {
    const { data, error } = await supabase
      .from('players')
      .select(`
        *,
        team:teams(*),
        position:positions(*)
      `)
      .eq('is_active', true)
      .order('name')
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting players:', error)
    return []
  }
}

// Functie om gebruiker team op te halen met speler info
export const getUserTeam = async (userId: string, seasonId: string): Promise<UserTeam[]> => {
  try {
    const { data, error } = await supabase
      .from('user_teams')
      .select(`
        *,
        player:players(
          *,
          team:teams(*),
          position:positions(*)
        ),
        season:seasons(*)
      `)
      .eq('user_id', userId)
      .eq('season_id', seasonId)
      .is('sold_at', null)
      .order('bought_at')
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting user team:', error)
    return []
  }
}

// Functie om beschikbare spelers op te halen (niet in team van gebruiker)
export const getAvailablePlayers = async (userId: string, seasonId: string): Promise<Player[]> => {
  try {
    // Haal eerst gebruiker team op
    const userTeam = await getUserTeam(userId, seasonId)
    const userPlayerIds = userTeam.map(ut => ut.player_id)
    
    // Haal alle spelers op die niet in het team zitten
    const { data, error } = await supabase
      .from('players')
      .select(`
        *,
        team:teams(*),
        position:positions(*)
      `)
      .eq('is_active', true)
      .not('id', 'in', `(${userPlayerIds.map(id => `'${id}'`).join(',')})`)
      .order('name')
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting available players:', error)
    return []
  }
}

// Functie om speler te kopen
export const buyPlayer = async (
  userId: string, 
  seasonId: string, 
  playerId: string, 
  price: number
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Check transfer allowance
    const transferAllowed = await isTransferAllowed(userId, seasonId)
    if (!transferAllowed) {
      return { success: false, error: 'Transfers zijn niet toegestaan op dit moment' }
    }

    // Haal seizoen info op
    const season = await getActiveSeason()
    if (!season) {
      return { success: false, error: 'Geen actief seizoen gevonden' }
    }

    // Check team size
    const userTeam = await getUserTeam(userId, seasonId)
    if (userTeam.length >= season.max_team_size) {
      return { success: false, error: `Team is vol (maximaal ${season.max_team_size} spelers)` }
    }

    // Check budget
    const currentTeamValue = userTeam.reduce((sum, ut) => sum + ut.bought_price, 0)
    const budget = season.initial_budget - currentTeamValue
    if (budget < price) {
      return { success: false, error: `Niet genoeg budget. Beschikbaar: €${budget}, Nodig: €${price}` }
    }

    // Check transfer deadline
    const now = new Date()
    const isAfterDeadline = season.transfer_deadline && now > new Date(season.transfer_deadline)
    
    if (isAfterDeadline) {
      // Tel transfers na deadline
      const { data: postDeadlineTransfers } = await supabase
        .from('transfers')
        .select('id')
        .eq('user_id', userId)
        .eq('season_id', seasonId)
        .eq('is_after_deadline', true)
      
      if ((postDeadlineTransfers?.length || 0) >= season.transfers_after_deadline) {
        return { success: false, error: 'Geen transfers meer over na deadline' }
      }
    }

    // Voer transactie uit
    const { error: teamError } = await supabase
      .from('user_teams')
      .insert({
        user_id: userId,
        season_id: seasonId,
        player_id: playerId,
        bought_at: now.toISOString(),
        bought_price: price
      })

    if (teamError) throw teamError

    // Log transfer
    const { error: transferError } = await supabase
      .from('transfers')
      .insert({
        user_id: userId,
        season_id: seasonId,
        player_id: playerId,
        action: 'buy',
        price: price,
        transfer_date: now.toISOString(),
        is_after_deadline: isAfterDeadline
      })

    if (transferError) throw transferError

    return { success: true }
  } catch (error) {
    console.error('Error buying player:', error)
    return { success: false, error: 'Er is een fout opgetreden bij het kopen van de speler' }
  }
}

// Functie om speler te verkopen
export const sellPlayer = async (
  userId: string, 
  seasonId: string, 
  userTeamId: string, 
  price: number
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Check transfer allowance
    const transferAllowed = await isTransferAllowed(userId, seasonId)
    if (!transferAllowed) {
      return { success: false, error: 'Transfers zijn niet toegestaan op dit moment' }
    }

    const now = new Date()

    // Update user_teams
    const { error: teamError } = await supabase
      .from('user_teams')
      .update({
        sold_at: now.toISOString(),
        sold_price: price
      })
      .eq('id', userTeamId)
      .eq('user_id', userId)

    if (teamError) throw teamError

    // Haal speler info op voor transfer log
    const { data: userTeam } = await supabase
      .from('user_teams')
      .select('player_id')
      .eq('id', userTeamId)
      .single()

    if (userTeam) {
      // Log transfer
      const { error: transferError } = await supabase
        .from('transfers')
        .insert({
          user_id: userId,
          season_id: seasonId,
          player_id: userTeam.player_id,
          action: 'sell',
          price: price,
          transfer_date: now.toISOString(),
          is_after_deadline: false // Verkopen is altijd toegestaan
        })

      if (transferError) throw transferError
    }

    return { success: true }
  } catch (error) {
    console.error('Error selling player:', error)
    return { success: false, error: 'Er is een fout opgetreden bij het verkopen van de speler' }
  }
}

// Functie om leaderboard op te halen
export const getLeaderboard = async (seasonId: string, limit: number = 10): Promise<Array<{
  user_id: string
  display_name: string
  total_points: number
  team_value: number
  rank: number
}>> => {
  try {
    // Gebruik een view of functie voor efficiënte leaderboard berekening
    const { data, error } = await supabase
      .from('user_points')
      .select(`
        user_id,
        total_points,
        team_value,
        user_profiles!inner(display_name)
      `)
      .eq('season_id', seasonId)
      .eq('period', 'season')
      .order('total_points', { ascending: false })
      .limit(limit)

    if (error) throw error

    // Voeg rank toe
    return (data || []).map((item: any, index) => ({
      user_id: item.user_id,
      display_name: item.user_profiles.display_name,
      total_points: item.total_points,
      team_value: item.team_value,
      rank: index + 1
    }))
  } catch (error) {
    console.error('Error getting leaderboard:', error)
    return []
  }
}

// Functie om gebruiker profiel op te halen of aan te maken
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    // Probeer bestaand profiel op te halen
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (existingProfile) {
      return existingProfile
    }

    // Maak nieuw profiel aan
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) return null

    let displayName = ''
    if (user.user.user_metadata?.full_name) {
      displayName = user.user.user_metadata.full_name
    } else if (user.user.user_metadata?.first_name && user.user.user_metadata?.last_name) {
      displayName = `${user.user.user_metadata.first_name} ${user.user.user_metadata.last_name}`
    } else if (user.user.user_metadata?.first_name) {
      displayName = user.user.user_metadata.first_name
    } else {
      displayName = user.user.email?.split('@')[0] || 'Gebruiker'
    }

    const { data: newProfile, error } = await supabase
      .from('user_profiles')
      .insert({
        user_id: userId,
        display_name: displayName,
        is_admin: false,
        is_active: true
      })
      .select()
      .single()

    if (error) throw error
    return newProfile
  } catch (error) {
    console.error('Error getting/creating user profile:', error)
    return null
  }
}

// Functie om game settings op te halen
export const getGameSettings = async (): Promise<GameSettings[]> => {
  try {
    const { data, error } = await supabase
      .from('game_settings')
      .select('*')
      .eq('is_public', true)
      .order('key')
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting game settings:', error)
    return []
  }
}

// Functie om feedback in te dienen
export const submitFeedback = async (
  userId: string,
  type: 'bug' | 'feature' | 'general',
  subject: string,
  message: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('feedback')
      .insert({
        user_id: userId,
        type,
        subject,
        message,
        status: 'open',
        priority: 'medium'
      })

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error submitting feedback:', error)
    return { success: false, error: 'Er is een fout opgetreden bij het indienen van feedback' }
  }
}
