import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// Removed SupabaseProvider; DB access is direct via lib/db
import { AuthProvider } from './contexts/AuthContext'
import { AdminProvider } from './contexts/AdminContext'
import Layout from './components/Layout'
import { ErrorBoundary } from 'react-error-boundary'

// Alle pagina's importeren
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import Players from './pages/Players'
import Matches from './pages/Matches'
import Rankings from './pages/Rankings'
import Rules from './pages/Rules'
import AppPage from './pages/App'
import Login from './pages/Login'
import Register from './pages/Register'
import AuthCallback from './pages/AuthCallback'
import Feedback from './pages/Feedback'

import ProtectedRoute from './components/ProtectedRoute'

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  const clearCache = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
        console.log('Service Worker cache cleared');
        window.location.reload();
      } catch (error) {
        console.error('Error clearing cache:', error);
        window.location.reload();
      }
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Er is iets misgegaan</h2>
          <p className="text-gray-600 mb-4">
            Er is een onverwachte fout opgetreden. Dit kan komen door een oude versie van de app.
          </p>
          {import.meta.env.DEV && (
            <details className="text-left text-sm text-gray-500 mb-4">
              <summary>Technische details (alleen in development)</summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
          <div className="space-y-3">
            <button
              onClick={resetErrorBoundary}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Probeer opnieuw
            </button>
            <button
              onClick={clearCache}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Cache legen & herladen
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  // PWA detection and handling
  React.useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         (window.navigator as any).standalone === true;
    
    if (isStandalone) {
      console.log('App running in PWA standalone mode');
      
      // Add PWA-specific error handling
      window.addEventListener('error', (event) => {
        console.error('PWA Error:', event.error);
        // Force reload if critical error in PWA mode
        if (event.error && event.error.message.includes('Loading')) {
          window.location.reload();
        }
      });
    }
  }, []);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthProvider>
        <AdminProvider>
            <Router>
              <Layout>
                <Routes>
                  {/* Publieke pagina's - geen login nodig */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/rules" element={<Rules />} />
                  <Route path="/app" element={<AppPage />} />
                  <Route path="/feedback" element={<Feedback />} />
                  
                  {/* Beveiligde pagina's - alleen voor ingelogde gebruikers */}
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/players" 
                    element={
                      <ProtectedRoute>
                        <Players />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/matches" 
                    element={
                      <ProtectedRoute>
                        <Matches />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/rankings" 
                    element={
                      <ProtectedRoute>
                        <Rankings />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </Layout>
            </Router>
          </AdminProvider>
        </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
