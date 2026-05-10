import { Link } from 'react-router-dom'
import { Linkedin, Mail, ArrowUp, Code2 } from 'lucide-react'
import GithubIcon from '@/components/icons/GithubIcon'
import { PROFILE } from '@/data/profile'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative mt-auto overflow-hidden">
      {/* Gradient separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-accent/40 to-transparent" />

      <div className="bg-brand-surface/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-accent to-brand-purple
                                flex items-center justify-center shadow-md shadow-brand-accent/20">
                  <Code2 className="w-3.5 h-3.5 text-brand-bg" />
                </div>
                <p className="font-mono text-sm bg-gradient-to-r from-brand-accent to-brand-purple
                               bg-clip-text text-transparent font-bold">
                  mo.alderdiry
                </p>
              </div>
              <p className="text-brand-muted text-sm leading-relaxed">
                Applied Machine Learning Engineer building production AI systems.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <p className="font-semibold mb-3 text-sm">Quick Links</p>
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
                    className="text-brand-muted hover:text-brand-accent text-sm transition-colors w-fit link-underline"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Social */}
            <div>
              <p className="font-semibold mb-3 text-sm">Connect</p>
              <div className="flex flex-col gap-3">
                <a
                  href={`https://${PROFILE.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-brand-muted hover:text-brand-accent text-sm transition-colors group w-fit"
                >
                  <Linkedin className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  LinkedIn
                </a>
                <a
                  href={`https://${PROFILE.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-brand-muted hover:text-brand-accent text-sm transition-colors group w-fit"
                >
                  <GithubIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  GitHub
                </a>
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="flex items-center gap-2 text-brand-muted hover:text-brand-accent text-sm transition-colors group w-fit"
                >
                  <Mail className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
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
              className="p-2 rounded-lg text-brand-muted hover:text-brand-accent hover:bg-brand-subtle
                         transition-all duration-200 hover:shadow-[0_0_12px_rgba(0,212,255,0.15)]"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
