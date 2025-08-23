import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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

// Functie om punten per team te berekenen
export const getTeamPoints = (team: string): number => {
  switch (team) {
    case 'KOSC 1':
      return 3
    case 'KOSC 2':
      return 2.5
    case 'KOSC 3':
      return 2
    default:
      if (team.startsWith('KOSC ') && parseInt(team.split(' ')[1]) >= 4) {
        return 1
      }
      return 1
  }
}

// Functie om te checken of transfers toegestaan zijn (niet in weekend)
export const isTransferAllowed = (): boolean => {
  const today = new Date()
  const dayOfWeek = today.getDay() // 0 = zondag, 6 = zaterdag
  return dayOfWeek !== 0 && dayOfWeek !== 6
}

// Functie om gebruikerspunten te berekenen
export const calculateUserPoints = (goals: Goal[], userTeam: UserTeam[]): number => {
  let totalPoints = 0
  
  goals.forEach(goal => {
    const playerInTeam = userTeam.find(ut => 
      ut.player_id === goal.player_id && 
      ut.bought_at <= goal.created_at && 
      (ut.sold_at === null || ut.sold_at > goal.created_at)
    )
    
    if (playerInTeam) {
      // Zoek speler om team te vinden
      // Dit moet nog geïmplementeerd worden met echte speler opzoeken
      // Voor nu nemen we aan dat het doelpunt team informatie heeft
      totalPoints += 1 // Tijdelijke waarde
    }
  })
  
  return totalPoints
}
