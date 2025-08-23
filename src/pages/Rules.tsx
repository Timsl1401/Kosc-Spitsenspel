import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Rules: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Hoofdsectie */}
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-green-600 mb-6">
          Spelregels KOSC Spitsenspel
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Hier vind je alle belangrijke regels en informatie over het KOSC Spitsenspel.
        </p>
        
        {user && (
          <div className="flex justify-center">
            <Link
              to="/dashboard"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Ga naar Dashboard
            </Link>
          </div>
        )}
      </div>

      {/* Spelregels */}
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-green-600 mb-6">Basis Spelregels</h2>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-3 text-green-600">Team Samenstelling</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Kies maximaal 15 spelers uit de spelerslijst (minder mag ook)</li>
              <li>• Totale teamwaarde mag maximaal €100.000 bedragen</li>
              <li>• Aan elke speler is een bepaalde prijs gekoppeld</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-3 text-green-600">Puntensysteem</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>KOSC 1:</strong> 3 punten per doelpunt</li>
              <li>• <strong>KOSC 2:</strong> 2,5 punten per doelpunt</li>
              <li>• <strong>KOSC 3:</strong> 2 punten per doelpunt</li>
              <li>• <strong>KOSC 4 t/m 8:</strong> 1 punt per doelpunt</li>
              <li>• <strong>Gastspelers:</strong> Krijgen punten van het team waarmee ze meespelen</li>
            </ul>
            <p className="mt-3 text-sm text-gray-600">
              <strong>Voorbeeld:</strong> Bas Bruns speelt mee met KOSC 1 en maakt 3 doelpunten. 
              Je krijgt dus 3 × 3 = 9 punten.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-3 text-green-600">Transfers & Deadlines</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Eerste deadline:</strong> Spelers kopen mogelijk tot [start_deadline datum]</li>
              <li>• <strong>Na deadline:</strong> Team is definitief, geen nieuwe aankopen meer</li>
              <li>• <strong>Uitzondering:</strong> Maximaal 3 nieuwe spelers kopen na start (indien budget en plek beschikbaar)</li>
              <li>• <strong>Verkopen:</strong> Geen limiet, altijd mogelijk</li>
              <li>• <strong>Weekend:</strong> Geen transfers op zaterdag en zondag</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-3 text-green-600">Belangrijke Punten</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Doelpunten:</strong> Alleen voor competitiewedstrijden (geen bekerwedstrijden)</li>
              <li>• <strong>Transfer punten:</strong> Je krijgt alleen punten vanaf het moment van aankoop</li>
              <li>• <strong>Verkochte spelers:</strong> Behouden hun reeds behaalde punten</li>
              <li>• <strong>Doelpunten updates:</strong> Worden wekelijks doorgegeven via WhatsApp groep</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-3 text-green-600">Ranglijst & Tiebreakers</h3>
            <p className="text-gray-700 mb-3">
              Bij gelijke stand wordt de volgende volgorde gehanteerd:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-gray-700">
              <li>Behaalde punten (aflopend)</li>
              <li>Teamwaarde (oplopend)</li>
              <li>Aantal verschillende doelpuntenmakers in de periode</li>
              <li>Datum van aanmelding (oplopend)</li>
            </ol>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-3 text-red-600">Verboden & Diskwalificatie</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Niet toegestaan:</strong> Na periode-einde spelers verkopen om teamwaarde te verlagen</li>
              <li>• <strong>Gevolg:</strong> Diskwalificatie en uitsluiting van deelname</li>
              <li>• <strong>Valsspelen:</strong> In welke vorm dan ook leidt tot diskwalificatie</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-3 text-green-600">Prijzen & Uitreiking</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Prijzen:</strong> Dienen persoonlijk in ontvangst genomen te worden</li>
              <li>• <strong>Datum & Locatie:</strong> Worden t.z.t. bekendgemaakt</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-center p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">
          Klaar om te beginnen?
        </h2>
        <p className="text-xl mb-6 opacity-90">
          Begrijp je alle regels? Start dan met het samenstellen van je team!
        </p>
        {!user ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-green-600 px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Registreer nu gratis
            </Link>
            <Link
              to="/login"
              className="bg-green-700 text-white px-8 py-4 rounded-md font-semibold text-lg hover:bg-green-800 transition-colors"
            >
              Inloggen
            </Link>
          </div>
        ) : (
          <Link
            to="/dashboard"
            className="bg-white text-green-600 px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Ga naar Dashboard
          </Link>
        )}
      </div>
    </div>
  );
};

export default Rules;
