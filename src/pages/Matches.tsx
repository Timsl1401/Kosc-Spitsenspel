import { useState, useEffect } from 'react'
import { useSupabase } from '../contexts/SupabaseContext'
import { Calendar, Home, ExternalLink } from 'lucide-react'

interface Match {
  id: string
  home_team: string
  away_team: string
  home_score: number | null
  away_score: number | null
  match_date: string
  is_competitive: boolean
}

export default function Matches() {
  const { supabase } = useSupabase()
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('match_date', { ascending: false })

      if (error) throw error
      setMatches(data || [])
    } catch (error) {
      console.error('Error fetching matches:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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
            <h1 className="text-2xl font-bold text-gray-900">Wedstrijden</h1>
            <p className="mt-2 text-gray-600">
              Bekijk alle KOSC wedstrijden en resultaten
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              <Calendar className="inline h-4 w-4 mr-1" />
              {matches.length} wedstrijden
            </div>
          </div>
        </div>
      </div>

      {/* Matches list */}
      <div className="space-y-4">
        {matches.map((match) => (
          <div key={match.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {formatDate(match.match_date)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {match.is_competitive && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-kosc-green-100 text-kosc-green-800">
                    Competitie
                  </span>
                )}
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {match.is_competitive ? 'Punten tellen' : 'Vriendschappelijk'}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Home className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-lg font-semibold text-gray-900">{match.home_team}</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {match.home_score !== null ? match.home_score : '-'}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-2">VS</div>
                <div className="text-xs text-gray-400">Kick-off</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-lg font-semibold text-gray-900">{match.away_team}</span>
                  <ExternalLink className="h-5 w-5 text-gray-400 ml-2" />
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {match.away_score !== null ? match.away_score : '-'}
                </div>
              </div>
            </div>
            
            {match.home_score !== null && match.away_score !== null && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <span className="text-sm text-gray-500">
                    Eindstand: {match.home_team} {match.home_score} - {match.away_score} {match.away_team}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {matches.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Geen wedstrijden gevonden</h3>
          <p className="mt-1 text-sm text-gray-500">
            Er zijn momenteel geen wedstrijden gepland.
          </p>
        </div>
      )}
    </div>
  )
}
