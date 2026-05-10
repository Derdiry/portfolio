import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, CheckCircle2, AlertCircle, BarChart2, X } from 'lucide-react'
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
  const [lightbox, setLightbox] = useState<string | null>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null) }
    if (lightbox) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox])

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
                  onClick={() => setLightbox(getPhotoUrl(src) ?? src)}
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

        {/* Lightbox */}
        {lightbox && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white"
              onClick={() => setLightbox(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={lightbox}
              alt="Screenshot"
              className="max-w-full max-h-full rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
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
