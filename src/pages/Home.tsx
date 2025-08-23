import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Stuur ingelogde gebruikers door naar hun dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="space-y-8">
      {/* Hoofdsectie met banner */}
      <div className="relative overflow-hidden rounded-lg shadow-lg">
        {/* Achtergrond afbeelding */}
        <div className="absolute inset-0">
          <img
            src="/FotoKosc Zwart Wit.jpg"
            alt="KOSC Voetbalwedstrijd"
            className="w-full h-full object-cover"
          />
          {/* Overlay voor betere leesbaarheid */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        {/* Content bovenop de afbeelding */}
        <div className="relative z-10 p-8 md:p-16 text-center text-white">
          <div className="max-w-4xl mx-auto">
            {/* Logo */}
            <div className="mb-6 flex justify-center">
              <img
                src="/Spitsenspellogo.png"
                alt="KOSC Spitsenspel Logo"
                className="h-24 md:h-32 object-contain"
              />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              KOSC SPITSENSPEL
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white">
              Welkom bij het officiële KOSC Spitsenspel! Koop en verkoop spelers, 
              verdien punten en strijd om de hoogste score in de ranglijst.
            </p>
            
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
                >
                  Start met spelen
                </Link>
                <Link
                  to="/login"
                  className="bg-white text-gray-800 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                >
                  Inloggen
                </Link>
              </div>
            ) : (
              <div className="flex justify-center">
                <Link
                  to="/dashboard"
                  className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
                >
                  Ga naar Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Wat kun je doen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-4xl mb-4">⚽</div>
          <h3 className="text-xl font-semibold mb-3">Spelers Kopen</h3>
          <p className="text-gray-600">
            Koop en verkoop KOSC spelers om je team samen te stellen.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-xl font-semibold mb-3">Punten Verdienen</h3>
          <p className="text-gray-600">
            Verdien punten wanneer je spelers doelpunten maken in wedstrijden.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold mb-3">Ranglijst</h3>
          <p className="text-gray-600">
            Strijd tegen andere spelers en beklim de ranglijst naar de top.
          </p>
        </div>
      </div>

      {/* Hoe werkt het */}
      <div className="bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Hoe werkt het?</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="font-semibold mb-2">Registreer</h3>
            <p className="text-gray-600 text-sm">
              Maak een gratis account aan
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="font-semibold mb-2">Stel Team Samen</h3>
            <p className="text-gray-600 text-sm">
              Koop en verkoop spelers
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="font-semibold mb-2">Verdien Punten</h3>
            <p className="text-gray-600 text-sm">
              Krijg punten voor doelpunten van je spelers
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              4
            </div>
            <h3 className="font-semibold mb-2">Win</h3>
            <p className="text-gray-600 text-sm">
              Word kampioen en win prijzen
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-center p-8 rounded-lg shadow">
        <h2 className="text-3xl font-bold mb-4">
          Klaar om te beginnen?
        </h2>
        <p className="text-xl mb-6 opacity-90">
          Doe mee aan het KOSC Spitsenspel en toon je team management skills!
        </p>
        {!user && (
          <Link
            to="/register"
            className="bg-white text-green-600 px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Registreer nu gratis
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home;
