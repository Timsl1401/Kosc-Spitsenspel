import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useSupabase } from '../contexts/SupabaseContext'
import { Trophy, Users, Calendar, Target, Download } from 'lucide-react'

interface UserStats {
  totalPoints: number
  teamValue: number
  playersCount: number
  goalsCount: number
}

export default function Dashboard() {
  const { user } = useAuth()
  const { supabase } = useSupabase()
  const [stats, setStats] = useState<UserStats>({
    totalPoints: 0,
    teamValue: 0,
    playersCount: 0,
    goalsCount: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchUserStats()
    }
  }, [user])

  const fetchUserStats = async () => {
    try {
      // Get user's team
      const { data: userTeam } = await supabase
        .from('user_teams')
        .select('*')
        .eq('user_id', user?.id)
        .eq('period', 'current')
        .single()

      if (userTeam) {
        const playerIds = userTeam.player_ids || []
        
        // Get players info
        const { data: players } = await supabase
          .from('players')
          .select('*')
          .in('id', playerIds)

        // Calculate stats
        let totalValue = 0
        let totalPoints = 0
        let goalsCount = 0

        if (players) {
          totalValue = players.reduce((sum, player) => sum + (player.price || 0), 0)
          goalsCount = players.reduce((sum, player) => sum + (player.goals_scored || 0), 0)
          
          // Calculate points based on goals scored and multipliers
          players.forEach(player => {
            totalPoints += (player.points_multiplier * (player.goals_scored || 0))
          })
        }

        setStats({
          totalPoints,
          teamValue: totalValue,
          playersCount: playerIds.length,
          goalsCount
        })
      } else {
        // User has no team yet
        setStats({
          totalPoints: 0,
          teamValue: 0,
          playersCount: 0,
          goalsCount: 0
        })
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kosc-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welkom, {user?.user_metadata?.first_name || 'Gebruiker'}!
        </h1>
        <p className="mt-2 text-gray-600">
          Hier vind je een overzicht van je KOSC Spitsenspel prestaties.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Trophy className="h-8 w-8 text-kosc-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Totaal punten</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalPoints}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-kosc-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Spelers in team</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.playersCount}/11</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Target className="h-8 w-8 text-kosc-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Doelpunten</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.goalsCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Trophy className="h-8 w-8 text-kosc-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Team waarde</p>
              <p className="text-2xl font-semibold text-gray-900">€{stats.teamValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Uitleg en regels</h3>
              <p className="mt-2 text-sm text-gray-500">
                Lees voordat je meespeelt eerst de uitleg en regels, zo weet je zeker dat alles goed gaat!
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link
                to="/rules"
                className="btn-primary"
              >
                Naar spelregels
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Toevoegen aan startscherm</h3>
              <p className="mt-2 text-sm text-gray-500">
                Ben je op zoek naar onze app? Lees hier hoe je het spitsenspel toevoegt aan je telefoon!
              </p>
            </div>
            <div className="flex-shrink-0">
              <button className="btn-primary">
                Toevoegen
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Statistieken vorig seizoen</h3>
              <p className="mt-2 text-sm text-gray-500">
                Download hier de statistieken van vorig seizoen en doe er je voordeel mee!
              </p>
            </div>
            <div className="flex-shrink-0">
              <button className="btn-primary">
                <Download className="mr-2 h-4 w-4" />
                Downloaden
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recente activiteit</h3>
        <div className="text-center text-gray-500 py-8">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2">Nog geen recente activiteit</p>
          <p className="text-sm">Je activiteit verschijnt hier zodra je spelers doelpunten maken</p>
        </div>
      </div>
    </div>
  )
}
