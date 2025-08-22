import React from 'react';

const Rules: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="kosc-section text-center">
        <h1 className="kosc-title text-4xl mb-4">
          Spelregels KOSC Spitsenspel
        </h1>
        <p className="text-lg text-gray-600">
          Lees hier alle regels en voorwaarden voor het KOSC Spitsenspel
        </p>
      </div>

      {/* Main Rules Content */}
      <div className="kosc-section">
        <h2 className="kosc-title text-2xl mb-6">Hoe werkt het spel?</h2>
        
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-green-500">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Team Samenstelling
            </h3>
            <p className="text-gray-700 mb-4">
              Kies maximaal <strong>15 spelers</strong> uit de spelerslijst, minder dan 15 mag ook, 
              voor een totaalwaarde van <strong>€100.000</strong>. Aan elke speler is een bepaalde 
              prijs gekoppeld. Wanneer de speler die jij hebt gekozen een doelpunt maakt, 
              krijg je hiervoor punten.
            </p>
            <p className="text-gray-700">
              <strong>Belangrijk:</strong> Je krijgt alleen punten voor <strong>competitiewedstrijden</strong>.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Puntenverdeling per Team
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">KOSC 1:</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold">3 punten</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">KOSC 2:</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">2,5 punten</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">KOSC 3:</span>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-bold">2 punten</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">KOSC 4 t/m 8:</span>
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-bold">1 punt</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-purple-500">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Gastspelers
            </h3>
            <p className="text-gray-700">
              Wanneer een gastspeler scoort, krijgt deze de punten die tellen voor het team 
              waarbij de speler meespeelt. Je krijgt per doelpunt het aantal punten dat geldt 
              voor het team waarin de gastspeler mee deed.
            </p>
            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Voorbeeld:</strong> Bas Bruns speelt mee met KOSC 1 en maakt 3 doelpunten, 
                jij hebt Bas Bruns in je team en ontvangt dus <strong>3 × 3 = 9 punten</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transfer Rules */}
      <div className="kosc-section">
        <h2 className="kosc-title text-2xl mb-6">Transferregels</h2>
        
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-orange-500">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Spelers Kopen
            </h3>
            <p className="text-gray-700 mb-4">
              Het kopen van spelers is mogelijk tot <strong>[start_deadline datum]</strong>, 
              daarna is het niet meer mogelijk om spelers te kopen en is je team definitief! 
              Voor die tijd kun je zoveel wisselen als je wilt.
            </p>
            <p className="text-gray-700">
              Na de start van het spel is het nog wel mogelijk om maximaal <strong>3 nieuwe spelers</strong> te kopen. 
              Je moet hiervoor wel plek hebben in je selectie (max. 15 spelers) en voldoende budget.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-red-500">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Spelers Verkopen
            </h3>
            <p className="text-gray-700 mb-4">
              Aan het verkopen van spelers zit geen limiet. <strong>Let op:</strong> bij het transfereren 
              van een speler worden zijn reeds behaalde punten niet aan jouw puntentotaal toegevoegd. 
              Je krijgt enkel de punten die hij vanaf dat moment gaat binnenslepen.
            </p>
            <p className="text-gray-700">
              Hetzelfde geldt voor een speler die je verkoopt; de reeds behaalde punten van 
              deze speler blijven behouden.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-indigo-500">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Weekend Regel
            </h3>
            <p className="text-gray-700">
              In het weekend (<strong>zaterdag + zondag</strong>) is het niet mogelijk om spelers 
              te kopen of te verkopen.
            </p>
          </div>
        </div>
      </div>

      {/* Scoring & Rankings */}
      <div className="kosc-section">
        <h2 className="kosc-title text-2xl mb-6">Scoring & Ranglijst</h2>
        
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-green-500">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Doelpunten Registratie
            </h3>
            <p className="text-gray-700">
              De doelpunten worden iedere week doorgegeven door de leiders in een hiervoor 
              aangemaakte WhatsApp groep.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Gelijke Stand
            </h3>
            <p className="text-gray-700 mb-4">
              Bij een gelijke stand in een bepaalde periode wordt de volgende volgorde gehanteerd:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li><strong>Behaalde punten</strong> (aflopend)</li>
              <li><strong>Teamwaarde</strong> (oplopend)</li>
              <li><strong>Aantal verschillende doelpuntenmakers</strong> in deze periode</li>
              <li><strong>Datum van aanmelding</strong> (oplopend)</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Important Rules */}
      <div className="kosc-section">
        <h2 className="kosc-title text-2xl mb-6">Belangrijke Regels</h2>
        
        <div className="space-y-6">
          <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
            <h3 className="text-xl font-semibold mb-3 text-red-800">
              ⚠️ Diskwalificatie
            </h3>
            <p className="text-red-700 mb-4">
              Het is <strong>niet toegestaan</strong> om na het einde van een periode spelers te verkopen 
              om je teamwaarde omlaag te halen. Hiervoor word je <strong>gediskwalificeerd</strong>.
            </p>
            <p className="text-red-700">
              <strong>Valsspelen</strong>, in welke vorm dan ook, zal leiden tot diskwalificatie 
              en uitsluiting tot deelname.
            </p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
            <h3 className="text-xl font-semibold mb-3 text-green-800">
              🏆 Prijzen
            </h3>
            <p className="text-green-700">
              Prijzen dienen persoonlijk in ontvangst genomen te worden. 
              Datum en locatie worden t.z.t. bekendgemaakt.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="kosc-section bg-gradient-to-r from-green-500 to-green-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Klaar om te spelen?
        </h2>
        <p className="text-xl mb-6 opacity-90">
          Begrijp je alle regels? Start dan met het samenstellen van je team!
        </p>
        <a
          href="/dashboard"
          className="bg-white text-green-600 px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-100 transition-colors inline-block"
        >
          Ga naar Dashboard
        </a>
      </div>
    </div>
  );
};

export default Rules;
