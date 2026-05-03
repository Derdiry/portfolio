import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { BarChart2, Code2, ExternalLink, FolderOpen, List, LogOut, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: BarChart2 },
  { to: '/admin/profile',   label: 'Profile',   icon: User },
  { to: '/admin/projects',  label: 'Projects',  icon: FolderOpen },
  { to: '/admin/content',   label: 'Content',   icon: List },
]

export default function AdminLayout() {
  const { username, clearAuth } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAuth()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-brand-bg/90 backdrop-blur-sm border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Top row */}
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <Code2 className="w-6 h-6 text-brand-accent" />
              <span className="font-bold text-white">Admin</span>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1 text-sm text-brand-muted hover:text-brand-accent transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View Site
              </a>
              {username && (
                <span className="hidden sm:block text-sm text-brand-muted">
                  {username}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-brand-muted hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Nav row */}
          <div className="flex items-center gap-1 overflow-x-auto pb-px scrollbar-none">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium rounded-t whitespace-nowrap transition-colors border-b-2 ${
                    isActive
                      ? 'text-brand-accent border-brand-accent'
                      : 'text-brand-muted border-transparent hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
