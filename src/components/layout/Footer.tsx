import { PROFILE } from '@/data/profile'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-brand-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="font-display font-bold text-sm text-brand-muted">
            mo.alderdiry
          </span>
          <div className="flex items-center gap-5 text-sm text-brand-muted">
            <a href={`https://${PROFILE.github}`} target="_blank" rel="noopener noreferrer"
               className="hover:text-[var(--color-text)] transition-colors duration-150">
              GitHub
            </a>
            <a href={`https://${PROFILE.linkedin}`} target="_blank" rel="noopener noreferrer"
               className="hover:text-[var(--color-text)] transition-colors duration-150">
              LinkedIn
            </a>
            <a href={`mailto:${PROFILE.email}`}
               className="hover:text-[var(--color-text)] transition-colors duration-150">
              Email
            </a>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-4 pt-4 border-t border-brand-border/50">
          <p className="text-brand-muted text-xs font-mono">
            © {year} Mohamed Alderdiry
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="text-brand-muted hover:text-brand-accent transition-colors duration-150 text-xs font-mono"
          >
            ↑ top
          </button>
        </div>
      </div>
    </footer>
  )
}
