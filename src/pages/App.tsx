import React from 'react';
import { Smartphone } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Smartphone className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            App toevoegen aan homescherm
          </h1>
          <p className="text-gray-600">
            Zo voeg je KOSC Spitsenspel toe aan je telefoon
          </p>
        </div>

        {/* iOS Instructies */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">🍎</span>
            <h2 className="text-2xl font-bold text-gray-900">iPhone/iPad</h2>
          </div>
          
          <div className="space-y-3">
            <p><strong>1.</strong> Open Safari en ga naar deze website</p>
            <p><strong>2.</strong> Tik op de deel knop onderaan (vierkant met pijl)</p>
            <p><strong>3.</strong> Kies "Voeg toe aan Homescherm"</p>
            <p><strong>4.</strong> Tik op "Voeg toe"</p>
          </div>
          
          <p className="mt-4 text-sm text-gray-600">
            Klaar! De app staat nu op je homescherm.
          </p>
        </div>

        {/* Android Instructies */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">🤖</span>
            <h2 className="text-2xl font-bold text-gray-900">Android</h2>
          </div>
          
          <div className="space-y-3">
            <p><strong>1.</strong> Open Chrome en ga naar deze website</p>
            <p><strong>2.</strong> Tik op de drie puntjes rechtsboven (⋮)</p>
            <p><strong>3.</strong> Kies "App installeren" of "Toevoegen aan startscherm"</p>
            <p><strong>4.</strong> Tik op "Installeren"</p>
          </div>
          
          <p className="mt-4 text-sm text-gray-600">
            Klaar! De app staat nu op je startscherm.
          </p>
        </div>

        {/* Extra Tips */}
        <div className="bg-gray-100 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Handig om te weten</h2>
          
          <div className="space-y-2 text-sm text-gray-700">
            <p>• De app werkt ook offline</p>
            <p>• Neemt bijna geen ruimte in beslag</p>
            <p>• Wordt automatisch bijgewerkt</p>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Problemen? Gebruik de FEEDBACK knop bovenaan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
