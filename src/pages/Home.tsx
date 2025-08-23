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
      {/* Hoofdsectie */}
      <div className="kosc-section text-center">
        <h1 className="kosc-title text-4xl mb-6">
          KOSC SPITSENSPEL
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Welkom bij het officiële KOSC Spitsenspel! Koop en verkoop spelers, 
          verdien punten en strijd om de hoogste score in de ranglijst.
        </p>
        
        {!user ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="kosc-button text-lg px-8 py-4"
            >
              Start met spelen
            </Link>
            <Link
              to="/login"
              className="kosc-button bg-gray-600 hover:bg-gray-700 text-lg px-8 py-4"
            >
              Inloggen
            </Link>
          </div>
        ) : (
          <div className="flex justify-center">
            <Link
              to="/dashboard"
              className="kosc-button text-lg px-8 py-4"
            >
              Ga naar Dashboard
            </Link>
          </div>
        )}
      </div>

      {/* Wat kun je doen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="kosc-card text-center">
          <div className="text-4xl mb-4">⚽</div>
          <h3 className="text-xl font-semibold mb-3">Spelers Kopen</h3>
          <p className="text-gray-600">
            Koop en verkoop KOSC spelers om je team samen te stellen.
          </p>
        </div>
        
        <div className="kosc-card text-center">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-xl font-semibold mb-3">Punten Verdienen</h3>
          <p className="text-gray-600">
            Verdien punten wanneer je spelers doelpunten maken in wedstrijden.
          </p>
        </div>
        
        <div className="kosc-card text-center">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold mb-3">Ranglijst</h3>
          <p className="text-gray-600">
            Strijd tegen andere spelers en beklim de ranglijst naar de top.
          </p>
        </div>
      </div>

      {/* Hoe werkt het */}
      <div className="kosc-section">
        <h2 className="kosc-title">Hoe werkt het?</h2>
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
      <div className="kosc-section bg-gradient-to-r from-green-500 to-green-600 text-white text-center">
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
