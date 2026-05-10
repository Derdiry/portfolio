import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Search } from 'lucide-react'
import { PROJECTS as FALLBACK_PROJECTS } from '@/data/projects'
import { CATEGORY_META, STATUS_META, ALL_CATEGORIES } from '@/components/projects/meta'
import type { ProjectCategory, ProjectStatus } from '@/types'
import Seo from '@/components/Seo'
import PageSkeleton from '@/components/PageSkeleton'
import { useApi } from '@/hooks/useApi'
import { getProjects, mapProject } from '@/lib/api'

type StatusFilter = ProjectStatus | 'all'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export default function Projects() {
  const [category, setCategory] = useState<ProjectCategory | 'all'>('all')
  const [status, setStatus]     = useState<StatusFilter>('all')
  const [search, setSearch]     = useState('')

  const { data: apiProjects, loading } = useApi(getProjects)

  const allProjects = useMemo(
    () => apiProjects?.map(mapProject) ?? FALLBACK_PROJECTS,
    [apiProjects]
  )

  const filtered = useMemo(() => {
    return allProjects.filter((p) => {
      const matchCat    = category === 'all' || p.category === category
      const matchStatus = status   === 'all' || p.status   === status
      const matchSearch = search.trim() === '' ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
        p.techStack.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      return matchCat && matchStatus && matchSearch
    }).sort((a, b) => a.priority - b.priority)
  }, [category, status, search, allProjects])

  if (loading && !apiProjects) return <PageSkeleton />

  return (
    <div className="pt-24 pb-20">
      <Seo title="Projects" description="Production ML systems by Mohamed Alderdiry — gold price forecasting, RAG chatbots, MLOps platforms, and industrial AI decision support." path="/projects" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="mb-10"
        >
          <p className="font-mono text-xs text-brand-accent uppercase tracking-[0.2em] mb-4">// all work</p>
          <h1 className="text-4xl sm:text-5xl font-display font-bold mb-3">Projects</h1>
          <p className="text-brand-muted text-sm max-w-xl">
            Production ML systems, MLOps infrastructure, and applied AI research.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
          className="flex flex-wrap gap-3 mb-3 items-center"
        >
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted" />
            <input
              type="text"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2 rounded-lg bg-brand-subtle border border-brand-border
                         text-[var(--color-text)] placeholder:text-brand-muted text-sm font-mono
                         focus:outline-none focus:border-brand-accent transition-colors duration-150"
            />
          </div>

          {/* Category dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ProjectCategory | 'all')}
            className="py-2 px-3 rounded-lg bg-brand-subtle border border-brand-border text-sm font-mono
                       text-brand-muted focus:outline-none focus:border-brand-accent transition-colors duration-150
                       cursor-pointer"
          >
            {ALL_CATEGORIES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          {/* Status dropdown */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className="py-2 px-3 rounded-lg bg-brand-subtle border border-brand-border text-sm font-mono
                       text-brand-muted focus:outline-none focus:border-brand-accent transition-colors duration-150
                       cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="complete">Complete</option>
            <option value="in_progress">In Progress</option>
            <option value="papers_in_prep">Papers in Prep</option>
          </select>
        </motion.div>

        {/* Results count */}
        <p className="text-brand-muted text-xs font-mono mb-6">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Project index */}
        <div className="divide-y divide-brand-border/60">
          {filtered.map((project, i) => {
            const cat = CATEGORY_META[project.category]
            const st  = STATUS_META[project.status]
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease }}
              >
                <Link
                  to={`/projects/${project.id}`}
                  className="group flex items-start gap-5 py-6 hover:bg-brand-subtle/20 -mx-4 px-4
                             transition-colors duration-150 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5 mb-2">
                      <span className={`tech-badge text-xs ${cat.color}`}>{cat.label}</span>
                      <span className={`flex items-center gap-1.5 text-xs font-medium ${st.color.split(' ')[0]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                        {st.label}
                      </span>
                    </div>
                    <h2 className="font-display font-semibold text-lg mb-1 group-hover:text-brand-accent transition-colors duration-150">
                      {project.title}
                    </h2>
                    <p className="text-brand-muted text-sm leading-relaxed line-clamp-2 mb-3">
                      {project.shortDescription}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.slice(0, 5).map((tech) => (
                        <span key={tech} className="tech-badge">{tech}</span>
                      ))}
                      {project.techStack.length > 5 && (
                        <span className="tech-badge">+{project.techStack.length - 5}</span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-brand-muted group-hover:text-brand-accent group-hover:translate-x-1 transition-all duration-150 flex-shrink-0 mt-1" />
                </Link>
              </motion.div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-brand-muted">
            <p className="text-lg font-display mb-3">No projects match those filters.</p>
            <button
              onClick={() => { setCategory('all'); setStatus('all'); setSearch('') }}
              className="text-brand-accent text-sm hover:underline font-mono"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
