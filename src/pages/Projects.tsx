import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Github, ExternalLink, ArrowRight, Search } from 'lucide-react'
import { PROJECTS } from '@/data/projects'
import { CATEGORY_META, STATUS_META, ALL_CATEGORIES } from '@/components/projects/meta'
import type { ProjectCategory, ProjectStatus } from '@/types'
import Seo from '@/components/Seo'

type StatusFilter = ProjectStatus | 'all'

export default function Projects() {
  const [category, setCategory] = useState<ProjectCategory | 'all'>('all')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return PROJECTS.filter((p) => {
      const matchCat    = category === 'all' || p.category === category
      const matchStatus = status   === 'all' || p.status   === status
      const matchSearch = search.trim() === '' ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
        p.techStack.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      return matchCat && matchStatus && matchSearch
    }).sort((a, b) => a.priority - b.priority)
  }, [category, status, search])

  return (
    <div className="pt-24 pb-20">
      <Seo title="Projects" description="Production ML systems by Mohamed Alderdiry — gold price forecasting, RAG chatbots, MLOps platforms, and industrial AI decision support." path="/projects" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-brand-accent font-mono text-sm mb-2">// all work</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Projects</h1>
          <p className="text-brand-muted max-w-xl">
            Production ML systems, MLOps infrastructure, and applied AI research.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10 space-y-4"
        >
          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
            <input
              type="text"
              placeholder="Search projects or tech…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-brand-subtle border border-brand-border
                         text-white placeholder:text-brand-muted text-sm
                         focus:outline-none focus:border-brand-accent transition-colors"
            />
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {ALL_CATEGORIES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setCategory(value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  category === value
                    ? 'bg-brand-accent text-brand-bg'
                    : 'bg-brand-subtle border border-brand-border text-brand-muted hover:text-white hover:border-brand-accent/50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex flex-wrap gap-2">
            {(['all', 'complete', 'in_progress', 'papers_in_prep'] as StatusFilter[]).map((s) => {
              const label = s === 'all' ? 'All Status' : STATUS_META[s as ProjectStatus].label
              return (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    status === s
                      ? 'bg-brand-accent/20 border border-brand-accent text-brand-accent'
                      : 'bg-brand-subtle border border-brand-border text-brand-muted hover:text-white'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Results count */}
        <p className="text-brand-muted text-sm mb-6 font-mono">
          {filtered.length} project{filtered.length !== 1 ? 's' : ''} found
        </p>

        {/* Project grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((project, i) => {
            const cat = CATEGORY_META[project.category]
            const st  = STATUS_META[project.status]
            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="glass rounded-xl p-6 flex flex-col hover:border-brand-accent/40
                           transition-all duration-300 hover:shadow-lg hover:shadow-brand-accent/5
                           hover:-translate-y-0.5 group"
              >
                {/* Category + Status */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`tech-badge ${cat.color}`}>{cat.label}</span>
                  <span className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                    <span className={`text-xs font-medium ${st.color.split(' ')[0]}`}>{st.label}</span>
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-white mb-1 group-hover:text-brand-accent transition-colors">
                  {project.title}
                </h2>
                <p className="text-brand-muted text-xs mb-3">{project.subtitle}</p>
                <p className="text-slate-400 text-sm leading-relaxed flex-1 line-clamp-3">
                  {project.shortDescription}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1.5 mt-4 mb-5">
                  {project.techStack.slice(0, 5).map((tech) => (
                    <span key={tech} className="tech-badge">{tech}</span>
                  ))}
                  {project.techStack.length > 5 && (
                    <span className="tech-badge">+{project.techStack.length - 5}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-brand-border">
                  <Link
                    to={`/projects/${project.id}`}
                    className="flex items-center gap-1.5 text-sm font-medium text-brand-accent
                               hover:underline transition-colors"
                  >
                    View Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub repo"
                      className="ml-auto text-brand-muted hover:text-white transition-colors"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {project.demoUrl && project.demoUrl !== '#' && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Live demo"
                      className={project.githubUrl ? 'text-brand-muted hover:text-brand-accent transition-colors' : 'ml-auto text-brand-muted hover:text-brand-accent transition-colors'}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </motion.article>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-brand-muted">
            <p className="text-lg mb-2">No projects match those filters.</p>
            <button
              onClick={() => { setCategory('all'); setStatus('all'); setSearch('') }}
              className="text-brand-accent hover:underline text-sm"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
