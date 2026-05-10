import type {
  Project,
  ProjectCategory,
  ProjectStatus,
  Experience,
  Education,
} from '@/types'

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const { headers: extraHeaders, ...restOptions } = options ?? {}
  const res = await fetch(`${BASE}${path}`, {
    ...restOptions,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`API ${res.status}: ${body}`)
  }
  // 204 No Content
  if (res.status === 204) return undefined as T
  return res.json()
}

// ── Profile ──────────────────────────────────────────────────────────────────

export interface ApiProfile {
  name: string
  title: string
  bio: string
  email: string
  phone: string
  linkedin: string
  github: string
  location: string
  photo_url: string | null
  patent: {
    number: string
    title: string
    status: string
    role: string
  }
}

export const getProfile = () => request<ApiProfile>('/api/profile')

// ── Projects ─────────────────────────────────────────────────────────────────

export interface ApiProject {
  id: string
  title: string
  subtitle: string
  category: string
  status: string
  short_description: string
  description: string[]
  problem: string
  approach: string
  tech_stack: string[]
  features: string[]
  results: string[]
  github_url: string | null
  demo_url: string | null
  architecture_image: string | null
  screenshots: string[]
  featured: boolean
  priority: number
  created_at: string
}

export const getProjects = () => request<ApiProject[]>('/api/projects')
export const getProject  = (id: string) => request<ApiProject>(`/api/projects/${id}`)

// ── Experience / Education / Skills ──────────────────────────────────────────

export interface ApiExperience {
  id: number
  role: string
  company: string
  location: string
  start_date: string
  end_date: string
  highlights: string[]
  order: number
}

export interface ApiEducation {
  id: number
  school: string
  degree: string
  field: string
  start_year: number
  end_year: number
  location: string
  note: string | null
  order: number
}

export interface ApiSkillGroup {
  category: string
  skills: string[]
}

export const getExperience = () => request<ApiExperience[]>('/api/experience')
export const getEducation  = () => request<ApiEducation[]>('/api/education')
export const getSkills     = () => request<ApiSkillGroup[]>('/api/skills')

// ── Contact ──────────────────────────────────────────────────────────────────

export interface ContactPayload {
  name: string
  email: string
  subject: string
  message: string
}

