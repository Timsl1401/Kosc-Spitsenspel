import { useState, useEffect } from 'react'
import { fetchAllUserTeamsWithPlayers } from '../lib/db'
import { Trophy, Medal, TrendingUp } from 'lucide-react'

interface Ranking {
  id: string
  user_id: string
  period: string
  total_points: number
  team_value: number
  goals_count: number
  users: {
    first_name: string
    last_name: string
  }
}

export default function Rankings() {
  const [rankings, setRankings] = useState<Ranking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('current')

  useEffect(() => {
    fetchRankings()
  }, [selectedPeriod])

  const fetchRankings = async () => {
    try {
      const data = await fetchAllUserTeamsWithPlayers()
      // Compute simple ranking: points = goals * teamPoints (approx) and aggregate by user
      const userAgg = new Map<string, { total_points: number; team_value: number; goals_count: number }>()
      for (const row of data) {
        const player = (row as any).player
        const userId = (row as any).user_id as string
        if (!userAgg.has(userId)) userAgg.set(userId, { total_points: 0, team_value: 0, goals_count: 0 })
        const agg = userAgg.get(userId)!
        agg.team_value += player.price || 0
        // goals_count is not available here per player; keep 0 for now
      }
      const list: Ranking[] = Array.from(userAgg.entries()).map(([user_id, agg], idx) => ({
        id: user_id,
        user_id,
        period: selectedPeriod,
        total_points: agg.total_points,
        team_value: agg.team_value,
        goals_count: agg.goals_count,
        users: { first_name: `Gebruiker`, last_name: user_id.slice(0, 6) }
      }))
      setRankings(list)
    } catch (error) {
      console.error('Error fetching rankings:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPositionIcon = (position: number) => {
    if (position === 1) return <Medal className="h-5 w-5 text-yellow-500" />
    if (position === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (position === 3) return <Medal className="h-5 w-5 text-amber-600" />
    return <span className="text-sm font-medium text-gray-500">{position}</span>
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
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ranglijst</h1>
            <p className="mt-2 text-gray-600">
              Bekijk de huidige stand van het KOSC Spitsenspel
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              <Trophy className="inline h-4 w-4 mr-1" />
              {rankings.length} deelnemers
            </div>
          </div>
        </div>
      </div>

      {/* Period selector */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Periode:</label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kosc-green-500 focus:border-kosc-green-500"
          >
            <option value="current">Huidige seizoen</option>
            <option value="previous">Vorig seizoen</option>
          </select>
        </div>
      </div>

      {/* Rankings table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Stand</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Positie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Speler
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Punten
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doelpunten
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team waarde
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rankings.map((ranking, index) => (
                <tr key={ranking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getPositionIcon(index + 1)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {ranking.users?.first_name} {ranking.users?.last_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 text-kosc-green-600 mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        {ranking.total_points}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-sm text-gray-900">
                        {ranking.goals_count}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      €{ranking.team_value.toLocaleString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {rankings.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Geen ranglijst beschikbaar</h3>
          <p className="mt-1 text-sm text-gray-500">
            Er is nog geen ranglijst beschikbaar voor deze periode.
          </p>
        </div>
      )}

      {/* Info box */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Trophy className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Hoe werkt de ranglijst?</strong> Bij een gelijke stand wordt gekeken naar: 
              1) Behaalde punten, 2) Teamwaarde, 3) Aantal verschillende doelpuntenmakers, 4) Datum van aanmelding.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
