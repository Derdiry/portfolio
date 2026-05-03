import { Link } from 'react-router-dom'
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react'
import { PROFILE } from '@/data/profile'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-brand-border bg-brand-surface/30 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <p className="font-mono text-brand-accent font-bold mb-2">mo.alderdiry</p>
            <p className="text-brand-muted text-sm leading-relaxed">
              Applied Machine Learning Engineer building production AI systems.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-white font-semibold mb-3 text-sm">Quick Links</p>
            <div className="flex flex-col gap-2">
              {[
                { to: '/projects', label: 'Projects' },
                { to: '/about',    label: 'About'    },
                { to: '/resume',   label: 'Resume'   },
                { to: '/contact',  label: 'Contact'  },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-brand-muted hover:text-brand-accent text-sm transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <p className="text-white font-semibold mb-3 text-sm">Connect</p>
            <div className="flex flex-col gap-3">
              <a
                href={`https://${PROFILE.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-brand-muted hover:text-brand-accent text-sm transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
              <a
                href={`https://${PROFILE.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-brand-muted hover:text-brand-accent text-sm transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <a
                href={`mailto:${PROFILE.email}`}
                className="flex items-center gap-2 text-brand-muted hover:text-brand-accent text-sm transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-brand-border flex items-center justify-between">
          <p className="text-brand-muted text-xs">
            © {year} Mohamed Alderdiry. All rights reserved.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="p-2 rounded-lg text-brand-muted hover:text-brand-accent hover:bg-brand-subtle transition-all duration-200"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  )
}
