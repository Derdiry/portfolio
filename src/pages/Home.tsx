import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Award, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import { useApi } from '@/hooks/useApi'
import { getProjects, getProfile, mapProject, getPhotoUrl } from '@/lib/api'
import { PROJECTS as FALLBACK_PROJECTS } from '@/data/projects'
import { PROFILE as FALLBACK_PROFILE } from '@/data/profile'
import { CATEGORY_META, STATUS_META } from '@/components/projects/meta'
import Seo from '@/components/Seo'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
}
const stagger = { show: { transition: { staggerChildren: 0.08 } } }

const STATS = [
  { value: 36,  suffix: '',  label: 'Models Trained'     },
  { value: 5,   suffix: '+', label: 'Production Projects' },
  { value: 1,   suffix: '',  label: 'Patent'              },
  { value: 7,   suffix: '',  label: 'Tech Stacks'         },
]

function useCountUp(target: number, duration = 1000, active = false) {
  const [count, setCount] = useState(0)
  const raf = useRef<number>(0)
  useEffect(() => {
    if (!active) return
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setCount(Math.round(eased * target))
      if (t < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration, active])
  return count
}

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const [active, setActive] = useState(false)
  const count = useCountUp(value, 900, active)
  return (
    <motion.div
      className="text-center"
      onViewportEnter={() => setActive(true)}
      viewport={{ once: true }}
    >
      <p className="stat-number text-4xl text-[var(--color-text)] mb-0.5">
        {count}<span className="text-2xl text-brand-accent">{suffix}</span>
      </p>
      <p className="text-brand-muted text-xs font-mono uppercase tracking-widest">{label}</p>
    </motion.div>
  )
}

