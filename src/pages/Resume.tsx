import { motion } from 'framer-motion'
import { Download, Award, Briefcase, GraduationCap, Code2, Folder } from 'lucide-react'
import { PROFILE, EXPERIENCE, EDUCATION, SKILLS } from '@/data/profile'
import { PROJECTS as FALLBACK_PROJECTS } from '@/data/projects'
import { useApi } from '@/hooks/useApi'
import { getProfile, getProjects, getExperience, getEducation, getSkills, mapProject, mapExperience, mapEducation, getResumeUrl } from '@/lib/api'
import Seo from '@/components/Seo'
import PageSkeleton from '@/components/PageSkeleton'

export default function Resume() {
  const { data: apiProfile,    loading } = useApi(getProfile)
  const { data: apiProjects            } = useApi(getProjects)
  const { data: apiExperience          } = useApi(getExperience)
  const { data: apiEducation           } = useApi(getEducation)
  const { data: apiSkills              } = useApi(getSkills)

  if (loading && !apiProfile) return <PageSkeleton />

  const profile    = apiProfile    ?? PROFILE
  const allProjects = apiProjects ? apiProjects.map(mapProject) : FALLBACK_PROJECTS
  const experience = apiExperience ? apiExperience.map(mapExperience) : EXPERIENCE
  const education  = apiEducation  ? apiEducation.map(mapEducation)   : EDUCATION
  const skills     = apiSkills     ?? SKILLS

  const topProjects = allProjects.filter((p) => p.featured).slice(0, 3)

  return (
    <div className="pt-24 pb-20">
      <Seo title="Resume" description="CV and resume of Mohamed Alderdiry, Applied Machine Learning Engineer. Download PDF resume." path="/resume" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Actions bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <p className="text-brand-accent font-mono text-sm mb-1">// resume</p>
            <h1 className="text-3xl sm:text-4xl font-bold">Curriculum Vitae</h1>
          </div>
          <a
            href={getResumeUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <Download className="w-4 h-4" /> Download PDF
          </a>
        </motion.div>

        {/* Resume document */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-accent/10 to-blue-500/10 border-b border-brand-border p-8">
            <h2 className="text-3xl font-bold mb-1">{profile.name}</h2>
            <p className="text-brand-accent text-lg mb-4">{profile.title}</p>
            <div className="flex flex-wrap gap-4 text-sm text-brand-muted">
              <a href={`mailto:${profile.email}`} className="hover:text-brand-accent transition-colors">
                {profile.email}
              </a>
              <span>{profile.phone}</span>
              <a href={`https://${profile.linkedin}`} target="_blank" rel="noopener noreferrer"
                 className="hover:text-brand-accent transition-colors">
                {profile.linkedin}
              </a>
              <a href={`https://${profile.github}`} target="_blank" rel="noopener noreferrer"
                 className="hover:text-brand-accent transition-colors">
                {profile.github}
              </a>
              <span>{profile.location}</span>
            </div>
          </div>

          <div className="p-8 space-y-10">
            {/* Summary */}
            <section>
              <h3 className="text-xs font-mono text-brand-accent uppercase tracking-widest mb-4">Summary</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {profile.bio.split('\n\n')[0]}
              </p>
            </section>

            {/* Patent */}
            <section>
              <h3 className="text-xs font-mono text-brand-accent uppercase tracking-widest mb-4 flex items-center gap-2">
                <Award className="w-3.5 h-3.5" /> Patent
              </h3>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-sm">{profile.patent.number}</p>
                  <p className="text-slate-400 text-sm">{profile.patent.title}</p>
                </div>
                <span className="flex-shrink-0 text-xs font-mono text-amber-400 bg-amber-400/10 px-2 py-1 rounded">
                  {profile.patent.status}
                </span>
              </div>
            </section>

            {/* Experience */}
            <section>
              <h3 className="text-xs font-mono text-brand-accent uppercase tracking-widest mb-6 flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5" /> Experience
              </h3>
              <div className="space-y-6">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="font-semibold">{exp.role}</p>
                        <p className="text-brand-accent text-sm">{exp.company} · {exp.location}</p>
                      </div>
                      <p className="text-brand-muted text-xs font-mono">
                        {exp.startDate} — {exp.endDate}
                      </p>
                    </div>
                    <ul className="space-y-1.5 mt-2">
                      {exp.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-brand-accent text-xs mt-0.5 flex-shrink-0">▸</span>
                          <span className="text-slate-400 text-sm leading-relaxed">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects */}
            <section>
              <h3 className="text-xs font-mono text-brand-accent uppercase tracking-widest mb-6 flex items-center gap-2">
                <Folder className="w-3.5 h-3.5" /> Selected Projects
              </h3>
              <div className="space-y-5">
                {topProjects.map((p) => (
                  <div key={p.id}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-semibold">{p.title}</p>
                      <span className="flex-shrink-0 text-xs font-mono text-brand-muted">{p.techStack.slice(0, 3).join(', ')}</span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">{p.shortDescription}</p>
                    {p.results.length > 0 && (
                      <p className="text-emerald-400 text-xs mt-1">↳ {p.results[0]}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section>
              <h3 className="text-xs font-mono text-brand-accent uppercase tracking-widest mb-6 flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5" /> Education
              </h3>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold">{edu.degree} in {edu.field}</p>
                      <p className="text-brand-accent text-sm">{edu.school} · {edu.location}</p>
                    </div>
                    <p className="text-brand-muted text-xs font-mono">
                      {edu.startYear} — {edu.endYear}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Skills */}
            <section>
              <h3 className="text-xs font-mono text-brand-accent uppercase tracking-widest mb-6 flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5" /> Technical Skills
              </h3>
              <div className="space-y-3">
                {skills.map((group) => (
                  <div key={group.category} className="flex gap-3">
                    <span className="flex-shrink-0 w-36 text-brand-muted text-xs font-mono pt-0.5">
                      {group.category}
                    </span>
                    <p className="text-slate-400 text-sm">{group.skills.join(', ')}</p>
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
