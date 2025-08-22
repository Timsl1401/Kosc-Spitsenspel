import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthStatus from './AuthStatus';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
                     {/* Top Utility Bar */}
               <div className="kosc-header">
                 <div className="container mx-auto px-4 flex justify-between items-center">
                   <div className="flex space-x-6">
                     <Link to="/feedback" className="text-white hover:text-green-400 transition-colors">
                       FEEDBACK
                     </Link>
                   </div>
                 </div>
               </div>

      {/* Main Header with Logo */}
      <div className="kosc-header">
        <div className="container mx-auto px-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3 p-1">
                  <img
                    src="/kosc-logo.png"
                    alt="KOSC"
                    className="h-10 w-10 object-contain"
                  />
                </div>
                <div className="text-white">
                  <h1 className="text-2xl font-bold">KOSC</h1>
                  <p className="text-sm text-gray-300">1933 Ootmarsum</p>
                </div>
              </div>
            </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-white">Welkom, {user.user_metadata?.first_name || user.email}</span>
              <button
                onClick={handleSignOut}
                className="kosc-button"
              >
                Uitloggen
              </button>
            </div>
          )}
        </div>
      </div>

                     {/* Main Navigation */}
               <nav className="kosc-nav">
                 <div className="container mx-auto px-4">
                   {/* Mobile Navigation */}
                   <div className="md:hidden">
                     <button
                       onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                       className="text-white p-2"
                     >
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                       </svg>
                     </button>
                   </div>
                   
                   {/* Desktop Navigation */}
                   <div className="hidden md:flex space-x-1">
                     <Link
                       to="/"
                       className={`kosc-nav-item ${location.pathname === '/' ? 'bg-green-500 text-black' : ''}`}
                     >
                       HOME
                     </Link>
                     <Link
                       to="/matches"
                       className={`kosc-nav-item ${location.pathname === '/matches' ? 'bg-green-500 text-black' : ''}`}
                     >
                       WEDSTRIJDEN
                     </Link>
                     <Link
                       to="/teams"
                       className={`kosc-nav-item ${location.pathname === '/teams' ? 'bg-green-500 text-black' : ''}`}
                     >
                       TEAMS
                     </Link>
                     <Link
                       to="/rules"
                       className={`kosc-nav-item ${location.pathname === '/rules' ? 'bg-green-500 text-black' : ''}`}
                     >
                       REGELS
                     </Link>
                     {user && (
                       <Link
                         to="/dashboard"
                         className={`kosc-nav-item ${location.pathname === '/dashboard' ? 'bg-green-500 text-black' : ''}`}
                       >
                         DASHBOARD
                       </Link>
                     )}
                     {!user && (
                       <Link
                         to="/login"
                         className={`kosc-nav-item ${location.pathname === '/login' ? 'bg-green-500 text-black' : ''}`}
                       >
                         INLOGGEN
                       </Link>
                     )}
                     {!user && (
                       <Link
                         to="/register"
                         className={`kosc-nav-item ${location.pathname === '/register' ? 'bg-green-500 text-black' : ''}`}
                       >
                         REGISTREREN
                       </Link>
                     )}
                   </div>
                   
                   {/* Mobile Menu */}
                   {isMobileMenuOpen && (
                     <div className="md:hidden absolute top-full left-0 right-0 bg-gray-800 border-t border-gray-700 z-50">
                       <div className="flex flex-col space-y-1 p-4">
                         <Link
                           to="/"
                           className={`kosc-nav-item-mobile ${location.pathname === '/' ? 'bg-green-500 text-black' : ''}`}
                           onClick={() => setIsMobileMenuOpen(false)}
                         >
                           HOME
                         </Link>
                         <Link
                           to="/matches"
                           className={`kosc-nav-item-mobile ${location.pathname === '/matches' ? 'bg-green-500 text-black' : ''}`}
                           onClick={() => setIsMobileMenuOpen(false)}
                         >
                           WEDSTRIJDEN
                         </Link>
                         <Link
                           to="/teams"
                           className={`kosc-nav-item-mobile ${location.pathname === '/teams' ? 'bg-green-500 text-black' : ''}`}
                           onClick={() => setIsMobileMenuOpen(false)}
                         >
                           TEAMS
                         </Link>
                         <Link
                           to="/rules"
                           className={`kosc-nav-item-mobile ${location.pathname === '/rules' ? 'bg-green-500 text-black' : ''}`}
                           onClick={() => setIsMobileMenuOpen(false)}
                         >
                           REGELS
                         </Link>
                         {user && (
                           <Link
                             to="/dashboard"
                             className={`kosc-nav-item-mobile ${location.pathname === '/dashboard' ? 'bg-green-500 text-black' : ''}`}
                             onClick={() => setIsMobileMenuOpen(false)}
                           >
                             DASHBOARD
                           </Link>
                         )}
                         {!user && (
                           <Link
                             to="/login"
                             className={`kosc-nav-item-mobile ${location.pathname === '/login' ? 'bg-green-500 text-black' : ''}`}
                             onClick={() => setIsMobileMenuOpen(false)}
                           >
                             INLOGGEN
                           </Link>
                         )}
                         {!user && (
                           <Link
                             to="/register"
                             className={`kosc-nav-item-mobile ${location.pathname === '/register' ? 'bg-green-500 text-black' : ''}`}
                             onClick={() => setIsMobileMenuOpen(false)}
                           >
                             REGISTREREN
                           </Link>
                         )}
                       </div>
                     </div>
                   )}
                 </div>
               </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="kosc-footer">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">KOSC Spitsenspel</h3>
              <p className="text-gray-300">
                Voorspel wedstrijden en strijd om de hoogste score!
              </p>
            </div>
                                 <div>
                       <h3 className="text-lg font-semibold mb-4">Snelle Links</h3>
                       <ul className="space-y-2">
                         <li><Link to="/" className="text-gray-300 hover:text-green-400">Home</Link></li>
                         <li><Link to="/matches" className="text-gray-300 hover:text-green-400">Wedstrijden</Link></li>
                         <li><Link to="/rules" className="text-gray-300 hover:text-green-400">Regels</Link></li>
                         <li><Link to="/feedback" className="text-gray-300 hover:text-green-400">Feedback</Link></li>
                       </ul>
                     </div>
                     <div>
                       <h3 className="text-lg font-semibold mb-4">Meer Info</h3>
                       <p className="text-gray-300">
                         <a href="https://www.kosc.nl" className="hover:text-green-400">www.kosc.nl</a>
                       </p>
                     </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 KOSC Spitsenspel. Alle rechten voorbehouden.
            </p>
          </div>
        </div>
      </footer>

      {/* Debug Info */}
      <div className="fixed bottom-4 right-4">
        <AuthStatus />
      </div>
    </div>
  );
};

export default Layout;
