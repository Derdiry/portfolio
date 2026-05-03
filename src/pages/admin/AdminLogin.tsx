import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Code2, LogIn } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { login } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await login(username, password)
      setAuth(data.access_token, username)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Code2 className="w-8 h-8 text-brand-accent" />
          <span className="text-2xl font-bold text-white">Admin</span>
        </div>

        <div className="glass rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white mb-2">Sign In</h1>
          <p className="text-brand-muted mb-6">Access the portfolio admin panel</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-brand-muted mb-1.5">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="w-full px-4 py-2.5 rounded-lg bg-brand-subtle border border-brand-border text-white placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-colors"
                placeholder="admin"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-brand-muted mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-2.5 rounded-lg bg-brand-subtle border border-brand-border text-white placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
