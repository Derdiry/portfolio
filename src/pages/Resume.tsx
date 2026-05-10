import { motion } from 'framer-motion'
import { Download, Award, Briefcase, GraduationCap, Code2, Folder } from 'lucide-react'
import { PROFILE, EXPERIENCE, EDUCATION, SKILLS } from '@/data/profile'
import { PROJECTS as FALLBACK_PROJECTS } from '@/data/projects'
import { useApi } from '@/hooks/useApi'
import { getProfile, getProjects, getExperience, getEducation, getSkills, mapProject, mapExperience, mapEducation, getResumeUrl } from '@/lib/api'
import Seo from '@/components/Seo'
import PageSkeleton from '@/components/PageSkeleton'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

function SectionHeader({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <Icon className="w-3.5 h-3.5 text-brand-accent flex-shrink-0" />
      <span className="font-mono text-xs text-brand-accent uppercase tracking-[0.18em]">{label}</span>
      <div className="flex-1 h-px bg-brand-border" />
    </div>
  )
}

export default function Resume() {
  const { data: apiProfile,    loading } = useApi(getProfile)
  const { data: apiProjects            } = useApi(getProjects)
  const { data: apiExperience          } = useApi(getExperience)
  const { data: apiEducation           } = useApi(getEducation)
  const { data: apiSkills              } = useApi(getSkills)

  if (loading && !apiProfile) return <PageSkeleton />

  const profile     = apiProfile    ?? PROFILE
  const allProjects = apiProjects ? apiProjects.map(mapProject) : FALLBACK_PROJECTS
  const experience  = apiExperience ? apiExperience.map(mapExperience) : EXPERIENCE
  const education   = apiEducation  ? apiEducation.map(mapEducation)   : EDUCATION
  const skills      = apiSkills     ?? SKILLS
  const topProjects = allProjects.filter((p) => p.featured).slice(0, 3)

  return (
    <div className="pt-24 pb-20">
      <Seo title="Resume" description="CV and resume of Mohamed Alderdiry, Applied Machine Learning Engineer. Download PDF resume." path="/resume" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Actions bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <p className="font-mono text-xs text-brand-accent uppercase tracking-[0.2em] mb-1">// resume</p>
            <h1 className="text-3xl sm:text-4xl font-display font-bold">Curriculum Vitae</h1>
          </div>
          <a
            href={getResumeUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm py-2.5 px-5"
          >
            <Download className="w-4 h-4" /> Download PDF
          </a>
        </motion.div>

        {/* Document frame */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
          className="bg-brand-surface border border-brand-border/60 rounded-sm
                     shadow-[0_24px_64px_rgba(0,0,0,0.5)] px-8 sm:px-14 py-12"
        >
          {/* Document header */}
          <div className="border-b border-brand-border pb-7 mb-8">
            <h2 className="text-3xl font-display font-bold mb-1">{profile.name}</h2>
            <p className="font-mono text-sm text-brand-accent uppercase tracking-[0.15em] mb-4">
              {profile.title}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-brand-muted">
              <a href={`mailto:${profile.email}`} className="hover:text-brand-accent transition-colors">{profile.email}</a>
              <span>{profile.phone}</span>
              <a href={`https://${profile.linkedin}`} target="_blank" rel="noopener noreferrer"
                 className="hover:text-brand-accent transition-colors">{profile.linkedin}</a>
              <a href={`https://${profile.github}`} target="_blank" rel="noopener noreferrer"
                 className="hover:text-brand-accent transition-colors">{profile.github}</a>
              <span>{profile.location}</span>
            </div>
          </div>

          <div className="space-y-10">
            {/* Summary */}
            <section>
              <SectionHeader icon={Code2} label="Summary" />
              <p className="text-brand-muted text-sm leading-relaxed">
                {profile.bio.split('\n\n')[0]}
              </p>
            </section>

            {/* Patent */}
            <section>
              <SectionHeader icon={Award} label="Patent" />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-display font-semibold text-sm">{profile.patent.number}</p>
                  <p className="text-brand-muted text-sm mt-0.5">{profile.patent.title}</p>
                </div>
                <span className="flex-shrink-0 font-mono text-xs text-brand-accent bg-brand-accent/10 border border-brand-accent/20 px-2 py-1 rounded">
                  {profile.patent.status}
                </span>
              </div>
            </section>

            {/* Experience */}
            <section>
              <SectionHeader icon={Briefcase} label="Experience" />
              <div className="space-y-7">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="font-display font-semibold">{exp.role}</p>
                        <p className="text-brand-accent text-sm font-mono">{exp.company} · {exp.location}</p>
                      </div>
                      <p className="font-mono text-xs text-brand-muted">
                        {exp.startDate} — {exp.endDate}
                      </p>
                    </div>
                    <ul className="space-y-1.5 mt-2">
                      {exp.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-brand-accent text-xs mt-0.5 flex-shrink-0">▸</span>
                          <span className="text-brand-muted text-sm leading-relaxed">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects */}
            <section>
              <SectionHeader icon={Folder} label="Selected Projects" />
              <div className="space-y-5">
                {topProjects.map((p) => (
                  <div key={p.id}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-display font-semibold text-sm">{p.title}</p>
                      <span className="flex-shrink-0 font-mono text-xs text-brand-muted">
                        {p.techStack.slice(0, 3).join(', ')}
                      </span>
                    </div>
                    <p className="text-brand-muted text-sm leading-relaxed line-clamp-2">{p.shortDescription}</p>
                    {p.results.length > 0 && (
                      <p className="text-brand-emerald text-xs mt-1 font-mono">↳ {p.results[0]}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section>
              <SectionHeader icon={GraduationCap} label="Education" />
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-display font-semibold text-sm">{edu.degree} in {edu.field}</p>
                      <p className="text-brand-accent text-sm font-mono">{edu.school} · {edu.location}</p>
                    </div>
                    <p className="font-mono text-xs text-brand-muted">
                      {edu.startYear} — {edu.endYear}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Skills */}
            <section>
              <SectionHeader icon={Code2} label="Technical Skills" />
              <div className="space-y-3">
                {skills.map((group) => (
                  <div key={group.category} className="flex gap-4">
                    <span className="flex-shrink-0 w-36 font-mono text-xs text-brand-muted uppercase tracking-wide pt-0.5">
                      {group.category}
                    </span>
                    <p className="text-brand-muted text-sm">{group.skills.join(' · ')}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