export default function Home() {
  const { data: apiProjects, loading: projectsLoading } = useApi(getProjects)
  const { data: apiProfile,  loading: profileLoading  } = useApi(getProfile)

  const projects = (apiProjects?.map(mapProject) ?? FALLBACK_PROJECTS)
    .filter((p) => p.featured)
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3)

  const profile = apiProfile ?? {
    name:      FALLBACK_PROFILE.name,
    title:     FALLBACK_PROFILE.title,
    email:     FALLBACK_PROFILE.email,
    phone:     FALLBACK_PROFILE.phone,
    linkedin:  FALLBACK_PROFILE.linkedin,
    github:    FALLBACK_PROFILE.github,
    location:  FALLBACK_PROFILE.location,
    photo_url: null as string | null,
    bio:       FALLBACK_PROFILE.bio,
    patent:    FALLBACK_PROFILE.patent,
  }

  const photoUrl = profile.photo_url ? getPhotoUrl(profile.photo_url) : null
  const [nameParts] = [profile.name.split(' ')]

  return (
    <div>
      <Seo
        title="Home"
        description="Mohamed Alderdiry — Applied ML Engineer building production AI systems across computer vision, time series forecasting, and NLP/RAG."
        path="/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Mohamed Alderdiry",
          "jobTitle": "Applied Machine Learning Engineer",
          "email": "mod.derdiry@gmail.com",
          "url": "https://moderdiry.com",
          "sameAs": [
            "https://www.linkedin.com/in/mohamedalderdiry",
            "https://github.com/mohamedalderdiry"
          ]
        }}
      />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden hero-bg">

        {/* Subtle ambient glow — gold tone */}
        <div className="pointer-events-none absolute -top-64 -left-32 w-[600px] h-[600px] rounded-full bg-brand-accent/5 blur-[140px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-brand-signal/4 blur-[120px]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28 pb-16 relative z-10">
          <div className="grid lg:grid-cols-11 gap-12 lg:gap-16 items-center">

            {/* ── Left: editorial text ── */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="lg:col-span-6"
            >
              <motion.p variants={fadeUp} className="font-mono text-xs text-brand-accent uppercase tracking-[0.2em] mb-6">
                APPLIED ML ENGINEER · RIYADH, SA
              </motion.p>

              <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight leading-[0.95] mb-5">
                {nameParts[0]}<br />
                <span className="gradient-text">{nameParts.slice(1).join(' ')}</span>
              </motion.h1>

              <motion.div variants={fadeUp} className="w-14 h-0.5 bg-brand-accent mb-6" />

              <motion.p variants={fadeUp} className="text-brand-muted leading-relaxed mb-8 max-w-lg text-base">
                Building production AI systems that bridge research and real-world infrastructure.
                Gold forecasting. Industrial anomaly detection. RAG pipelines.
              </motion.p>

              {/* Patent strip */}
              <motion.div variants={fadeUp} className="flex items-start gap-3 mb-8 py-3 border-y border-brand-border/50">
                <Award className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" />
                <p className="text-xs font-mono text-brand-muted leading-relaxed">
                  <span className="text-brand-accent">{profile.patent.number}</span>
                  {' — '}{profile.patent.title}
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-8">
                <Link to="/projects" className="btn-primary">
                  View Work <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/contact" className="btn-secondary">
                  Contact
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} className="flex items-center gap-5 text-sm text-brand-muted">
                <a href={`https://${profile.github}`} target="_blank" rel="noopener noreferrer"
                   className="hover:text-[var(--color-text)] transition-colors duration-150">GitHub</a>
                <span className="text-brand-border">·</span>
                <a href={`https://${profile.linkedin}`} target="_blank" rel="noopener noreferrer"
                   className="hover:text-[var(--color-text)] transition-colors duration-150">LinkedIn</a>
                <span className="text-brand-border">·</span>
                <a href={`mailto:${profile.email}`}
                   className="hover:text-[var(--color-text)] transition-colors duration-150">{profile.email}</a>
              </motion.div>
            </motion.div>

            {/* ── Right: photo frame ── */}
            {(photoUrl || profileLoading) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.15, ease }}
                className="lg:col-span-5 flex justify-center lg:justify-end"
              >
                <div className="relative w-64 sm:w-72 lg:w-80">
                  {/* Terminal-style frame */}
                  <div className="rounded-xl overflow-hidden border border-brand-border bg-brand-surface">
                    {/* Top label bar */}
                    <div className="flex items-center justify-between px-3 py-2 border-b border-brand-border bg-brand-subtle/50">
                      <span className="font-mono text-xs text-brand-muted">
                        {profile.name.toLowerCase().replace(' ', '_')}.jpg
                      </span>
                      <span className="font-mono text-xs text-brand-accent">400×400</span>
                    </div>
                    {/* Photo */}
                    <div className="aspect-[4/5] relative overflow-hidden bg-brand-subtle">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={profile.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full animate-pulse bg-brand-subtle" />
                      )}
                    </div>
                    {/* Bottom location bar */}
                    <div className="flex items-center gap-2 px-3 py-2 border-t border-brand-border">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                      <span className="font-mono text-xs text-brand-muted">{profile.location}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
          <div className="w-px h-10 bg-gradient-to-b from-brand-muted/40 to-transparent" />
          <span className="text-brand-muted text-xs font-mono opacity-50">scroll</span>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <section className="border-y border-brand-border bg-brand-surface/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-brand-border">
            {STATS.map(({ value, suffix, label }) => (
              <div key={label} className="bg-brand-bg py-8 px-6 flex flex-col items-center justify-center">
                <StatItem value={value} suffix={suffix} label={label} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Selected Work ──────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, ease }}
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-4">
            <p className="font-mono text-xs text-brand-accent uppercase tracking-[0.2em]">Selected Work</p>
            <div className="flex-1 h-px bg-brand-border" />
          </div>
          <p className="text-brand-muted max-w-xl text-sm">
            Production systems spanning forecasting, NLP, industrial AI, and MLOps infrastructure.
          </p>
        </motion.div>

        <div className="divide-y divide-brand-border">
          {projectsLoading && !apiProjects
            ? [1, 2, 3].map((i) => (
                <div key={i} className="py-6 flex items-center gap-4">
                  <div className="h-4 w-24 rounded bg-brand-subtle animate-pulse" />
                  <div className="h-5 w-64 rounded bg-brand-subtle animate-pulse" />
                </div>
              ))
            : projects.map((project, i) => {
                const cat    = CATEGORY_META[project.category]
                const status = STATUS_META[project.status]
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.07, ease }}
                  >
                    <Link
                      to={`/projects/${project.id}`}
                      className="group flex items-start gap-5 py-6 hover:bg-brand-subtle/20 -mx-4 px-4 transition-colors duration-150 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span className={`tech-badge text-xs ${cat.color}`}>{cat.label}</span>
                          <span className={`flex items-center gap-1.5 text-xs font-medium ${status.color.split(' ')[0]}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                            {status.label}
                          </span>
                        </div>
                        <h3 className="text-lg font-display font-semibold mb-1 group-hover:text-brand-accent transition-colors duration-150">
                          {project.title}
                        </h3>
                        <p className="text-brand-muted text-sm leading-relaxed line-clamp-1">
                          {project.shortDescription}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {project.techStack.slice(0, 5).map((tech) => (
                            <span key={tech} className="tech-badge">{tech}</span>
                          ))}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-brand-muted group-hover:text-brand-accent group-hover:translate-x-1 transition-all duration-150 flex-shrink-0 mt-1" />
                    </Link>
                  </motion.div>
                )
              })
          }
        </div>

        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8"
        >
          <Link to="/projects" className="btn-secondary text-sm py-2.5 px-5">
            All Projects <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      {/* ── About teaser ──────────────────────────────────────── */}
      <section className="border-t border-brand-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, ease }}
            >
              <div className="flex items-center gap-4 mb-6">
                <p className="font-mono text-xs text-brand-accent uppercase tracking-[0.2em]">About</p>
                <div className="flex-1 h-px bg-brand-border" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">Research → Production</h2>
              <p className="text-brand-muted leading-relaxed mb-6 text-sm">
                {profile.bio.split('\n\n')[0]}
              </p>
              <Link to="/about" className="btn-secondary text-sm py-2.5 px-5">
                Full Profile <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, ease }}
              className="border-l-2 border-brand-accent pl-6"
            >
              <p className="font-mono text-xs text-brand-accent uppercase tracking-[0.2em] mb-3">Patent</p>
              <p className="font-display font-semibold text-lg mb-1">{profile.patent.number}</p>
              <p className="text-brand-muted text-sm leading-relaxed mb-3">{profile.patent.title}</p>
              <p className="font-mono text-xs text-brand-muted">
                {profile.patent.status} · {profile.patent.role}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="border-t border-brand-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, ease }}
          >
            <p className="font-mono text-xs text-brand-accent uppercase tracking-[0.2em] mb-4">Contact</p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-3">
              Open to the right problem.
            </h2>
            <p className="text-brand-muted mb-8 max-w-md text-sm">
              ML engineering roles, research collaborations, and serious infrastructure challenges.
            </p>
            <Link to="/contact" className="btn-primary">
              Get in Touch <Mail className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
