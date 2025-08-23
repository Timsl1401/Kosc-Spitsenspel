import React from 'react';
import { Smartphone, Download, Home, Star } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Smartphone className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            KOSC Spitsenspel App
          </h1>
          <p className="text-xl text-gray-600">
            Voeg de app toe aan je homescherm voor snelle toegang
          </p>
        </div>

        {/* Voordelen */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Download className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Snelle Toegang</h3>
            <p className="text-gray-600">
              Open de app direct vanaf je homescherm zonder browser
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Home className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">App-Ervaring</h3>
            <p className="text-gray-600">
              Geniet van een native app-ervaring op je telefoon
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Star className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Altijd Beschikbaar</h3>
            <p className="text-gray-600">
              De app staat altijd klaar op je homescherm
            </p>
          </div>
        </div>

        {/* iOS Instructies */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-black text-white p-3 rounded-full mr-4">
              <span className="text-2xl">🍎</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">iOS (iPhone/iPad)</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                1
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Open Safari</h3>
                <p className="text-gray-600">
                  Ga naar de KOSC Spitsenspel website in Safari op je iPhone of iPad
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                2
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Deel Knop</h3>
                <p className="text-gray-600">
                  Tik op de <strong>Deel knop</strong> (vierkant met pijl omhoog) onderaan het scherm
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                3
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Voeg toe aan Homescherm</h3>
                <p className="text-gray-600">
                  Scroll naar beneden en tik op <strong>"Voeg toe aan Homescherm"</strong>
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                4
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Bevestig</h3>
                <p className="text-gray-600">
                  Tik op <strong>"Voeg toe"</strong> om de app aan je homescherm toe te voegen
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <p className="text-blue-800">
              <strong>Tip:</strong> De app verschijnt nu als een icoon op je homescherm. Tik erop om KOSC Spitsenspel direct te openen!
            </p>
          </div>
        </div>

        {/* Android Instructies */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-green-600 text-white p-3 rounded-full mr-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Android</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                1
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Open Chrome</h3>
                <p className="text-gray-600">
                  Ga naar de KOSC Spitsenspel website in Chrome op je Android telefoon
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                2
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Menu Knop</h3>
                <p className="text-gray-600">
                  Tik op de <strong>drie puntjes</strong> (⋮) rechtsboven in de browser
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                3
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Installeer App</h3>
                <p className="text-gray-600">
                  Tik op <strong>"App installeren"</strong> of <strong>"Toevoegen aan startscherm"</strong>
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                4
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Bevestig</h3>
                <p className="text-gray-600">
                  Tik op <strong>"Installeren"</strong> om de app toe te voegen
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
            <p className="text-green-800">
              <strong>Tip:</strong> De app wordt nu geïnstalleerd en verschijnt als een icoon op je startscherm. Tik erop om KOSC Spitsenspel te openen!
            </p>
          </div>
        </div>

        {/* Extra Tips */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg shadow-md p-8 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">Extra Tips</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">📱 Offline Toegang</h3>
              <p className="text-green-100">
                De app werkt ook offline voor basis functionaliteiten zoals het bekijken van je team en de ranglijst
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3">🔔 Notificaties</h3>
              <p className="text-green-100">
                Je kunt notificaties inschakelen om op de hoogte te blijven van belangrijke updates
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3">⚡ Snelle Updates</h3>
              <p className="text-green-100">
                De app wordt automatisch bijgewerkt wanneer je verbonden bent met internet
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3">💾 Ruimte</h3>
              <p className="text-green-100">
                De app neemt slechts enkele MB ruimte in beslag op je telefoon
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Heb je problemen met het toevoegen van de app aan je homescherm?
          </p>
          <p className="text-gray-600">
            Neem contact op via de <strong>FEEDBACK</strong> knop bovenaan de pagina
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
