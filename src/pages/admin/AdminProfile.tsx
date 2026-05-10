import { type ChangeEvent, type FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import { Download, FileText, Upload, User } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'
import { toast } from 'react-hot-toast'
import { useApi } from '@/hooks/useApi'
import {
  type ApiProfile,
  adminUploadPhoto,
  adminUploadResume,
  getPhotoUrl,
  getProfile,
} from '@/lib/api'
import { adminUpdateProfile as _adminUpdateProfile } from '@/lib/api'

// Flat update payload that maps to the backend's ProfileUpdate schema
interface ProfileUpdatePayload {
  name?: string
  title?: string
  location?: string
  email?: string
  phone?: string
  linkedin?: string
  github?: string
  bio?: string
  patent_number?: string
  patent_title?: string
  patent_status?: string
  patent_role?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adminUpdateProfile = (data: ProfileUpdatePayload) => _adminUpdateProfile(data as any)

// ── Profile Form ─────────────────────────────────────────────────────────────

interface ProfileFormData {
  name: string
  title: string
  location: string
  email: string
  phone: string
  linkedin: string
  github: string
  bio: string
  patent_number: string
  patent_title: string
  patent_status: string
  patent_role: string
}

function profileToForm(p: ApiProfile): ProfileFormData {
  return {
    name: p.name,
    title: p.title,
    location: p.location,
    email: p.email,
    phone: p.phone,
    linkedin: p.linkedin,
    github: p.github,
    bio: p.bio,
    patent_number: p.patent.number,
    patent_title: p.patent.title,
    patent_status: p.patent.status,
    patent_role: p.patent.role,
  }
}

// ── QR Download ──────────────────────────────────────────────────────────────

function downloadQr(wrapperRef: React.RefObject<HTMLDivElement | null>, filename: string) {
  const canvas = wrapperRef.current?.querySelector('canvas')
  if (!canvas) return
  const a = document.createElement('a')
  a.href = canvas.toDataURL('image/png')
  a.download = filename
  a.click()
}

// ── QR Card ──────────────────────────────────────────────────────────────────

interface QrCardProps {
  label: string
  value: string
  filename: string
}

function QrCard({ label, value, filename }: QrCardProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs text-brand-muted font-medium">{label}</p>
      <div ref={wrapperRef} className="bg-white p-2 rounded-lg">
        <QRCodeCanvas value={value} size={96} />
      </div>
      <button
        type="button"
        onClick={() => downloadQr(wrapperRef, filename)}
        className="flex items-center gap-1 text-xs text-brand-accent hover:text-brand-accent/70 transition-colors"
      >
        <Download className="w-3 h-3" />
        Download
      </button>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AdminProfile() {
  const { data: profile, loading, error, refetch } = useApi(getProfile)
  const [form, setForm] = useState<ProfileFormData | null>(null)
  const [saving, setSaving] = useState(false)

  // Photo state
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const photoInputRef  = useRef<HTMLInputElement>(null)

  // Resume state
  const [uploadingResume, setUploadingResume] = useState(false)
  const resumeInputRef = useRef<HTMLInputElement>(null)

  // Sync form when profile loads (only on first load)
  if (profile && !form) {
    setForm(profileToForm(profile))
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => prev ? { ...prev, [name]: value } : prev)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form) return
    setSaving(true)
    try {
      await adminUpdateProfile({
        name: form.name,
        title: form.title,
        location: form.location,
        email: form.email,
        phone: form.phone,
        linkedin: form.linkedin,
        github: form.github,
        bio: form.bio,
        patent_number: form.patent_number,
        patent_title: form.patent_title,
        patent_status: form.patent_status,
        patent_role: form.patent_role,
      })
      toast.success('Profile saved')
      refetch()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  // Native listener — bypasses React event delegation which extensions can block
  const onPhotoChange = useCallback(async () => {
    const input = photoInputRef.current
    const file  = input?.files?.[0]
    if (!file) return
    setPreviewUrl(URL.createObjectURL(file))
    setUploading(true)
    try {
      await adminUploadPhoto(file)
      toast.success('Photo uploaded')
      refetch()
    } catch (err) {
      console.error('Photo upload error:', err)
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (input) input.value = ''
    }
  }, [refetch])

  const onResumeChange = useCallback(async () => {
    const input = resumeInputRef.current
    const file  = input?.files?.[0]
    if (!file) return
    setUploadingResume(true)
    try {
      await adminUploadResume(file)
      toast.success('Resume uploaded')
    } catch (err) {
      console.error('Resume upload error:', err)
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploadingResume(false)
      if (input) input.value = ''
    }
  }, [])

  useEffect(() => {
    const el = photoInputRef.current
    if (!el) return
    el.addEventListener('change', onPhotoChange)
    return () => el.removeEventListener('change', onPhotoChange)
  }, [onPhotoChange])

  useEffect(() => {
    const el = resumeInputRef.current
    if (!el) return
    el.addEventListener('change', onResumeChange)
    return () => el.removeEventListener('change', onResumeChange)
  }, [onResumeChange])

  // Kept for type-compatibility on the overlay inputs (no-op — native listener handles it)
  const noop = (_e: ChangeEvent<HTMLInputElement>) => {}

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="w-8 h-8 border-2 border-brand-accent/30 border-t-brand-accent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="glass rounded-xl p-6 text-red-400">Failed to load profile: {error}</div>
  }

  if (!form || !profile) return null

  const currentPhoto = previewUrl ?? getPhotoUrl(profile.photo_url)
  const vCardValue = `BEGIN:VCARD\nVERSION:3.0\nFN:${profile.name}\nTEL:${profile.phone}\nEMAIL:${profile.email}\nEND:VCARD`

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-brand-muted mt-1">Manage your public profile information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left col: profile form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="glass rounded-xl p-6 space-y-5">
            <h2 className="text-lg font-semibold text-white">Basic Information</h2>

            {/* Row: name + title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(['name', 'title'] as const).map(field => (
                <div key={field}>
                  <label className="block text-sm text-brand-muted mb-1 capitalize">{field}</label>
                  <input
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-brand-subtle border border-brand-border text-white placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-colors text-sm"
                  />
                </div>
              ))}
            </div>

            {/* Row: location + email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(['location', 'email'] as const).map(field => (
                <div key={field}>
                  <label className="block text-sm text-brand-muted mb-1 capitalize">{field}</label>
                  <input
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-brand-subtle border border-brand-border text-white placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-colors text-sm"
                  />
                </div>
              ))}
            </div>

            {/* Row: phone + linkedin */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(['phone', 'linkedin'] as const).map(field => (
                <div key={field}>
                  <label className="block text-sm text-brand-muted mb-1 capitalize">{field}</label>
                  <input
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-brand-subtle border border-brand-border text-white placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-colors text-sm"
                  />
                </div>
              ))}
            </div>

            {/* GitHub */}
            <div>
              <label className="block text-sm text-brand-muted mb-1">GitHub</label>
              <input
                name="github"
                value={form.github}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-brand-subtle border border-brand-border text-white placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-colors text-sm"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm text-brand-muted mb-1">Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={6}
                className="w-full px-3 py-2 rounded-lg bg-brand-subtle border border-brand-border text-white placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-colors text-sm resize-none"
              />
            </div>

            <h2 className="text-lg font-semibold text-white pt-2">Patent</h2>

            {/* Patent row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(['patent_number', 'patent_title'] as const).map(field => (
                <div key={field}>
                  <label className="block text-sm text-brand-muted mb-1">
                    {field === 'patent_number' ? 'Number' : 'Title'}
                  </label>
                  <input
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-brand-subtle border border-brand-border text-white placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-colors text-sm"
                  />
                </div>
              ))}
            </div>

            {/* Patent row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(['patent_status', 'patent_role'] as const).map(field => (
                <div key={field}>
                  <label className="block text-sm text-brand-muted mb-1">
                    {field === 'patent_status' ? 'Status' : 'Role'}
                  </label>
                  <input
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-brand-subtle border border-brand-border text-white placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-colors text-sm"
                  />
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving && (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {saving ? 'Saving…' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>

        {/* Right col: photo + QR */}
        <div className="space-y-6">
          {/* Photo upload card */}
          <div className="glass rounded-xl p-6 flex flex-col items-center gap-4">
            <h2 className="text-lg font-semibold text-white self-start">Photo</h2>

            {/* Avatar preview */}
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-brand-subtle border-2 border-brand-border">
              {currentPhoto ? (
                <img src={currentPhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-12 h-12 text-brand-muted" />
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </div>

            <div className="relative">
              <div className={`btn-secondary flex items-center gap-2 select-none ${uploading ? 'opacity-60' : ''}`}>
                <Upload className="w-4 h-4" />
                {uploading ? 'Uploading…' : 'Upload Photo'}
              </div>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={noop}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-brand-muted text-center">
              Accepts any image. Auto-cropped to 400×400 square.
            </p>
          </div>

          {/* QR Codes card */}
          <div className="glass rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">QR Codes</h2>
            <div className="flex flex-col gap-6">
              <QrCard
                label="LinkedIn"
                value="https://linkedin.com/in/mohamedalderdiry"
                filename="qr-linkedin.png"
              />
              <QrCard
                label="Portfolio"
                value={typeof window !== 'undefined' ? window.location.origin : 'https://mohamedalderdiry.com'}
                filename="qr-portfolio.png"
              />
              <QrCard
                label="vCard"
                value={vCardValue}
                filename="qr-vcard.png"
              />
            </div>
          </div>

          {/* Resume PDF card */}
          <div className="glass rounded-xl p-6 flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-white">Resume PDF</h2>

            <div className="flex items-center justify-center w-full h-20 rounded-lg bg-brand-subtle border border-brand-border">
              <FileText className="w-8 h-8 text-brand-muted" />
            </div>

            <div className="relative w-full">
              <div className={`btn-secondary flex items-center gap-2 cursor-pointer justify-center w-full select-none ${uploadingResume ? 'opacity-60' : ''}`}>
                <Upload className="w-4 h-4" />
                {uploadingResume ? 'Uploading…' : 'Upload PDF'}
              </div>
              <input
                ref={resumeInputRef}
                type="file"
                accept=".pdf"
                onChange={noop}
                disabled={uploadingResume}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
            </div>

            <p className="text-xs text-brand-muted text-center">
              Current resume served at /uploads/resume.pdf
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
