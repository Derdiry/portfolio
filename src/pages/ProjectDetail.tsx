import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink, CheckCircle2, AlertCircle, BarChart2, X } from 'lucide-react'
import GithubIcon from '@/components/icons/GithubIcon'
import { getProjectById } from '@/data/projects'
import { CATEGORY_META, STATUS_META } from '@/components/projects/meta'
import Seo from '@/components/Seo'
import { useApi } from '@/hooks/useApi'
import { getProject, mapProject } from '@/lib/api'
import { getPhotoUrl } from '@/lib/api'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: apiProject } = useApi(id ? () => getProject(id) : null, [id])
  const staticProject = id ? getProjectById(id) : undefined
  const project = apiProject ? mapProject(apiProject) : staticProject
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const screenshots = project?.screenshots ?? []
  const lbUrl = lightboxIndex !== null ? (getPhotoUrl(screenshots[lightboxIndex]) ?? screenshots[lightboxIndex]) : null

  const lbPrev = () => setLightboxIndex(i => i !== null ? (i - 1 + screenshots.length) % screenshots.length : null)
  const lbNext = () => setLightboxIndex(i => i !== null ? (i + 1) % screenshots.length : null)

  useEffect(() => {
    if (lightboxIndex === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowLeft') lbPrev()
      if (e.key === 'ArrowRight') lbNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIndex, screenshots.length])

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-brand-muted pt-24">
        <p className="text-xl font-semibold">Project not found.</p>
        <Link to="/projects" className="btn-secondary">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>
      </div>
    )
  }

  const cat    = CATEGORY_META[project.category]
  const status = STATUS_META[project.status]

  return (
    <div className="pt-24 pb-20">
      <Seo title={project.title} description={project.shortDescription} path={`/projects/${project.id}`} type="article" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-brand-muted hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Projects
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`tech-badge text-sm px-3 py-1 ${cat.color}`}>{cat.label}</span>
            <span className={`flex items-center gap-1.5 text-sm font-medium ${status.color.split(' ')[0]}`}>
              <span className={`w-2 h-2 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-2">{project.title}</h1>
          <p className="text-xl text-brand-muted mb-6">{project.subtitle}</p>

          {/* Links */}
          <div className="flex flex-wrap gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm py-2 px-4"
              >
                <GithubIcon className="w-4 h-4" /> View Code
              </a>
            )}
            {project.demoUrl && project.demoUrl !== '#' && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm py-2 px-4"
              >
                <ExternalLink className="w-4 h-4" /> Live Demo
              </a>
            )}
          </div>
        </motion.div>

        {/* Screenshots gallery */}
        {project.screenshots && project.screenshots.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-10"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-brand-accent rounded-full" /> Screenshots
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {project.screenshots.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className="aspect-video rounded-lg overflow-hidden border border-brand-border hover:border-brand-accent/50 transition-colors"
                >
                  <img
                    src={getPhotoUrl(src) ?? src}
                    alt={`Screenshot ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Lightbox carousel */}
        {lightboxIndex !== null && lbUrl && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center gap-4 p-4"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between w-full max-w-5xl flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              <span className="text-white/50 text-sm font-mono">{lightboxIndex + 1} / {screenshots.length}</span>
              <button className="text-white/60 hover:text-white transition-colors" onClick={() => setLightboxIndex(null)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main image + arrows */}
            <div className="flex items-center gap-3 flex-1 min-h-0 w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
              {screenshots.length > 1 && (
                <button
                  className="flex-shrink-0 text-white/50 hover:text-white transition-colors p-1"
                  onClick={lbPrev}
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
              )}
              <img
                src={lbUrl}
                alt={`Screenshot ${lightboxIndex + 1}`}
                className="flex-1 min-w-0 max-h-[65vh] rounded-lg object-contain"
              />
              {screenshots.length > 1 && (
                <button
                  className="flex-shrink-0 text-white/50 hover:text-white transition-colors p-1"
                  onClick={lbNext}
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              )}
            </div>

            {/* Filmstrip */}
            {screenshots.length > 1 && (
              <div
                className="flex gap-2 overflow-x-auto max-w-5xl w-full flex-shrink-0 pb-1 scroll-smooth"
                style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.2) transparent' }}
                onClick={(e) => e.stopPropagation()}
              >
                {screenshots.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxIndex(i)}
                    className={`flex-shrink-0 h-14 w-24 rounded overflow-hidden transition-all
                      ${i === lightboxIndex ? 'ring-2 ring-brand-accent opacity-100' : 'opacity-40 hover:opacity-70'}`}
                  >
                    <img
                      src={getPhotoUrl(src) ?? src}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Description */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-10"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-brand-accent rounded-full" /> Overview
          </h2>
          <div className="space-y-4">
            {project.description.map((para, i) => (
              <p key={i} className="text-slate-400 leading-relaxed">{para}</p>
            ))}
          </div>
        </motion.section>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Problem */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass rounded-xl p-6"
          >
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" /> The Problem
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">{project.problem}</p>
          </motion.section>

          {/* Approach */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="glass rounded-xl p-6"
          >
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-brand-accent" /> Technical Approach
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">{project.approach}</p>
          </motion.section>
        </div>

        {/* Key Features */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-10"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-brand-accent rounded-full" /> Key Features
          </h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {project.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2.5 glass rounded-lg p-3">
                <CheckCircle2 className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" />
                <span className="text-slate-400 text-sm leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Tech Stack */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mb-10"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-brand-accent rounded-full" /> Tech Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-lg text-sm font-mono
                           bg-brand-subtle border border-brand-border text-brand-muted
                           hover:border-brand-accent/50 hover:text-brand-accent transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.section>

        {/* Results */}
        {project.results.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-10"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-emerald-400" /> Results & Metrics
            </h2>
            <div className="glass rounded-xl p-6">
              <ul className="space-y-3">
                {project.results.map((result, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5" />
                    <span className="text-slate-400 text-sm leading-relaxed">{result}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>
        )}

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="pt-8 border-t border-brand-border flex items-center justify-between"
        >
          <Link to="/projects" className="btn-secondary">
            <ArrowLeft className="w-4 h-4" /> All Projects
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
