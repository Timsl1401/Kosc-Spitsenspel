import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect ingelogde gebruikers naar dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="kosc-section text-center">
        <h1 className="kosc-title text-4xl mb-6">
          KOSC SPITSENSPEL
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Welkom bij het officiële KOSC Spitsenspel! Voorspel wedstrijden, 
          strijd om de hoogste score en word kampioen van het seizoen.
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

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="kosc-card text-center">
          <div className="text-4xl mb-4">⚽</div>
          <h3 className="text-xl font-semibold mb-3">Wedstrijden Voorspellen</h3>
          <p className="text-gray-600">
            Voorspel de uitslagen van alle KOSC wedstrijden en verdien punten.
          </p>
        </div>
        
        <div className="kosc-card text-center">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-xl font-semibold mb-3">Ranglijst</h3>
          <p className="text-gray-600">
            Strijd tegen andere spelers en beklim de ranglijst naar de top.
          </p>
        </div>
        
        <div className="kosc-card text-center">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold mb-3">Prijzen Winnen</h3>
          <p className="text-gray-600">
            De beste voorspellers winnen mooie prijzen aan het einde van het seizoen.
          </p>
        </div>
      </div>

      {/* How it Works */}
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
            <h3 className="font-semibold mb-2">Voorspel</h3>
            <p className="text-gray-600 text-sm">
              Voorspel wedstrijd uitslagen
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="font-semibold mb-2">Verdien Punten</h3>
            <p className="text-gray-600 text-sm">
              Krijg punten voor juiste voorspellingen
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
          Doe mee aan het KOSC Spitsenspel en toon je voetbalkennis!
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
