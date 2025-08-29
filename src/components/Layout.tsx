import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Fout bij uitloggen:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
                     {/* Hoofdheader met logo, feedback en uitlog */}
               <div className="kosc-header" style={{ backgroundImage: "url('/kosc-field.svg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
                 <div className="container mx-auto px-4 py-4">
                   <div className="grid grid-cols-3 items-center">
                     {/* Feedback link links */}
                     <div className="flex justify-start">
                       <Link to="/feedback" className="text-white hover:text-green-400 transition-colors text-sm md:text-base">
                         FEEDBACK
                       </Link>
                     </div>

                     {/* Groot transparant logo in het midden */}
                     <div className="flex justify-center items-center w-full">
                       <div className="text-center w-full">
                         <div className="flex justify-center">
                           <div className="bg-white rounded-full p-2 md:p-3 lg:p-4">
                             <img
                               src="/Spitsenspellogo.png"
                               alt="KOSC Spitsenspel"
                               className="h-10 md:h-14 lg:h-18 object-contain"
                             />
                           </div>
                         </div>
                         <div className="text-white font-bold text-lg md:text-xl lg:text-2xl mt-2">
                           KOSC SPITSENSPEL
                         </div>
                       </div>
                     </div>

                     {/* Uitlog knop rechts (alleen als user ingelogd is) */}
                     <div className="flex justify-end">
                       {user && (
                         <div className="flex items-center space-x-2 md:space-x-4">
                           <span className="text-white text-sm md:text-base hidden sm:block">Welkom, {user.user_metadata?.first_name || user.email}</span>
                           <button
                             onClick={handleSignOut}
                             className="bg-red-600 hover:bg-red-700 text-white text-sm md:text-base px-3 py-2 md:px-4 md:py-2 rounded-md transition-colors"
                           >
                             Uitloggen
                           </button>
                         </div>
                       )}
                     </div>
                   </div>
                 </div>
               </div>

                     {/* Hoofdnavigatie */}
               <nav className="kosc-nav">
                 <div className="container mx-auto px-4">
                   {/* Mobiele navigatie */}
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
                   
                   {/* Desktop navigatie */}
                   <div className="hidden md:flex space-x-1">
                     {user ? (
                       <Link
                         to="/dashboard"
                         className={`px-4 py-2 text-white hover:bg-green-500 hover:text-black transition-colors rounded ${location.pathname === '/dashboard' ? 'bg-green-500 text-black' : ''}`}
                       >
                         HOME
                       </Link>
                     ) : (
                       <Link
                         to="/"
                         className={`px-4 py-2 text-white hover:bg-green-500 hover:text-black transition-colors rounded ${location.pathname === '/' ? 'bg-green-500 text-black' : ''}`}
                       >
                         HOME
                       </Link>
                     )}
                     <Link
                       to="/matches"
                       className={`px-4 py-2 text-white hover:bg-green-500 hover:text-black transition-colors rounded ${location.pathname === '/matches' ? 'bg-green-500 text-black' : ''}`}
                     >
                       WEDSTRIJDEN
                     </Link>

                     <Link
                       to="/rules"
                       className={`px-4 py-2 text-white hover:bg-green-500 hover:text-black transition-colors rounded ${location.pathname === '/rules' ? 'bg-green-500 text-black' : ''}`}
                     >
                       REGELS
                     </Link>
                     <Link
                       to="/app"
                       className={`px-4 py-2 text-white hover:bg-green-500 hover:text-black transition-colors rounded ${location.pathname === '/app' ? 'bg-green-500 text-black' : ''}`}
                     >
                       APP
                     </Link>
                     {user && isAdmin && (
                       <Link
                         to="/admin"
                         className={`px-4 py-2 text-white hover:bg-green-500 hover:text-black transition-colors rounded ${location.pathname === '/admin' ? 'bg-green-500 text-black' : ''}`}
                       >
                         ADMIN
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
                   
                   {/* Mobiel menu */}
                   {isMobileMenuOpen && (
                     <div className="md:hidden absolute top-full left-0 right-0 bg-gray-800 border-t border-gray-700 z-50">
                       <div className="flex flex-col space-y-1 p-4">
                         {user ? (
                           <Link
                             to="/dashboard"
                             className={`px-4 py-2 text-white hover:bg-green-500 hover:text-black transition-colors rounded ${location.pathname === '/dashboard' ? 'bg-green-500 text-black' : ''}`}
                             onClick={() => setIsMobileMenuOpen(false)}
                           >
                             HOME
                           </Link>
                         ) : (
                           <Link
                             to="/"
                             className={`px-4 py-2 text-white hover:bg-green-500 hover:text-black transition-colors rounded ${location.pathname === '/' ? 'bg-green-500 text-black' : ''}`}
                             onClick={() => setIsMobileMenuOpen(false)}
                           >
                             HOME
                           </Link>
                         )}
                         <Link
                           to="/matches"
                           className={`px-4 py-2 text-white hover:bg-green-500 hover:text-black transition-colors rounded ${location.pathname === '/matches' ? 'bg-green-500 text-black' : ''}`}
                           onClick={() => setIsMobileMenuOpen(false)}
                         >
                           WEDSTRIJDEN
                         </Link>

                         <Link
                           to="/rules"
                           className={`px-4 py-2 text-white hover:bg-green-500 hover:text-black transition-colors rounded ${location.pathname === '/rules' ? 'bg-green-500 text-black' : ''}`}
                           onClick={() => setIsMobileMenuOpen(false)}
                         >
                           REGELS
                         </Link>
                         <Link
                           to="/app"
                           className={`px-4 py-2 text-white hover:bg-green-500 hover:text-black transition-colors rounded ${location.pathname === '/app' ? 'bg-green-500 text-black' : ''}`}
                           onClick={() => setIsMobileMenuOpen(false)}
                         >
                           APP
                         </Link>
                         {user && isAdmin && (
                           <Link
                             to="/admin"
                             className={`kosc-nav-item-mobile ${location.pathname === '/admin' ? 'bg-green-500 text-black' : ''}`}
                             onClick={() => setIsMobileMenuOpen(false)}
                           >
                             ADMIN
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

             {/* Hoofdinhoud */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

                     {/* Voettekst */}
               <footer className="kosc-footer">
                 <div className="container mx-auto px-4">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                     <div>
                       <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">KOSC Spitsenspel</h3>
                       <p className="text-gray-300 text-sm md:text-base">
                         Koop en verkoop spelers, verdien punten voor doelpunten!
                       </p>
                     </div>
                     <div>
                       <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Snelle Links</h3>
                       <ul className="space-y-1 md:space-y-2">
                         <li><Link to={user ? "/dashboard" : "/"} className="text-gray-300 hover:text-green-400 text-sm md:text-base">Home</Link></li>
                         <li><Link to="/rules" className="text-gray-300 hover:text-green-400 text-sm md:text-base">Regels</Link></li>
                         <li><Link to="/feedback" className="text-gray-300 hover:text-green-400 text-sm md:text-base">Feedback</Link></li>
                       </ul>
                     </div>
                     <div>
                       <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Meer Info</h3>
                       <p className="text-gray-300 text-sm md:text-base">
                         <a href="https://www.kosc.nl" className="hover:text-green-400">www.kosc.nl</a>
                       </p>
                     </div>
                   </div>
                   <div className="border-t border-gray-700 mt-6 md:mt-8 pt-6 md:pt-8 text-center">
                     <div className="flex flex-col items-center space-y-4">
                       {/* KOSC Logo */}
                       <div className="flex items-center justify-center">
                         <img
                           src="/kosc-logo.png"
                           alt="KOSC Logo"
                           className="h-16 w-auto object-contain"
                         />
                       </div>
                       <p className="text-gray-400 text-sm md:text-base">
                         © 2025 KOSC Spitsenspel. Alle rechten voorbehouden.
                       </p>
                     </div>
                   </div>
                 </div>
               </footer>

      
    </div>
  );
};

export default Layout;
