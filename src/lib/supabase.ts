import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for simplified schema
export interface Database {
  public: {
    Tables: {
      players: {
        Row: {
          id: string
          name: string
          position: string
          team_name: string
          team_level: number
          points_multiplier: number
          price: number
          goals_scored: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          position: string
          team_name: string
          team_level: number
          points_multiplier: number
          price: number
          goals_scored?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          position?: string
          team_name?: string
          team_level?: number
          points_multiplier?: number
          price?: number
          goals_scored?: number
          created_at?: string
          updated_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          home_team: string
          away_team: string
          home_score: number | null
          away_score: number | null
          match_date: string
          is_competitive: boolean
          created_at: string
        }
        Insert: {
          id?: string
          home_team: string
          away_team: string
          home_score?: number | null
          away_score?: number | null
          match_date: string
          is_competitive?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          home_team?: string
          away_team?: string
          home_score?: number | null
          away_score?: number | null
          match_date?: string
          is_competitive?: boolean
          created_at?: string
        }
      }
      user_teams: {
        Row: {
          id: string
          user_id: string
          player_ids: string[]
          total_points: number
          team_value: number
          goals_count: number
          period: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          player_ids: string[]
          total_points?: number
          team_value?: number
          goals_count?: number
          period?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          player_ids?: string[]
          total_points?: number
          team_value?: number
          goals_count?: number
          period?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      team_overview: {
        Row: {
          team_name: string
          team_level: number
          points_multiplier: number
          player_count: number
          total_value: number
          total_goals: number
        }
      }
    }
    Functions: {
      calculate_user_points: {
        Args: {
          user_uuid: string
          period_name?: string
        }
        Returns: number
      }
    }
  }
}
