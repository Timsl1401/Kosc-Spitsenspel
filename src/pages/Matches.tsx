import { Calendar, ExternalLink, Trophy } from 'lucide-react'

export default function Matches() {

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Wedstrijden</h1>
          <p className="mt-2 text-gray-600">
            Bekijk alle KOSC wedstrijden en resultaten
          </p>
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
