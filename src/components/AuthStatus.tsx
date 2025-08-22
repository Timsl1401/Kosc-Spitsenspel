import { useAuth } from '../contexts/AuthContext'

export default function AuthStatus() {
  const { user, session, loading, isEmailConfirmed } = useAuth()

  if (loading) {
    return <div className="text-sm text-gray-500">Loading auth...</div>
  }

  if (!user) {
    return <div className="text-sm text-gray-500">Not authenticated</div>
  }

  return (
    <div className="text-sm text-gray-500 space-y-1">
      <div>User ID: {user.id}</div>
      <div>Email: {user.email}</div>
      <div>Email Confirmed: {isEmailConfirmed ? 'Yes' : 'No'}</div>
      <div>Session: {session ? 'Active' : 'None'}</div>
    </div>
  )
}
