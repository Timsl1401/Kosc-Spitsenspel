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

// Database types voor KOSC Spitsenspel
export interface Player {
  id: string
  name: string
  team: string // 'KOSC 1', 'KOSC 2', 'KOSC 3', 'KOSC 4', etc.
  position: string
  price: number // in euro's
  goals: number
  created_at: string
  updated_at: string
}

export interface Match {
  id: string
  home_team: string
  away_team: string
  home_score: number | null
  away_score: number | null
  match_date: string
  competition: string // 'competitie' of 'beker'
  status: 'scheduled' | 'live' | 'finished'
  is_competitive: boolean // of de wedstrijd punten telt
  created_at: string
  updated_at: string
}

export interface Goal {
  id: string
  match_id: string
  player_id: string
  team_code?: string | null
  minute: number
  created_at: string
}

export interface UserTeam {
  id: string
  user_id: string
  player_id: string
  bought_at: string
  sold_at: string | null
  points_earned: number
  created_at: string
  updated_at: string
}

export interface UserPoints {
  id: string
  user_id: string
  period: string // 'seizoen', 'maand', etc.
  total_points: number
  team_value: number
  unique_goal_scorers: number
  created_at: string
  updated_at: string
}

export interface Transfer {
  id: string
  user_id: string
  player_id: string
  action: 'buy' | 'sell'
  price: number
  transfer_date: string
  created_at: string
}

export interface GameSettings {
  id: string
  key: string
  value: string
  description: string
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  display_name: string
  created_at: string
  updated_at: string
}

export interface Feedback {
  id: string
  name: string
  email: string
  subject: string
  message: string
  rating: number
  created_at: string
}

// Functie om punten per team te berekenen
export const getTeamPoints = (team: string): number => {
  // Normalize team string (e.g., 'KOSC 1', 'KOSC zaterdag 2/3', 'KOSC A1')
  const normalized = team.trim();
  switch (team) {
    case 'KOSC 1':
      return 3
    case 'KOSC 2':
      return 2
    case 'KOSC zaterdag 2/3':
      return 1
    case 'KOSC A1':
      return 1
    default: {
      // KOSC 3 t/m 7 => 1 punt per doelpunt
      const m = normalized.match(/^KOSC\s+(\d+)$/i);
      if (m) {
        const teamNumber = parseInt(m[1], 10);
        if (teamNumber >= 3 && teamNumber <= 7) return 1;
        if (teamNumber === 1) return 3;
        if (teamNumber === 2) return 2;
      }
      return 1
    }
  }
}

// Functie om te checken of transfers toegestaan zijn (niet in weekend)
export const isTransferAllowed = async (): Promise<boolean> => {
  try {
    // Haal admin instelling op voor weekend transfers
    const { data: weekendSetting } = await supabase
      .from('game_settings')
      .select('value')
      .eq('key', 'weekend_transfers_allowed')
      .single()
    
    // Als admin weekend transfers heeft ingeschakeld, altijd toestaan
    if (weekendSetting && weekendSetting.value === 'true') {
      return true
    }
    
    // Anders, standaard weekend regel toepassen
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 = zondag, 6 = zaterdag
    return dayOfWeek !== 0 && dayOfWeek !== 6
  } catch (error) {
    console.error('Error checking transfer allowance:', error)
    // Bij fout, standaard weekend regel toepassen
    const today = new Date()
    const dayOfWeek = today.getDay()
    return dayOfWeek !== 0 && dayOfWeek !== 6
  }
}

// Functie om gebruikerspunten te berekenen
export const calculateUserPoints = (
  goals: Goal[],
  userTeam: UserTeam[],
  playerIdToTeam: Record<string, string>
): number => {
  let totalPoints = 0
  for (const goal of goals) {
    const ownedAtTime = userTeam.find(ut =>
      ut.player_id === goal.player_id &&
      ut.bought_at <= goal.created_at &&
      (ut.sold_at === null || ut.sold_at > goal.created_at)
    )
    if (!ownedAtTime) continue
    const effectiveTeam = goal.team_code && goal.team_code.trim() !== ''
      ? goal.team_code
      : playerIdToTeam[goal.player_id]
    totalPoints += getTeamPoints(effectiveTeam)
  }
  return totalPoints
}

// Functie om admin emails op te halen uit database
export const getAdminEmails = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('admin_emails')
      .select('email')
      .order('email')
    
    if (error) throw error
    return data?.map(row => row.email) || []
  } catch (error) {
    console.error('Error getting admin emails:', error)
    // Fallback naar hardcoded emails als de tabel niet bestaat
    return ['timsl.tsl@gmail.com', 'Henkgerardus51@gmail.com', 'Nickveldhuis25@gmail.com']
  }
}

// Functie om admin email toe te voegen
export const addAdminEmail = async (email: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('admin_emails')
      .insert({ email: email.toLowerCase() })
    
    if (error) throw error
    return true
  } catch (error) {
    console.error('Error adding admin email:', error)
    return false
  }
}

// Functie om admin email te verwijderen
export const removeAdminEmail = async (email: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('admin_emails')
      .delete()
      .eq('email', email.toLowerCase())
    
    if (error) throw error
    return true
  } catch (error) {
    console.error('Error removing admin email:', error)
    return false
  }
}
