import { motion } from 'framer-motion'
import { Award, Briefcase, GraduationCap, MapPin, Mail, Github, Linkedin } from 'lucide-react'
import { PROFILE, EXPERIENCE, EDUCATION, SKILLS } from '@/data/profile'
import { useApi } from '@/hooks/useApi'
import { getProfile, getExperience, getEducation, getSkills, mapExperience, mapEducation } from '@/lib/api'
import Seo from '@/components/Seo'

const fadeUp = (delay = 0) => ({
  initial:   { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport:  { once: true },
  transition: { duration: 0.5, delay },
})

export default function About() {
  const { data: apiProfile    } = useApi(getProfile)
  const { data: apiExperience } = useApi(getExperience)
  const { data: apiEducation  } = useApi(getEducation)
  const { data: apiSkills     } = useApi(getSkills)

  const profile    = apiProfile    ?? PROFILE
  const experience = apiExperience ? apiExperience.map(mapExperience) : EXPERIENCE
  const education  = apiEducation  ? apiEducation.map(mapEducation)   : EDUCATION
  const skills     = apiSkills     ?? SKILLS

  return (
    <div className="pt-24 pb-20">
      <Seo title="About" description="ML engineer with a Master's in Computer Science from Donghua University. Co-inventor on Australian Patent #2025203718." path="/about" type="profile" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div {...fadeUp()} className="mb-14">
          <p className="text-brand-accent font-mono text-sm mb-2">// about me</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">About</h1>

          <div className="flex flex-wrap items-center gap-4 mb-8 text-brand-muted text-sm">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand-accent" />
              {profile.location}
            </span>
            <a href={`mailto:${profile.email}`} className="flex items-center gap-1.5 hover:text-brand-accent transition-colors">
              <Mail className="w-4 h-4" />
              {profile.email}
            </a>
            <a href={`https://${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-brand-accent transition-colors">
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
            <a href={`https://${profile.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-brand-accent transition-colors">
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </div>

          {/* Bio */}
          <div className="space-y-4">
            {profile.bio.split('\n\n').filter(Boolean).map((para, i) => (
              <p key={i} className="text-slate-400 leading-relaxed">{para}</p>
            ))}
          </div>
        </motion.div>

        {/* Patent */}
        <motion.section {...fadeUp(0.05)} className="mb-14">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Award className="w-6 h-6 text-amber-400" /> Patent
          </h2>
          <div className="glass rounded-xl p-6 border-l-4 border-amber-400/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono
                               bg-amber-400/10 border border-amber-400/20 text-amber-400">
                {profile.patent.status}
              </span>
              <span className="text-brand-muted text-sm">{profile.patent.role}</span>
            </div>
            <h3 className="text-white font-semibold text-lg mb-1">{profile.patent.number}</h3>
            <p className="text-brand-muted">{profile.patent.title}</p>
          </div>
        </motion.section>

        {/* Experience */}
        <motion.section {...fadeUp(0.1)} className="mb-14">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Briefcase className="w-6 h-6 text-brand-accent" /> Experience
          </h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-brand-border" />
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
                  <div className="absolute left-2 top-1.5 w-4 h-4 rounded-full bg-brand-accent border-4 border-brand-bg" />
                  <div className="glass rounded-xl p-5">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-white font-semibold">{exp.role}</h3>
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
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-brand-accent" /> Education
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {education.map((edu) => (
              <div key={edu.id} className="glass rounded-xl p-5">
                <p className="text-brand-muted text-xs font-mono mb-1">
                  {edu.startYear} — {edu.endYear}
                </p>
                <h3 className="text-white font-semibold">{edu.degree} in {edu.field}</h3>
                <p className="text-brand-accent text-sm">{edu.school}</p>
                <p className="text-brand-muted text-xs mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {edu.location}
                </p>
                {edu.note && (
                  <p className="text-slate-500 text-xs mt-2 italic">{edu.note}</p>
                )}
              </div>
            ))}
          </div>
        </motion.section>

        {/* Skills */}
        <motion.section {...fadeUp(0.2)}>
          <h2 className="text-2xl font-bold text-white mb-6">Skills</h2>
          <div className="grid gap-6">
            {skills.map((group, i) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <h3 className="text-brand-accent font-mono text-sm mb-3">{group.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-lg text-sm
                                 bg-brand-subtle border border-brand-border text-brand-muted
                                 hover:border-brand-accent/50 hover:text-white transition-all duration-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}
