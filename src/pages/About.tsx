import { motion } from 'framer-motion'
import { Award, Briefcase, GraduationCap, MapPin, Mail, Linkedin } from 'lucide-react'
import GithubIcon from '@/components/icons/GithubIcon'
import { PROFILE, EXPERIENCE, EDUCATION, SKILLS } from '@/data/profile'
import { useApi } from '@/hooks/useApi'
import { getProfile, getExperience, getEducation, getSkills, mapExperience, mapEducation, getPhotoUrl } from '@/lib/api'
import Seo from '@/components/Seo'
import PageSkeleton from '@/components/PageSkeleton'

const fadeUp = (delay = 0) => ({
  initial:      { opacity: 0, y: 20 },
  whileInView:  { opacity: 1, y: 0 },
  viewport:     { once: true },
  transition:   { duration: 0.5, delay },
})

const SKILL_SIZES = [
  'text-base font-semibold',
  'text-sm font-medium',
  'text-sm',
  'text-xs',
  'text-xs',
]

export default function About() {
  const { data: apiProfile,    loading } = useApi(getProfile)
  const { data: apiExperience         } = useApi(getExperience)
  const { data: apiEducation          } = useApi(getEducation)
  const { data: apiSkills             } = useApi(getSkills)

  if (loading && !apiProfile) return <PageSkeleton />

  const profile    = apiProfile    ?? PROFILE
  const experience = apiExperience ? apiExperience.map(mapExperience) : EXPERIENCE
  const education  = apiEducation  ? apiEducation.map(mapEducation)   : EDUCATION
  const skills     = apiSkills     ?? SKILLS

  const photoUrl = apiProfile?.photo_url ? getPhotoUrl(apiProfile.photo_url) : null

  return (
    <div className="pt-24 pb-20">
      <Seo title="About" description="ML engineer with a Master's in Computer Science from Donghua University. Co-inventor on Australian Patent #2025203718." path="/about" type="profile" />

      {/* ── Profile header ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-14"
      >
        {/* Banner */}
        <div className="relative h-44 sm:h-52 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/60 via-violet-900/40 to-blue-900/50
                          [.light_&]:from-cyan-600/20 [.light_&]:via-violet-600/15 [.light_&]:to-blue-600/20" />
          <div className="absolute inset-0 blueprint-grid opacity-60" />
          <div className="pointer-events-none absolute -top-10 -left-10 w-64 h-64 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 w-64 h-64 rounded-full bg-violet-600/20 blur-3xl" />
          {/* Floating geo shapes in banner */}
          <div className="geo-float-a absolute top-4 right-10 w-16 h-16 rounded-full border border-brand-accent/20 bg-brand-accent/5" />
          <div className="geo-float-b absolute bottom-4 right-32 w-8 h-8 border border-brand-purple/25 rotate-45" />
          <div className="geo-float-c absolute top-6 left-1/3 w-10 h-10 rounded-full border border-brand-purple/15" />
        </div>

        {/* Avatar + info row */}
        <div className="px-2 sm:px-4">
          {/* Avatar — overlaps banner */}
          <div className="relative -mt-14 mb-4 inline-block">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={profile.name}
                className="w-28 h-28 rounded-full border-4 border-brand-bg object-cover shadow-xl shadow-brand-accent/10"
              />
            ) : (
              <div
                className="w-28 h-28 rounded-full border-4 border-brand-bg bg-brand-subtle shadow-xl shadow-brand-accent/10
                            flex items-center justify-center"
              >
                <span className="text-3xl font-bold gradient-text font-mono">MA</span>
              </div>
            )}
          </div>

          {/* Name + title */}
          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold">{profile.name}</h1>
            <p className="text-brand-muted mt-0.5">{profile.title}</p>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-brand-muted">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-accent" />
              {profile.location}
            </span>
            <a href={`mailto:${profile.email}`}
               className="flex items-center gap-1.5 hover:text-brand-accent transition-colors">
              <Mail className="w-3.5 h-3.5" />
              {profile.email}
            </a>
            <a href={`https://${profile.linkedin}`} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1.5 hover:text-brand-accent transition-colors">
              <Linkedin className="w-3.5 h-3.5" />
              LinkedIn
            </a>
            <a href={`https://${profile.github}`} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1.5 hover:text-brand-accent transition-colors">
              <GithubIcon className="w-3.5 h-3.5" />
              GitHub
            </a>
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Bio */}
        <motion.section {...fadeUp()} className="mb-14">
          <p className="text-brand-accent font-mono text-sm mb-3">// about me</p>
          <div className="space-y-4">
            {profile.bio.split('\n\n').filter(Boolean).map((para, i) => (
              <p key={i} className="text-slate-400 leading-relaxed">{para}</p>
            ))}
          </div>
        </motion.section>

        {/* Patent */}
        <motion.section {...fadeUp(0.05)} className="mb-14">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Award className="w-6 h-6 text-amber-400" /> Patent
          </h2>
          <div className="card-premium rounded-xl p-6 border-l-4 border-amber-400/60">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono
                               bg-amber-400/10 border border-amber-400/20 text-amber-400">
                {profile.patent.status}
              </span>
              <span className="text-brand-muted text-sm">{profile.patent.role}</span>
            </div>
            <h3 className="font-semibold text-lg mb-1">{profile.patent.number}</h3>
            <p className="text-brand-muted">{profile.patent.title}</p>
          </div>
        </motion.section>

        {/* Experience */}
        <motion.section {...fadeUp(0.1)} className="mb-14">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Briefcase className="w-6 h-6 text-brand-accent" /> Experience
          </h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-brand-accent/60 via-brand-border to-transparent" />
            <div className="space-y-8">
              {experience.map((exp, i) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className="relative pl-10"
                >
                  <div className="absolute left-2 top-1.5 w-4 h-4 rounded-full bg-brand-accent border-4 border-brand-bg shadow-lg shadow-brand-accent/30" />
                  <div className="glass rounded-xl p-5 hover:border-brand-accent/30 transition-colors duration-300">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold">{exp.role}</h3>
                        <p className="text-brand-accent text-sm">{exp.company}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-brand-muted text-xs font-mono">
                          {exp.startDate} — {exp.endDate}
                        </p>
                        <p className="text-brand-muted text-xs flex items-center justify-end gap-1">
                          <MapPin className="w-3 h-3" /> {exp.location}
                        </p>
                      </div>
                    </div>
                    <ul className="space-y-1.5 mt-3">
                      {exp.highlights.map((h, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-accent/50 flex-shrink-0 mt-1.5" />
                          <span className="text-slate-400 text-sm leading-relaxed">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Education */}
        <motion.section {...fadeUp(0.15)} className="mb-14">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-brand-accent" /> Education
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {education.map((edu) => (
              <div key={edu.id} className="card-premium rounded-xl p-5 hover:scale-[1.01] transition-transform duration-300">
                <p className="text-brand-muted text-xs font-mono mb-1">
                  {edu.startYear} — {edu.endYear}
                </p>
                <h3 className="font-semibold">{edu.degree} in {edu.field}</h3>
                <p className="text-brand-accent text-sm">{edu.school}</p>
                <p className="text-brand-muted text-xs mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {edu.location}
                </p>
                {edu.note && <p className="text-slate-500 text-xs mt-2 italic">{edu.note}</p>}
              </div>
            ))}
          </div>
        </motion.section>

        {/* Skills cloud */}
        <motion.section {...fadeUp(0.2)}>
          <h2 className="text-2xl font-bold mb-6">Skills</h2>
          <div className="grid gap-8">
            {skills.map((group, i) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <h3 className="text-brand-accent font-mono text-sm mb-4">{group.category}</h3>
                <div className="flex flex-wrap gap-2 items-center">
                  {group.skills.map((skill, j) => {
                    const sizeClass = SKILL_SIZES[Math.min(j, SKILL_SIZES.length - 1)]
                    const isHighlighted = j < 3
                    return (
                      <span
                        key={skill}
                        className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-default
                          ${sizeClass}
                          ${isHighlighted
                            ? 'bg-brand-accent/10 border border-brand-accent/30 text-brand-accent hover:bg-brand-accent/20 hover:border-brand-accent/60'
                            : 'bg-brand-subtle border border-brand-border text-brand-muted hover:border-brand-accent/40 hover:text-brand-accent'
                          }`}
                      >
                        {skill}
                      </span>
                    )
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}