export const sendContact = (payload: ContactPayload) =>
  request<{ success: boolean; message: string }>('/api/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

// ── Analytics ────────────────────────────────────────────────────────────────

export interface PageViewPayload {
  page: string
  visitor_id: string
  referrer?: string
  country?: string
  user_agent?: string
}

export const logPageView = (payload: PageViewPayload) =>
  request<void>('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

// ── Auth ─────────────────────────────────────────────────────────────────────

export const login = (username: string, password: string) =>
  request<{ access_token: string; token_type: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })

function authHeader(): Record<string, string> {
  const token = localStorage.getItem('admin_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ── Admin ────────────────────────────────────────────────────────────────────

export const adminUpdateProfile = (data: Partial<ApiProfile>) =>
  request<ApiProfile>('/api/admin/profile', {
    method: 'PUT',
    headers: authHeader(),
    body: JSON.stringify(data),
  })

export const adminCreateProject = (data: Omit<ApiProject, 'created_at'>) =>
  request<ApiProject>('/api/admin/projects', {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(data),
  })

export const adminUpdateProject = (id: string, data: Partial<ApiProject>) =>
  request<ApiProject>(`/api/admin/projects/${id}`, {
    method: 'PUT',
    headers: authHeader(),
    body: JSON.stringify(data),
  })

export const adminDeleteProject = (id: string) =>
  request<void>(`/api/admin/projects/${id}`, {
    method: 'DELETE',
    headers: authHeader(),
  })

// ── Mappers (API snake_case → frontend camelCase) ────────────────────────────

export function mapProject(p: ApiProject): Project {
  return {
    id: p.id,
    title: p.title,
    subtitle: p.subtitle,
    category: p.category as ProjectCategory,
    status: p.status as ProjectStatus,
    shortDescription: p.short_description,
    description: p.description,
    problem: p.problem,
    approach: p.approach,
    techStack: p.tech_stack,
    features: p.features,
    results: p.results,
    githubUrl: p.github_url ?? undefined,
    demoUrl: p.demo_url ?? undefined,
    architectureImage: p.architecture_image ?? undefined,
    screenshots: p.screenshots ?? [],
    featured: p.featured,
    priority: p.priority,
  }
}

export const adminUploadScreenshot = (projectId: string, file: File) => {
  const form = new FormData()
  form.append('file', file)
  return request<ApiProject>(`/api/admin/projects/${projectId}/screenshots`, {
    method: 'POST',
    headers: authHeader(),
    body: form,
  })
}

export const adminDeleteScreenshot = (projectId: string, filename: string) =>
  request<ApiProject>(`/api/admin/projects/${projectId}/screenshots/${filename}`, {
    method: 'DELETE',
    headers: authHeader(),
  })

export function mapExperience(e: ApiExperience): Experience {
  return {
    id: String(e.id),
    role: e.role,
    company: e.company,
    location: e.location,
    startDate: e.start_date,
    endDate: e.end_date,
    highlights: e.highlights,
  }
}

export function mapEducation(e: ApiEducation): Education {
  return {
    id: String(e.id),
    school: e.school,
    degree: e.degree,
    field: e.field,
    startYear: e.start_year,
    endYear: e.end_year,
    location: e.location,
    note: e.note ?? undefined,
  }
}

export const adminGetAnalytics = () =>
  request<{
    total_views: number
    unique_visitors: number
    views_by_page: Record<string, number>
    views_last_30_days: Array<{ date: string; views: number }>
    top_projects: Array<{ page: string; views: number }>
  }>('/api/admin/analytics/stats', { headers: authHeader() })

// ── Photo Upload (multipart — can't use generic request()) ───────────────────

export const adminUploadPhoto = async (file: File): Promise<{ photo_url: string }> => {
  const token = localStorage.getItem('admin_token')
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(`${BASE}/api/admin/profile/photo`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  })
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`)
  return res.json()
}

// ── Experience admin ─────────────────────────────────────────────────────────

export const adminCreateExperience = (data: Omit<ApiExperience, 'id'>) =>
  request<ApiExperience>('/api/admin/experience', {
    method: 'POST', headers: authHeader(), body: JSON.stringify(data),
  })

export const adminUpdateExperience = (id: number, data: Partial<Omit<ApiExperience, 'id'>>) =>
  request<ApiExperience>(`/api/admin/experience/${id}`, {
    method: 'PUT', headers: authHeader(), body: JSON.stringify(data),
  })

export const adminDeleteExperience = (id: number) =>
  request<void>(`/api/admin/experience/${id}`, {
    method: 'DELETE', headers: authHeader(),
  })

// ── Education admin ──────────────────────────────────────────────────────────

export const adminCreateEducation = (data: Omit<ApiEducation, 'id'>) =>
  request<ApiEducation>('/api/admin/education', {
    method: 'POST', headers: authHeader(), body: JSON.stringify(data),
  })

export const adminUpdateEducation = (id: number, data: Partial<Omit<ApiEducation, 'id'>>) =>
  request<ApiEducation>(`/api/admin/education/${id}`, {
    method: 'PUT', headers: authHeader(), body: JSON.stringify(data),
  })

export const adminDeleteEducation = (id: number) =>
  request<void>(`/api/admin/education/${id}`, {
    method: 'DELETE', headers: authHeader(),
  })

// ── Skills admin (replace all) ───────────────────────────────────────────────

export const adminUpdateSkills = (groups: ApiSkillGroup[]) =>
  request<ApiSkillGroup[]>('/api/admin/skills', {
    method: 'PUT', headers: authHeader(), body: JSON.stringify(groups),
  })

// ── Photo URL helper ─────────────────────────────────────────────────────────

export const getPhotoUrl = (photo_url: string | null): string | null => {
  if (!photo_url) return null
  if (photo_url.startsWith('http')) return photo_url
  // Return same-origin /uploads/* — Vercel proxies to Railway, bypassing Adblock
  return photo_url.startsWith('/uploads/') ? photo_url : `/uploads/${photo_url.split('/').pop()}`
}

// ── Resume ───────────────────────────────────────────────────────────────────

export const getResumeUrl = () => '/uploads/resume.pdf'

export const adminUploadResume = async (file: File): Promise<{ resume_url: string }> => {
  const token = localStorage.getItem('admin_token')
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(`${BASE}/api/admin/resume`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  })
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`)
  return res.json()
}
