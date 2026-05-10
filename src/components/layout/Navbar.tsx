import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Menu } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

const NAV_LINKS = [
  { to: '/',         label: 'Home'     },
  { to: '/projects', label: 'Projects' },
  { to: '/about',    label: 'About'    },
  { to: '/resume',   label: 'Resume'   },
  { to: '/contact',  label: 'Contact'  },
]

export default function Navbar() {
  const [open, setOpen]         = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggleTheme }  = useTheme()
  const { pathname }            = useLocation()

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-brand-bg/90 backdrop-blur-md border-b border-brand-border'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Monogram logo */}
            <Link
              to="/"
              className="font-display font-bold text-base text-brand-accent
                         border border-brand-accent/40 rounded px-2 py-0.5
                         hover:border-brand-accent hover:bg-brand-accent/5
                         transition-all duration-150"
            >
              MA
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `relative text-sm font-medium transition-colors duration-150 pb-0.5 ${
                      isActive
                        ? 'text-brand-accent'
                        : 'text-brand-muted hover:text-[var(--color-text)]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-indicator"
                          className="absolute bottom-[-3px] left-0 right-0 h-px bg-brand-accent"
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="text-brand-muted hover:text-[var(--color-text)] transition-colors duration-150 text-xs font-mono hidden md:block"
              >
                {theme === 'dark' ? 'light' : 'dark'}
              </button>
              <button
                onClick={() => setOpen((o) => !o)}
                aria-label="Toggle menu"
                className="md:hidden p-2 text-brand-muted hover:text-[var(--color-text)] transition-colors duration-150"
              >
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile: backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile: slide-in panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="fixed inset-y-0 right-0 w-72 bg-brand-surface border-l border-brand-border z-50 md:hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border">
              <span className="font-display font-bold text-brand-accent border border-brand-accent/40 rounded px-2 py-0.5 text-sm">
                MA
              </span>
              <button onClick={() => setOpen(false)} className="text-brand-muted hover:text-[var(--color-text)] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col px-4 py-6 gap-1 flex-1">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-3 rounded-lg font-display font-semibold text-lg transition-colors duration-150 ${
                      isActive
                        ? 'text-brand-accent bg-brand-accent/8'
                        : 'text-brand-muted hover:text-[var(--color-text)] hover:bg-brand-subtle'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
            <div className="px-6 py-5 border-t border-brand-border">
              <button
                onClick={toggleTheme}
                className="text-brand-muted hover:text-[var(--color-text)] transition-colors text-xs font-mono"
              >
                Switch to {theme === 'dark' ? 'light' : 'dark'} mode
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
