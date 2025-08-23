import { useState, useEffect } from 'react'
import { useSupabase } from '../contexts/SupabaseContext'
import { Calendar, Home, ExternalLink, RefreshCw, Trophy } from 'lucide-react'
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
    
    // Start automatische updates van KOSC website
    scheduleMatchUpdates(supabase)
  }, [supabase])

  // Effect om echte wedstrijden op te halen als er geen wedstrijden zijn
  useEffect(() => {
    // Voorkom infinite loop - alleen uitvoeren bij eerste render
    const timer = setTimeout(() => {
      console.log('Eerste render timeout - probeer wedstrijden op te halen...');
      updateMatchesFromKosc();
    }, 2000); // Wacht 2 seconden voordat we proberen te updaten
    
    return () => clearTimeout(timer);
  }, []) // Alleen bij eerste render

  const fetchMatches = async () => {
    try {
      console.log('Ophalen wedstrijden uit database...');
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('match_date', { ascending: false })

      if (error) {
        console.error('Database error bij ophalen wedstrijden:', error);
        throw error;
      }
      
      console.log('Wedstrijden uit database:', data);
      setMatches(data || []);
    } catch (error) {
      console.error('Error fetching matches:', error);
      // Zorg ervoor dat loading state wordt gereset bij fout
      setLoading(false);
    } finally {
      setLoading(false);
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
      // Zorg ervoor dat loading state wordt gereset bij fout
      setLoading(false)
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

      {/* KOSC Website Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center">
            <Calendar className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Wedstrijdprogramma</h3>
            <p className="text-gray-600 mb-4">
              Bekijk alle aankomende wedstrijden van alle KOSC teams
            </p>
            <a
              href="https://www.kosc.nl/wedstrijdprogramma"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Ga naar KOSC Wedstrijden</span>
            </a>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center">
            <Trophy className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Uitslagen</h3>
            <p className="text-gray-600 mb-4">
              Bekijk alle resultaten van gespeelde wedstrijden
            </p>
            <a
              href="https://www.kosc.nl/uitslagen"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Ga naar KOSC Uitslagen</span>
            </a>
          </div>
        </div>
      </div>

      {/* Matches list */}
      <div className="bg-white shadow rounded-lg p-8 text-center">
        <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Wedstrijden worden geladen</h3>
        <p className="text-gray-500 mb-4">
          Voor de meest actuele wedstrijden en uitslagen, gebruik de knoppen hierboven om naar de officiële KOSC website te gaan.
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="https://www.kosc.nl/wedstrijdprogramma"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Wedstrijdprogramma
          </a>
          <a
            href="https://www.kosc.nl/uitslagen"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Uitslagen
          </a>
        </div>
      </div>


    </div>
  )
}
