import { Link } from 'react-router-dom'
import { BookOpen, Trophy, Users, Calendar, Target, AlertTriangle } from 'lucide-react'

export default function Rules() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center">
          <BookOpen className="h-8 w-8 text-kosc-green-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Spelregels KOSC Spitsenspel</h1>
            <p className="text-gray-600">Lees hier hoe het spel werkt en wat de regels zijn</p>
          </div>
        </div>
      </div>

      {/* Rules content */}
      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Team samenstelling:</strong> Kies maximaal 11 spelers uit de spelerslijst, 
                minder dan 11 mag ook, voor een totaalwaarde van €50.000. Aan elke speler is een 
                bepaalde prijs gekoppeld.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Calendar className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Punten verdienen:</strong> Je krijgt alleen punten voor <strong>competitiewedstrijden</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Target className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                <strong>Punten per doelpunt:</strong><br />
                • KOSC 1: <strong>3 punten</strong><br />
                • KOSC 2: <strong>2,5 punten</strong><br />
                • KOSC 3: <strong>2 punten</strong><br />
                • KOSC 4 t/m 8: <strong>1 punt</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Gastspelers:</strong> Wanneer een gastspeler scoort, krijgt deze de punten die 
                tellen voor het team waarbij de speler meespeelt. Voorbeeld: Bas Bruns speelt mee met 
                KOSC 1 en maakt 3 doelpunten, jij hebt Bas Bruns in je team en ontvangt dus 3 × 3 = 9 punten.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border-l-4 border-purple-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Calendar className="h-5 w-5 text-purple-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-purple-700">
                <strong>Transfer deadline:</strong> Het kopen van spelers is mogelijk tot 1 september, 
                daarna is het niet meer mogelijk om spelers te kopen en is je team definitief! Voor die 
                tijd kun je zoveel wisselen als je wilt.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Users className="h-5 w-5 text-orange-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-orange-700">
                <strong>Transfers na deadline:</strong> Na de start van het spel is het nog wel mogelijk 
                om maximaal 3 nieuwe spelers te kopen. Je moet hiervoor wel plek hebben in je selectie 
                (max. 11 spelers) en voldoende budget. Aan het verkopen van spelers zit geen limiet.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <strong>Belangrijk:</strong> Bij het transfereren van een speler worden zijn reeds behaalde 
                punten niet aan jouw puntentotaal toegevoegd. Je krijgt enkel de punten die hij vanaf dat 
                moment gaat binnenslepen. Hetzelfde geldt voor een speler die je verkoopt; de reeds behaalde 
                punten van deze speler blijven behouden.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border-l-4 border-gray-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-700">
                <strong>Weekend transfers:</strong> In het weekend (za+zo) is het niet mogelijk om spelers 
                te kopen of te verkopen.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Trophy className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Doelpunten registratie:</strong> De doelpunten worden iedere week doorgegeven door 
                de leiders in een hiervoor aangemaakte WhatsApp groep.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Trophy className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                <strong>Gelijke stand:</strong> Bij een gelijke stand in een bepaalde periode wordt de volgende 
                volgorde gehanteerd:<br />
                1. Behaalde punten (aflopend)<br />
                2. Teamwaarde (oplopend)<br />
                3. Het aantal verschillende doelpuntenmakers in deze periode<br />
                4. Datum van aanmelding (oplopend)
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <strong>Diskwalificatie:</strong> Het is niet toegestaan om na het einde van een periode 
                spelers te verkopen om je teamwaarde omlaag te halen, hiervoor word je gediskwalificeerd.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Trophy className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Prijzen:</strong> Prijzen dienen persoonlijk in ontvangst genomen te worden. 
                Datum en locatie worden t.z.t. bekendgemaakt.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <strong>Valsspelen:</strong> Valsspelen, in welke vorm dan ook, zal leiden tot 
                diskwalificatie en uitsluiting tot deelname.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Klaar om te beginnen?</h3>
        <p className="text-gray-600 mb-4">
          Nu je de regels kent, kun je beginnen met het samenstellen van je team!
        </p>
        <Link
          to="/players"
          className="btn-primary"
        >
          Bekijk beschikbare spelers
        </Link>
      </div>
    </div>
  )
}
