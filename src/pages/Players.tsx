import { useState, useEffect } from 'react'
import { fetchPlayers as dbFetchPlayers, type PlayerUI } from '../lib/db'
import { Users, Euro, Plus, Minus } from 'lucide-react'

interface Player extends PlayerUI {}

export default function Players() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlayers()
  }, [])

  const fetchPlayers = async () => {
    try {
      const data = await dbFetchPlayers()
      setPlayers(data)
    } catch (error) {
      console.error('Error fetching players:', error)
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
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Beschikbare Spelers</h1>
            <p className="mt-2 text-gray-600">
              Bekijk alle beschikbare KOSC spelers en stel je team samen
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              <Users className="inline h-4 w-4 mr-1" />
              {players.length} spelers beschikbaar
            </div>
          </div>
        </div>
      </div>

      {/* Players grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map((player) => (
          <div key={player.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{player.name}</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-kosc-green-100 text-kosc-green-800">
                {player.position}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Team:</span>
                <span className="text-sm font-medium text-gray-900">{player.team_name}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Punten per doelpunt:</span>
                <span className="text-sm font-medium text-gray-900">{player.points_multiplier}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Doelpunten:</span>
                <span className="text-sm font-medium text-gray-900">{player.goals_scored}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Prijs:</span>
                <span className="text-sm font-medium text-gray-900 flex items-center">
                  <Euro className="h-4 w-4 mr-1" />
                  {player.price.toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="mt-4 flex space-x-2">
              <button className="flex-1 btn-primary text-sm py-2">
                <Plus className="h-4 w-4 mr-1" />
                Kopen
              </button>
              <button className="flex-1 btn-secondary text-sm py-2">
                <Minus className="h-4 w-4 mr-1" />
                Verkopen
              </button>
            </div>
          </div>
        ))}
      </div>

      {players.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Geen spelers gevonden</h3>
          <p className="mt-1 text-sm text-gray-500">
            Er zijn momenteel geen spelers beschikbaar.
          </p>
        </div>
      )}
    </div>
  )
}
