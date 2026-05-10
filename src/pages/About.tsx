import { motion } from 'framer-motion'
import { Award, Briefcase, GraduationCap, MapPin, Mail } from 'lucide-react'
import { PROFILE, EXPERIENCE, EDUCATION, SKILLS } from '@/data/profile'
import { useApi } from '@/hooks/useApi'
import { getProfile, getExperience, getEducation, getSkills, mapExperience, mapEducation, getPhotoUrl } from '@/lib/api'
import Seo from '@/components/Seo'
import PageSkeleton from '@/components/PageSkeleton'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]
const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true },
  transition:  { duration: 0.5, delay, ease },
})

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Profile header ──────────────────────────────── */}
        <motion.div {...fadeUp()} className="mb-16">
          <p className="font-mono text-xs text-brand-accent uppercase tracking-[0.2em] mb-6">// about</p>

          {/* Name + photo row */}
          <div className="flex items-start gap-8">
            <div className="flex-1 min-w-0">
              <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight leading-tight mb-2">
                {profile.name}
              </h1>
              <p className="text-brand-muted text-lg mb-4">{profile.title}</p>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-brand-muted">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-accent" />
                  {profile.location}
                </span>
                <a href={`mailto:${profile.email}`}
                   className="flex items-center gap-1.5 hover:text-brand-accent transition-colors duration-150">
                  <Mail className="w-3.5 h-3.5" />
                  {profile.email}
                </a>
              </div>
            </div>

            {/* Rectangular portrait — floats right */}
            {photoUrl && (
              <div className="flex-shrink-0 hidden sm:block">
                <div className="w-28 rounded-xl overflow-hidden border border-brand-border">
                  <img
                    src={photoUrl}
                    alt={profile.name}
                    className="w-full aspect-[3/4] object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Bio ─────────────────────────────────────────── */}
        <motion.section {...fadeUp(0.05)} className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <p className="font-mono text-xs text-brand-accent uppercase tracking-[0.2em]">Background</p>
            <div className="flex-1 h-px bg-brand-border" />
          </div>
          <div className="space-y-4 max-w-2xl">
            {profile.bio.split('\n\n').filter(Boolean).map((para, i) => (
              <p key={i} className="text-brand-muted leading-relaxed text-sm">{para}</p>
            ))}
          </div>
        </motion.section>

        {/* ── Patent ──────────────────────────────────────── */}
        <motion.section {...fadeUp(0.08)} className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <p className="font-mono text-xs text-brand-accent uppercase tracking-[0.2em] flex items-center gap-2">
              <Award className="w-3.5 h-3.5" /> Patent
            </p>
            <div className="flex-1 h-px bg-brand-border" />
          </div>
          <div className="border-l-2 border-brand-accent pl-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs text-brand-accent bg-brand-accent/10 border border-brand-accent/20 px-2 py-0.5 rounded">
                {profile.patent.status}
              </span>
              <span className="text-brand-muted text-xs font-mono">{profile.patent.role}</span>
            </div>
            <p className="font-display font-semibold mb-1">{profile.patent.number}</p>
            <p className="text-brand-muted text-sm">{profile.patent.title}</p>
          </div>
        </motion.section>

        {/* ── Experience ──────────────────────────────────── */}
        <motion.section {...fadeUp(0.1)} className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <p className="font-mono text-xs text-brand-accent uppercase tracking-[0.2em] flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5" /> Experience
            </p>
            <div className="flex-1 h-px bg-brand-border" />
          </div>
          <div className="space-y-0 divide-y divide-brand-border/50">
            {experience.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08, ease }}
                className="py-7 first:pt-0"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                  <div>
                    <p className="font-mono text-xs text-brand-accent uppercase tracking-widest mb-1">
                      {exp.startDate} — {exp.endDate}
                    </p>
                    <h3 className="font-display font-semibold text-lg">{exp.role}</h3>
                    <p className="text-brand-muted text-sm">{exp.company} · {exp.location}</p>
                  </div>
                </div>
                <ul className="mt-4 space-y-2">
                  {exp.highlights.map((h, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <span className="text-brand-accent text-xs mt-1 flex-shrink-0">▸</span>
                      <span className="text-brand-muted text-sm leading-relaxed">{h}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Education ───────────────────────────────────── */}
        <motion.section {...fadeUp(0.13)} className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <p className="font-mono text-xs text-brand-accent uppercase tracking-[0.2em] flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5" /> Education
            </p>
            <div className="flex-1 h-px bg-brand-border" />
          </div>
          <div className="space-y-0 divide-y divide-brand-border/50">
            {education.map((edu) => (
              <div key={edu.id} className="py-6 first:pt-0">
                <p className="font-mono text-xs text-brand-accent uppercase tracking-widest mb-1">
                  {edu.startYear} — {edu.endYear}
                </p>
                <h3 className="font-display font-semibold">{edu.degree} in {edu.field}</h3>
                <p className="text-brand-muted text-sm">{edu.school}</p>
                <p className="text-brand-muted text-xs mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {edu.location}
                </p>
                {edu.note && <p className="text-brand-muted/60 text-xs mt-2 italic">{edu.note}</p>}
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Skills capability table ─────────────────────── */}
        <motion.section {...fadeUp(0.16)}>
          <div className="flex items-center gap-4 mb-8">
            <p className="font-mono text-xs text-brand-accent uppercase tracking-[0.2em]">Skills</p>
            <div className="flex-1 h-px bg-brand-border" />
          </div>
          <div className="space-y-0 divide-y divide-brand-border/40">
            {skills.map((group, i) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05, ease }}
                className="flex gap-6 py-4 first:pt-0"
              >
                <span className="flex-shrink-0 w-40 font-mono text-xs text-brand-accent uppercase tracking-widest pt-0.5">
                  {group.category}
                </span>
                <p className="text-brand-muted text-sm leading-relaxed">
                  {group.skills.join(' · ')}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

      </div>
    </div>
  )
}
