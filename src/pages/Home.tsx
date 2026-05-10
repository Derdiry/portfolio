import { Link } from 'react-router-dom'
import { ArrowRight, Linkedin, Mail, Award, ExternalLink } from 'lucide-react'
import GithubIcon from '@/components/icons/GithubIcon'
import { motion } from 'framer-motion'
import { useApi } from '@/hooks/useApi'
import { getProjects, getProfile, mapProject, getPhotoUrl } from '@/lib/api'
import { PROJECTS as FALLBACK_PROJECTS } from '@/data/projects'
import { PROFILE as FALLBACK_PROFILE } from '@/data/profile'
import { useTypingAnimation } from '@/hooks/useScrollAnimation'
import { CATEGORY_META, STATUS_META } from '@/components/projects/meta'
import Seo from '@/components/Seo'

const TYPING_WORDS = ['ML Engineer', 'Vision Systems', 'Time Series', 'RAG / NLP', 'MLOps']

const STATS = [
  { value: '36',  label: 'Models Trained',      suffix: '' },
  { value: '5',   label: 'Production Projects',  suffix: '+' },
  { value: '1',   label: 'Patent',               suffix: '' },
  { value: '7',   label: 'Tech Stacks',          suffix: '' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}
const stagger = { show: { transition: { staggerChildren: 0.1 } } }

export default function Home() {
  const typing = useTypingAnimation(TYPING_WORDS, 80, 1800)

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
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* Background layers */}
        <div className="absolute inset-0 animated-gradient" />
        <div className="absolute inset-0 blueprint-grid opacity-100" />

        {/* Glow orbs */}
        <div className="pointer-events-none absolute -top-48 -left-48 w-[700px] h-[700px] rounded-full bg-cyan-500/8 blur-[140px]" />
        <div className="pointer-events-none absolute -bottom-48 -right-24 w-[600px] h-[600px] rounded-full bg-violet-600/8 blur-[120px]" />
        <div className="pointer-events-none absolute top-1/3 left-1/2 w-[400px] h-[400px] rounded-full bg-brand-accent/4 blur-[100px]" />

        {/* Floating geometric shapes */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="geo-float-a absolute top-[15%] right-[8%] w-40 h-40 rounded-full
                          border border-brand-accent/10 bg-brand-accent/2" />
          <div className="geo-float-b absolute top-[30%] right-[20%] w-16 h-16
                          border border-brand-purple/20 rotate-45" />
          <div className="geo-float-c absolute bottom-[20%] left-[6%] w-24 h-24 rounded-full
                          border border-brand-purple/10 bg-brand-purple/3" />
          <div className="geo-float-d absolute top-[55%] right-[5%] w-10 h-10
                          border-2 border-brand-accent/15 rotate-12" />
          <div className="geo-float-a absolute bottom-[35%] right-[30%] w-6 h-6 rounded-full
                          bg-brand-accent/20" style={{ animationDelay: '3s' }} />
          <div className="geo-float-b absolute top-[20%] left-[15%] w-8 h-8
                          border border-brand-gold/15 rotate-45" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="section w-full pt-28 pb-16 relative z-10">
          <div className={`grid ${photoUrl ? 'lg:grid-cols-5' : ''} gap-16 items-center`}>

            {/* ── Text content ── */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className={photoUrl ? 'lg:col-span-3' : 'max-w-3xl'}
            >
              <motion.div variants={fadeUp} className="mb-6">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono
                                 bg-brand-accent/10 border border-brand-accent/30 text-brand-accent">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
                  Available for opportunities
                </span>
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-3 tracking-tight">
                {profile.name.split(' ').map((word, i) => (
                  <span key={i} className={i === 1 ? 'gradient-text' : ''}>
                    {i > 0 ? ' ' : ''}{word}
                  </span>
                ))}
              </motion.h1>

              <motion.div variants={fadeUp} className="text-2xl sm:text-3xl font-mono text-brand-muted mb-6 h-10">
                <span className="text-brand-accent">{'> '}</span>
                <span>{typing}</span>
                <span className="animate-blink">_</span>
              </motion.div>

              <motion.p variants={fadeUp} className="text-lg text-brand-muted leading-relaxed mb-8 max-w-2xl">
                Building production AI systems across computer vision, time series forecasting, and NLP/RAG.
                Taking models from research papers to deployed infrastructure.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                           bg-amber-500/10 border border-amber-500/25 text-amber-400 text-sm mb-8"
              >
                <Award className="w-4 h-4 flex-shrink-0" />
                <span className="font-mono">
                  {profile.patent.number} — {profile.patent.title.split(' ').slice(0, 5).join(' ')}…
                </span>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-10">
                <Link to="/projects" className="btn-primary">
                  View Projects <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/contact" className="btn-secondary">
                  Get in Touch <Mail className="w-4 h-4" />
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} className="flex items-center gap-5">
                <a href={`https://${profile.linkedin}`} target="_blank" rel="noopener noreferrer"
                   aria-label="LinkedIn" className="text-brand-muted hover:text-brand-accent transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href={`https://${profile.github}`} target="_blank" rel="noopener noreferrer"
                   aria-label="GitHub" className="text-brand-muted hover:text-brand-accent transition-colors">
                  <GithubIcon className="w-5 h-5" />
                </a>
                <a href={`mailto:${profile.email}`} aria-label="Email"
                   className="text-brand-muted hover:text-brand-accent transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              </motion.div>
            </motion.div>

            {/* ── Profile photo ── */}
            {(photoUrl || profileLoading) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
                className="lg:col-span-2 flex items-center justify-center"
              >
                <div className="relative flex items-center justify-center">
                  <div className={`absolute w-[300px] h-[300px] rounded-full border border-dashed border-brand-accent/25 profile-ring transition-opacity duration-500 ${photoUrl ? 'opacity-100' : 'opacity-0'}`} />
                  <div className={`absolute w-[346px] h-[346px] rounded-full border border-brand-purple/15 profile-ring-reverse transition-opacity duration-500 ${photoUrl ? 'opacity-100' : 'opacity-0'}`} />
                  <div className="absolute w-60 h-60 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-600/20 blur-2xl" />
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={profile.name}
                      className="relative w-56 h-56 lg:w-64 lg:h-64 rounded-full object-cover
                                 border-2 border-brand-border shadow-2xl shadow-black/50"
                    />
                  ) : (
                    <div className="relative w-56 h-56 lg:w-64 lg:h-64 rounded-full
                                    bg-brand-subtle border-2 border-brand-border animate-pulse" />
                  )}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2
                                  flex items-center gap-1.5 px-3 py-1.5 rounded-full
                                  bg-brand-surface/95 border border-brand-border backdrop-blur-sm
                                  text-xs font-mono text-brand-muted whitespace-nowrap shadow-lg">
                    📍 {profile.location}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
          <span className="text-brand-muted text-xs font-mono opacity-60">scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-brand-muted/60 to-transparent" />
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────── */}
      <section className="relative border-y border-brand-border overflow-hidden">
        <div className="absolute inset-0 bg-brand-surface/50" />
        <div className="absolute inset-0 blueprint-grid opacity-30" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {STATS.map(({ value, suffix, label }) => (
              <div key={label} className="text-center group">
                <p className="text-5xl font-bold font-mono mb-1 stat-number gradient-text">
                  {value}<span className="text-3xl">{suffix}</span>
                </p>
                <div className="w-8 h-px bg-gradient-to-r from-brand-accent to-brand-purple mx-auto mb-2 opacity-60" />
                <p className="text-brand-muted text-sm tracking-wide">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Featured Projects ─────────────────────────────────────── */}
      <section className="section">
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-brand-accent font-mono text-sm mb-2">// featured work</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Selected Projects</h2>
          <p className="text-brand-muted max-w-xl">
            Production systems spanning forecasting, NLP, industrial AI, and MLOps infrastructure.
          </p>
        </motion.div>

        <div className="grid gap-5">
          {projectsLoading && !apiProjects
            ? [1, 2, 3].map((i) => (
                <div key={i} className="h-32 rounded-xl bg-brand-subtle animate-pulse" />
              ))
            : null}
          {(!projectsLoading || apiProjects) && projects.map((project, i) => {
            const cat    = CATEGORY_META[project.category]
            const status = STATUS_META[project.status]
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  to={`/projects/${project.id}`}
                  className="group glass rounded-xl overflow-hidden flex flex-col sm:flex-row
                             hover:border-brand-accent/40 transition-all duration-300
                             hover:shadow-xl hover:shadow-brand-accent/5 hover:-translate-y-0.5 block"
                >
                  <div className={`h-1 sm:h-auto sm:w-1 flex-shrink-0 ${cat.bar}`} />
                  <div className="flex-1 p-6 flex flex-col sm:flex-row gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-brand-subtle border border-brand-border
                                    flex items-center justify-center font-mono text-brand-accent font-bold text-lg">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`tech-badge ${cat.color}`}>{cat.label}</span>
                        <span className={`flex items-center gap-1.5 text-xs font-medium ${status.color.split(' ')[0]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-1 group-hover:text-brand-accent transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-brand-muted text-sm mb-3">{project.subtitle}</p>
                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                        {project.shortDescription}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {project.techStack.slice(0, 5).map((tech) => (
                          <span key={tech} className="tech-badge">{tech}</span>
                        ))}
                        {project.techStack.length > 5 && (
                          <span className="tech-badge">+{project.techStack.length - 5}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center">
                      <ArrowRight className="w-5 h-5 text-brand-muted group-hover:text-brand-accent
                                             group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <Link to="/projects" className="btn-secondary">
            All Projects <ExternalLink className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      {/* ── About teaser ─────────────────────────────────────────── */}
      <section className="section border-t border-brand-border">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55 }}
          >
            <p className="text-brand-accent font-mono text-sm mb-2">// about me</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Research → Production</h2>
            <p className="text-brand-muted leading-relaxed mb-6">
              {profile.bio.split('\n\n')[0]}
            </p>
            <Link to="/about" className="btn-secondary">
              Read More <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55 }}
            className="card-premium rounded-xl p-6 border-l-4 border-amber-400/60"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono
                             bg-amber-500/10 border border-amber-500/25 text-amber-400 mb-4">
              <Award className="w-3.5 h-3.5" /> Patent
            </div>
            <h3 className="font-semibold mb-1">{profile.patent.number}</h3>
            <p className="text-brand-muted text-sm leading-relaxed mb-3">{profile.patent.title}</p>
            <p className="text-brand-accent text-xs font-mono">
              Status: {profile.patent.status} · {profile.patent.role}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="section">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.55 }}
          className="card-premium rounded-2xl p-10 sm:p-14 text-center relative overflow-hidden"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-accent/5 via-transparent to-brand-purple/5" />
          <div className="pointer-events-none absolute inset-0 blueprint-grid opacity-20" />
          <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-brand-accent/8 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-brand-purple/8 blur-3xl" />

          <p className="text-brand-accent font-mono text-sm mb-3 relative">// let's collaborate</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 relative">
            Let's build something <span className="gradient-text">exceptional</span>
          </h2>
          <p className="text-brand-muted mb-8 max-w-md mx-auto relative">
            Open to ML engineering roles, research collaborations, and interesting problems.
          </p>
          <div className="flex flex-wrap gap-3 justify-center relative">
            <Link to="/contact" className="btn-primary">
              Get in Touch <Mail className="w-4 h-4" />
            </Link>
            <a href={`https://${profile.linkedin}`} target="_blank" rel="noopener noreferrer"
               className="btn-secondary">
              LinkedIn <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
