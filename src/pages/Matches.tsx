import { useState, useEffect } from 'react'
import { useSupabase } from '../contexts/SupabaseContext'
import { Calendar, Home, ExternalLink, RefreshCw } from 'lucide-react'
import { VoetbalService, scheduleMatchUpdates } from '../services/voetbalService'

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
    
    // Start automatische updates van voetbal.nl
    scheduleMatchUpdates(supabase)
  }, [supabase])

  // Effect om echte wedstrijden op te halen als er geen wedstrijden zijn
  useEffect(() => {
    if (matches.length === 0 && !loading) {
      // Probeer echte wedstrijden op te halen van KOSC website
      updateMatchesFromKosc()
    }
  }, [matches.length, loading])

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

  const updateMatchesFromKosc = async () => {
    try {
      setLoading(true)
      console.log('Handmatige update van wedstrijden van KOSC website...')
      
      // Haal wedstrijden op van KOSC website
      const koscMatches = await VoetbalService.getAllKoscMatches()
      
      if (koscMatches.length > 0) {
        // Update database
        await VoetbalService.updateMatchesInDatabase(supabase, koscMatches)
        
        // Herlaad wedstrijden uit database
        await fetchMatches()
        
        console.log('Wedstrijden succesvol bijgewerkt van KOSC website')
      } else {
        console.log('Geen wedstrijden gevonden op KOSC website')
        // Toon bericht dat er geen wedstrijden zijn
        setMatches([])
      }
    } catch (error) {
      console.error('Fout bij bijwerken wedstrijden van KOSC website:', error)
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
            <button
              onClick={updateMatchesFromKosc}
              disabled={loading}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Update van KOSC website</span>
            </button>
          </div>
        </div>
      </div>

      {/* Matches list */}
      <div className="space-y-4">
        {matches.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Geen wedstrijden gevonden</h3>
            <p className="text-gray-500 mb-4">
              Er zijn momenteel geen wedstrijden gepland voor de KOSC teams.
            </p>
            <button
              onClick={updateMatchesFromKosc}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
            >
              {loading ? 'Zoeken...' : 'Zoek opnieuw'}
            </button>
          </div>
        ) : (
          matches.map((match) => (
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
        ))
        )}
      </div>


    </div>
  )
}
