import { type ChangeEvent, type FormEvent, useState } from 'react'
import { Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useApi } from '@/hooks/useApi'
import {
  type ApiEducation,
  type ApiExperience,
  type ApiSkillGroup,
  adminCreateEducation,
  adminCreateExperience,
  adminDeleteEducation,
  adminDeleteExperience,
  adminUpdateEducation,
  adminUpdateExperience,
  adminUpdateSkills,
  getEducation,
  getExperience,
  getSkills,
  mapEducation,
  mapExperience,
} from '@/lib/api'

type Tab = 'experience' | 'education' | 'skills'

// ── Shared helpers ────────────────────────────────────────────────────────────

const inputCls = 'w-full px-3 py-2 rounded-lg bg-brand-subtle border border-brand-border text-white placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-colors text-sm'
const labelCls = 'block text-sm text-brand-muted mb-1'

// ── Experience Tab ────────────────────────────────────────────────────────────

interface ExpForm {
  role: string
  company: string
  location: string
  start_date: string
  end_date: string
  highlights: string
  order: string
}

const emptyExpForm = (): ExpForm => ({
  role: '', company: '', location: '', start_date: '', end_date: '', highlights: '', order: '0',
})

function expToForm(e: ApiExperience): ExpForm {
  return {
    role: e.role,
    company: e.company,
    location: e.location,
    start_date: e.start_date,
    end_date: e.end_date,
    highlights: e.highlights.join('\n'),
    order: String(e.order),
  }
}

function expFormToApi(f: ExpForm): Omit<ApiExperience, 'id'> {
  return {
    role: f.role,
    company: f.company,
    location: f.location,
    start_date: f.start_date,
    end_date: f.end_date,
    highlights: f.highlights.split('\n').map(s => s.trim()).filter(Boolean),
    order: parseInt(f.order) || 0,
  }
}

type ExpModalState = { mode: 'create' } | { mode: 'edit'; item: ApiExperience }

interface ExpModalProps {
  modal: ExpModalState
  onClose: () => void
  onSaved: () => void
}

