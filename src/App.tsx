import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { SupabaseProvider } from './contexts/SupabaseContext'
import { AuthProvider } from './contexts/AuthContext'
import { AdminProvider } from './contexts/AdminContext'
import Layout from './components/Layout'

// Alle pagina's importeren
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import Players from './pages/Players'
import Matches from './pages/Matches'
import Rankings from './pages/Rankings'
import Rules from './pages/Rules'
import Login from './pages/Login'
import Register from './pages/Register'
import AuthCallback from './pages/AuthCallback'
import Feedback from './pages/Feedback'

import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
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
  )
}

export default App
