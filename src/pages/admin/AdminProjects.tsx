import { type ChangeEvent, type FormEvent, useRef, useState } from 'react'
import { CheckSquare, ImagePlus, Pencil, Plus, Square, Trash2, X } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useApi } from '@/hooks/useApi'
import {
  type ApiProject,
  adminCreateProject,
  adminDeleteProject,
  adminUpdateProject,
  adminUploadScreenshot,
  adminDeleteScreenshot,
  getProjects,
  getPhotoUrl,
  mapProject,
} from '@/lib/api'
import type { Project } from '@/types'

// ── Types ────────────────────────────────────────────────────────────────────

const CATEGORY_OPTIONS = [
  'time_series',
  'nlp_rag',
  'mlops',
  'industrial_ai',
  'business_intelligence',
  'computer_vision',
] as const

const STATUS_OPTIONS = ['complete', 'in_progress', 'papers_in_prep'] as const

interface ProjectFormState {
  id: string
  title: string
  subtitle: string
  category: string
  status: string
  priority: string
  featured: boolean
  short_description: string
  description: string
  problem: string
  approach: string
  tech_stack: string
  features: string
  results: string
  github_url: string
  demo_url: string
}

type ModalState = { mode: 'create' } | { mode: 'edit'; project: Project }

// ── Helpers ──────────────────────────────────────────────────────────────────

const arrToText = (arr: string[]) => arr.join('\n')
const textToArr = (s: string) => s.split('\n').map(x => x.trim()).filter(Boolean)

function emptyForm(): ProjectFormState {
  return {
    id: '', title: '', subtitle: '', category: 'mlops', status: 'complete',
    priority: '99', featured: false, short_description: '', description: '',
    problem: '', approach: '', tech_stack: '', features: '', results: '',
    github_url: '', demo_url: '',
  }
}

function projectToForm(p: Project): ProjectFormState {
  return {
    id: p.id,
    title: p.title,
    subtitle: p.subtitle,
    category: p.category,
    status: p.status,
    priority: String(p.priority),
    featured: p.featured,
    short_description: p.shortDescription,
    description: arrToText(p.description),
    problem: p.problem,
    approach: p.approach,
    tech_stack: arrToText(p.techStack),
    features: arrToText(p.features),
    results: arrToText(p.results),
    github_url: p.githubUrl ?? '',
    demo_url: p.demoUrl ?? '',
  }
}

function formToApiData(form: ProjectFormState): Omit<ApiProject, 'created_at'> {
  return {
    id: form.id,
    title: form.title,
    subtitle: form.subtitle,
    category: form.category,
    status: form.status,
    priority: parseInt(form.priority) || 99,
    featured: form.featured,
    short_description: form.short_description,
    description: textToArr(form.description),
    problem: form.problem,
    approach: form.approach,
    tech_stack: textToArr(form.tech_stack),
    features: textToArr(form.features),
    results: textToArr(form.results),
    github_url: form.github_url || null,
    demo_url: form.demo_url || null,
    architecture_image: null,
    screenshots: [],
  }
}

// ── Modal ────────────────────────────────────────────────────────────────────

interface ProjectModalProps {
  modal: ModalState
  onClose: () => void
  onSaved: () => void
}