function ExpModal({ modal, onClose, onSaved }: ExpModalProps) {
  const [form, setForm] = useState<ExpForm>(() =>
    modal.mode === 'edit' ? expToForm(modal.item) : emptyExpForm()
  )
  const [saving, setSaving] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    setSaving(true)
    try {
      if (modal.mode === 'create') {
        await adminCreateExperience(expFormToApi(form))
        toast.success('Experience added')
      } else {
        await adminUpdateExperience(modal.item.id, expFormToApi(form))
        toast.success('Experience updated')
      }
      onSaved()
      onClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto glass rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            {modal.mode === 'create' ? 'Add Experience' : 'Edit Experience'}
          </h2>
          <button onClick={onClose} className="text-brand-muted hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Role</label>
              <input name="role" value={form.role} onChange={handleChange} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Company</label>
              <input name="company" value={form.company} onChange={handleChange} required className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Location</label>
            <input name="location" value={form.location} onChange={handleChange} className={inputCls} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Start Date</label>
              <input name="start_date" value={form.start_date} onChange={handleChange} className={inputCls} placeholder="Jan 2020" />
            </div>
            <div>
              <label className={labelCls}>End Date</label>
              <input name="end_date" value={form.end_date} onChange={handleChange} className={inputCls} placeholder="Present" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Highlights (one per line)</label>
            <textarea name="highlights" value={form.highlights} onChange={handleChange} rows={5} className={`${inputCls} resize-none`} />
          </div>
          <div>
            <label className={labelCls}>Order</label>
            <input name="order" type="number" value={form.order} onChange={handleChange} className={inputCls} />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-60">
              {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {saving ? 'Saving…' : modal.mode === 'create' ? 'Add' : 'Save'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ExperienceTab() {
  const { data: rawData, loading, error, refetch } = useApi(getExperience)
  const [modal, setModal] = useState<ExpModalState | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)

  const items = rawData ?? []

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this experience entry?')) return
    setDeleting(id)
    try {
      await adminDeleteExperience(id)
      toast.success('Experience deleted')
      refetch()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return <Spinner />
  if (error) return <ErrorMsg msg={error} />

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setModal({ mode: 'create' })} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Experience
        </button>
      </div>

      <div className="space-y-3">
        {items.map(item => {
          const mapped = mapExperience(item)
          return (
            <div key={item.id} className="glass rounded-xl p-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-white font-medium">{mapped.role}</p>
                <p className="text-brand-accent text-sm">{mapped.company}</p>
                <p className="text-brand-muted text-xs mt-0.5">{mapped.startDate} – {mapped.endDate}</p>
                <p className="text-brand-muted text-xs">{mapped.highlights.length} highlight{mapped.highlights.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setModal({ mode: 'edit', item })}
                  className="p-1.5 text-brand-muted hover:text-brand-accent transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deleting === item.id}
                  className="p-1.5 text-brand-muted hover:text-red-400 transition-colors disabled:opacity-40"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
        {items.length === 0 && (
          <p className="text-brand-muted text-sm text-center py-8">No experience entries yet.</p>
        )}
      </div>

      {modal && <ExpModal modal={modal} onClose={() => setModal(null)} onSaved={refetch} />}
    </div>
  )
}

// ── Education Tab ─────────────────────────────────────────────────────────────

interface EduForm {
  school: string
  degree: string
  field: string
  start_year: string
  end_year: string
  location: string
  note: string
  order: string
}

const emptyEduForm = (): EduForm => ({
  school: '', degree: '', field: '', start_year: '', end_year: '', location: '', note: '', order: '0',
})

function eduToForm(e: ApiEducation): EduForm {
  return {
    school: e.school,
    degree: e.degree,
    field: e.field,
    start_year: String(e.start_year),
    end_year: String(e.end_year),
    location: e.location,
    note: e.note ?? '',
    order: String(e.order),
  }
}

function eduFormToApi(f: EduForm): Omit<ApiEducation, 'id'> {
  return {
    school: f.school,
    degree: f.degree,
    field: f.field,
    start_year: parseInt(f.start_year) || 0,
    end_year: parseInt(f.end_year) || 0,
    location: f.location,
    note: f.note || null,
    order: parseInt(f.order) || 0,
  }
}

type EduModalState = { mode: 'create' } | { mode: 'edit'; item: ApiEducation }

interface EduModalProps {
  modal: EduModalState
  onClose: () => void
  onSaved: () => void
}

function EduModal({ modal, onClose, onSaved }: EduModalProps) {
  const [form, setForm] = useState<EduForm>(() =>
    modal.mode === 'edit' ? eduToForm(modal.item) : emptyEduForm()
  )
  const [saving, setSaving] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    setSaving(true)
    try {
      if (modal.mode === 'create') {
        await adminCreateEducation(eduFormToApi(form))
        toast.success('Education added')
      } else {
        await adminUpdateEducation(modal.item.id, eduFormToApi(form))
        toast.success('Education updated')
      }
      onSaved()
      onClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto glass rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            {modal.mode === 'create' ? 'Add Education' : 'Edit Education'}
          </h2>
          <button onClick={onClose} className="text-brand-muted hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>School</label>
              <input name="school" value={form.school} onChange={handleChange} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Degree</label>
              <input name="degree" value={form.degree} onChange={handleChange} required className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Field of Study</label>
            <input name="field" value={form.field} onChange={handleChange} className={inputCls} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className={labelCls}>Start Year</label>
              <input name="start_year" type="number" value={form.start_year} onChange={handleChange} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>End Year</label>
              <input name="end_year" type="number" value={form.end_year} onChange={handleChange} className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Location</label>
              <input name="location" value={form.location} onChange={handleChange} className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Note (optional)</label>
            <input name="note" value={form.note} onChange={handleChange} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Order</label>
            <input name="order" type="number" value={form.order} onChange={handleChange} className={inputCls} />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-60">
              {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {saving ? 'Saving…' : modal.mode === 'create' ? 'Add' : 'Save'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function EducationTab() {
  const { data: rawData, loading, error, refetch } = useApi(getEducation)
  const [modal, setModal] = useState<EduModalState | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)

  const items = rawData ?? []

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this education entry?')) return
    setDeleting(id)
    try {
      await adminDeleteEducation(id)
      toast.success('Education deleted')
      refetch()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return <Spinner />
  if (error) return <ErrorMsg msg={error} />

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setModal({ mode: 'create' })} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Education
        </button>
      </div>

      <div className="space-y-3">
        {items.map(item => {
          const mapped = mapEducation(item)
          return (
            <div key={item.id} className="glass rounded-xl p-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-white font-medium">{mapped.degree} in {mapped.field}</p>
                <p className="text-brand-accent text-sm">{mapped.school}</p>
                <p className="text-brand-muted text-xs mt-0.5">{mapped.startYear} – {mapped.endYear}</p>
                <p className="text-brand-muted text-xs">{mapped.location}</p>
                {mapped.note && <p className="text-brand-muted text-xs italic">{mapped.note}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setModal({ mode: 'edit', item })}
                  className="p-1.5 text-brand-muted hover:text-brand-accent transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deleting === item.id}
                  className="p-1.5 text-brand-muted hover:text-red-400 transition-colors disabled:opacity-40"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
        {items.length === 0 && (
          <p className="text-brand-muted text-sm text-center py-8">No education entries yet.</p>
        )}
      </div>

      {modal && <EduModal modal={modal} onClose={() => setModal(null)} onSaved={refetch} />}
    </div>
  )
}

// ── Skills Tab ────────────────────────────────────────────────────────────────

function SkillsTab() {
  const { data: fetchedGroups, loading, error, refetch } = useApi(getSkills)
  const [localGroups, setLocalGroups] = useState<ApiSkillGroup[] | null>(null)
  const [newSkillInputs, setNewSkillInputs] = useState<Record<number, string>>({})
  const [saving, setSaving] = useState(false)

  // Init local state from fetched
  if (fetchedGroups && localGroups === null) {
    setLocalGroups(fetchedGroups.map(g => ({ ...g, skills: [...g.skills] })))
  }

  const groups = localGroups ?? []
  const isDirty = localGroups !== null && JSON.stringify(localGroups) !== JSON.stringify(fetchedGroups)

  const addSkill = (groupIdx: number) => {
    const skill = (newSkillInputs[groupIdx] ?? '').trim()
    if (!skill) return
    setLocalGroups(prev => {
      if (!prev) return prev
      const updated = prev.map((g, i) =>
        i === groupIdx ? { ...g, skills: [...g.skills, skill] } : g
      )
      return updated
    })
    setNewSkillInputs(prev => ({ ...prev, [groupIdx]: '' }))
  }

  const removeSkill = (groupIdx: number, skillIdx: number) => {
    setLocalGroups(prev => {
      if (!prev) return prev
      return prev.map((g, i) =>
        i === groupIdx ? { ...g, skills: g.skills.filter((_, si) => si !== skillIdx) } : g
      )
    })
  }

  const removeGroup = (groupIdx: number) => {
    setLocalGroups(prev => prev ? prev.filter((_, i) => i !== groupIdx) : prev)
  }

  const addCategory = () => {
    setLocalGroups(prev => prev ? [...prev, { category: 'New Category', skills: [] }] : prev)
  }

  const updateCategoryName = (groupIdx: number, name: string) => {
    setLocalGroups(prev => {
      if (!prev) return prev
      return prev.map((g, i) => i === groupIdx ? { ...g, category: name } : g)
    })
  }

  const handleSave = async () => {
    if (!localGroups) return
    setSaving(true)
    try {
      await adminUpdateSkills(localGroups)
      toast.success('Skills saved')
      refetch()
      setLocalGroups(null) // will re-init from fresh fetch
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner />
  if (error) return <ErrorMsg msg={error} />

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={handleSave} disabled={saving || !isDirty} className="btn-primary flex items-center gap-2 disabled:opacity-50">
            {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving…' : 'Save Skills'}
          </button>
          {isDirty && <span className="text-amber-400 text-sm">Unsaved changes</span>}
        </div>
        <button onClick={addCategory} className="btn-secondary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="space-y-4">
        {groups.map((group, gIdx) => (
          <div key={gIdx} className="glass rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <input
                value={group.category}
                onChange={e => updateCategoryName(gIdx, e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-brand-subtle border border-brand-border text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-colors"
              />
              <button
                onClick={() => removeGroup(gIdx)}
                className="p-1.5 text-brand-muted hover:text-red-400 transition-colors shrink-0"
                title="Remove category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {group.skills.map((skill, sIdx) => (
                <span key={sIdx} className="tech-badge flex items-center gap-1.5">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(gIdx, sIdx)}
                    className="text-brand-muted hover:text-red-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                value={newSkillInputs[gIdx] ?? ''}
                onChange={e => setNewSkillInputs(prev => ({ ...prev, [gIdx]: e.target.value }))}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(gIdx) } }}
                placeholder="Add skill…"
                className="flex-1 px-3 py-1.5 rounded-lg bg-brand-subtle border border-brand-border text-white placeholder-brand-muted text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-colors"
              />
              <button
                type="button"
                onClick={() => addSkill(gIdx)}
                className="btn-secondary flex items-center gap-1 text-sm"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Shared UI ─────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div className="flex items-center justify-center h-48">
      <span className="w-8 h-8 border-2 border-brand-accent/30 border-t-brand-accent rounded-full animate-spin" />
    </div>
  )
}

function ErrorMsg({ msg }: { msg: string }) {
  return <div className="glass rounded-xl p-6 text-red-400">{msg}</div>
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function AdminContent() {
  const [tab, setTab] = useState<Tab>('experience')

  const tabs: { key: Tab; label: string }[] = [
    { key: 'experience', label: 'Experience' },
    { key: 'education',  label: 'Education' },
    { key: 'skills',     label: 'Skills' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Content</h1>
        <p className="text-brand-muted mt-1">Manage experience, education, and skills</p>
      </div>

      {/* Tab Bar */}
      <div className="flex items-center border-b border-brand-border gap-1">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t.key
                ? 'text-brand-accent border-brand-accent'
                : 'text-brand-muted border-transparent hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'experience' && <ExperienceTab />}
      {tab === 'education'  && <EducationTab />}
      {tab === 'skills'     && <SkillsTab />}
    </div>
  )
}
