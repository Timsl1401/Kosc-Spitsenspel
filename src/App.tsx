import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { SupabaseProvider } from './contexts/SupabaseContext'
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
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Er is iets misgegaan</h2>
          <p className="text-gray-600 mb-4">
            Er is een onverwachte fout opgetreden. Probeer de pagina te verversen.
          </p>
          <button
            onClick={resetErrorBoundary}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Probeer opnieuw
          </button>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <SupabaseProvider>
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
      </SupabaseProvider>
    </ErrorBoundary>
  )
}

export default App