function ProjectModal({ modal, onClose, onSaved }: ProjectModalProps) {
  const [form, setForm] = useState<ProjectFormState>(() =>
    modal.mode === 'edit' ? projectToForm(modal.project) : emptyForm()
  )
  const [saving, setSaving] = useState(false)
  const [screenshots, setScreenshots] = useState<string[]>(
    modal.mode === 'edit' ? (modal.project.screenshots ?? []) : []
  )
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleScreenshotUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || modal.mode !== 'edit') return
    setUploading(true)
    try {
      const updated = await adminUploadScreenshot(modal.project.id, file)
      setScreenshots(updated.screenshots ?? [])
      toast.success('Screenshot uploaded')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleDeleteScreenshot = async (url: string) => {
    if (modal.mode !== 'edit') return
    const filename = url.split('/').pop()!
    try {
      const updated = await adminDeleteScreenshot(modal.project.id, filename)
      setScreenshots(updated.screenshots ?? [])
      toast.success('Screenshot removed')
    } catch {
      toast.error('Delete failed')
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (modal.mode === 'create') {
        await adminCreateProject(formToApiData(form))
        toast.success('Project created')
      } else {
        await adminUpdateProject(modal.project.id, formToApiData(form))
        toast.success('Project updated')
      }
      onSaved()
      onClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const inputCls = 'w-full px-3 py-2 rounded-lg bg-brand-subtle border border-brand-border text-white placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-colors text-sm'
  const labelCls = 'block text-sm text-brand-muted mb-1'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {modal.mode === 'create' ? 'New Project' : 'Edit Project'}
          </h2>
          <button onClick={onClose} className="text-brand-muted hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-brand-accent uppercase tracking-wide">Basic</h3>

            {modal.mode === 'create' && (
              <div>
                <label className={labelCls}>ID (slug)</label>
                <input name="id" value={form.id} onChange={handleChange} required className={inputCls} placeholder="my-project-id" />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Title</label>
                <input name="title" value={form.title} onChange={handleChange} required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Subtitle</label>
                <input name="subtitle" value={form.subtitle} onChange={handleChange} className={inputCls} />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className={labelCls}>Category</label>
                <select name="category" value={form.category} onChange={handleChange} className={inputCls}>
                  {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Status</label>
                <select name="status" value={form.status} onChange={handleChange} className={inputCls}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Priority</label>
                <input name="priority" type="number" value={form.priority} onChange={handleChange} className={inputCls} />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    name="featured"
                    type="checkbox"
                    checked={form.featured}
                    onChange={handleChange}
                    className="w-4 h-4 rounded accent-brand-accent"
                  />
                  <span className="text-sm text-brand-muted">Featured</span>
                </label>
              </div>
            </div>
          </section>

          {/* Descriptions */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-brand-accent uppercase tracking-wide">Descriptions</h3>
            <div>
              <label className={labelCls}>Short Description</label>
              <textarea name="short_description" value={form.short_description} onChange={handleChange} rows={2} className={`${inputCls} resize-none`} />
            </div>
            <div>
              <label className={labelCls}>Description (one paragraph per line)</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={5} className={`${inputCls} resize-none`} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Problem</label>
                <textarea name="problem" value={form.problem} onChange={handleChange} rows={3} className={`${inputCls} resize-none`} />
              </div>
              <div>
                <label className={labelCls}>Approach</label>
                <textarea name="approach" value={form.approach} onChange={handleChange} rows={3} className={`${inputCls} resize-none`} />
              </div>
            </div>
          </section>

          {/* Details */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-brand-accent uppercase tracking-wide">Details</h3>
            <div>
              <label className={labelCls}>Tech Stack (one per line)</label>
              <textarea name="tech_stack" value={form.tech_stack} onChange={handleChange} rows={3} className={`${inputCls} resize-none`} />
            </div>
            <div>
              <label className={labelCls}>Features (one per line)</label>
              <textarea name="features" value={form.features} onChange={handleChange} rows={4} className={`${inputCls} resize-none`} />
            </div>
            <div>
              <label className={labelCls}>Results (one per line)</label>
              <textarea name="results" value={form.results} onChange={handleChange} rows={3} className={`${inputCls} resize-none`} />
            </div>
          </section>

          {/* Links */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-brand-accent uppercase tracking-wide">Links</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>GitHub URL</label>
                <input name="github_url" value={form.github_url} onChange={handleChange} className={inputCls} placeholder="https://github.com/…" />
              </div>
              <div>
                <label className={labelCls}>Demo URL</label>
                <input name="demo_url" value={form.demo_url} onChange={handleChange} className={inputCls} placeholder="https://…" />
              </div>
            </div>
          </section>

          {/* Screenshots — edit mode only */}
          {modal.mode === 'edit' && (
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-brand-accent uppercase tracking-wide">Screenshots</h3>
              {screenshots.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {screenshots.map((src) => (
                    <div key={src} className="relative group aspect-video rounded-lg overflow-hidden border border-brand-border">
                      <img src={getPhotoUrl(src)} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleDeleteScreenshot(src)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/90 text-white
                                   flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleScreenshotUpload} />
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-brand-border text-brand-muted
                           hover:border-brand-accent hover:text-brand-accent transition-colors text-sm disabled:opacity-50"
              >
                {uploading
                  ? <span className="w-4 h-4 border-2 border-brand-muted border-t-brand-accent rounded-full animate-spin" />
                  : <ImagePlus className="w-4 h-4" />}
                {uploading ? 'Uploading…' : 'Add Screenshot'}
              </button>
            </section>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {saving ? 'Saving…' : modal.mode === 'create' ? 'Create Project' : 'Save Changes'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function AdminProjects() {
  const { data: rawProjects, loading, error, refetch } = useApi(getProjects)
  const [modal, setModal] = useState<ModalState | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const projects = rawProjects?.map(mapProject) ?? []

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete project "${id}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      await adminDeleteProject(id)
      toast.success('Project deleted')
      refetch()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="w-8 h-8 border-2 border-brand-accent/30 border-t-brand-accent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="glass rounded-xl p-6 text-red-400">Failed to load projects: {error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-brand-muted mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setModal({ mode: 'create' })}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border">
                <th className="text-left px-4 py-3 text-brand-muted font-medium">#</th>
                <th className="text-left px-4 py-3 text-brand-muted font-medium">Title</th>
                <th className="text-left px-4 py-3 text-brand-muted font-medium hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-brand-muted font-medium hidden sm:table-cell">Status</th>
                <th className="text-left px-4 py-3 text-brand-muted font-medium hidden lg:table-cell">Priority</th>
                <th className="text-center px-4 py-3 text-brand-muted font-medium hidden lg:table-cell">Featured</th>
                <th className="text-right px-4 py-3 text-brand-muted font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, idx) => (
                <tr key={project.id} className="border-b border-brand-border/50 hover:bg-brand-subtle/40 transition-colors">
                  <td className="px-4 py-3 text-brand-muted">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <div className="text-white font-medium">{project.title}</div>
                    <div className="text-brand-muted text-xs">{project.id}</div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="tech-badge">{project.category}</span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-brand-muted">{project.status}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-brand-muted">{project.priority}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-center">
                    {project.featured
                      ? <CheckSquare className="w-4 h-4 text-brand-accent mx-auto" />
                      : <Square className="w-4 h-4 text-brand-muted mx-auto" />
                    }
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setModal({ mode: 'edit', project })}
                        className="p-1.5 text-brand-muted hover:text-brand-accent transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        disabled={deleting === project.id}
                        className="p-1.5 text-brand-muted hover:text-red-400 transition-colors disabled:opacity-40"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-brand-muted">
                    No projects yet. Click "Add Project" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <ProjectModal
          modal={modal}
          onClose={() => setModal(null)}
          onSaved={refetch}
        />
      )}
    </div>
  )
}
