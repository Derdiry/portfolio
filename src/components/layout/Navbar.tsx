import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Sun, Moon, Code2 } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

const NAV_LINKS = [
  { to: '/',        label: 'Home'     },
  { to: '/projects', label: 'Projects' },
  { to: '/about',   label: 'About'    },
  { to: '/resume',  label: 'Resume'   },
  { to: '/contact', label: 'Contact'  },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { pathname } = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-brand-bg/80 backdrop-blur-md border-b border-brand-border shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-mono font-bold text-brand-accent hover:opacity-80 transition-opacity"
          >
            <Code2 className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">mo.alderdiry</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-brand-accent bg-brand-accent/10'
                      : 'text-brand-muted hover:text-white hover:bg-brand-subtle'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-brand-muted hover:text-white hover:bg-brand-subtle transition-all duration-200"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
              className="md:hidden p-2 rounded-lg text-brand-muted hover:text-white hover:bg-brand-subtle transition-all duration-200"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden py-3 border-t border-brand-border">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-brand-accent bg-brand-accent/10'
                      : 'text-brand-muted hover:text-white hover:bg-brand-subtle'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>
    </header>
  )
}
