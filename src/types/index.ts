export type ProjectCategory =
  | 'time_series'
  | 'nlp_rag'
  | 'mlops'
  | 'industrial_ai'
  | 'business_intelligence'
  | 'computer_vision'

export type ProjectStatus = 'complete' | 'in_progress' | 'papers_in_prep'

export interface Project {
  id: string
  title: string
  subtitle: string
  category: ProjectCategory
  status: ProjectStatus
  shortDescription: string
  description: string[]
  problem: string
  approach: string
  techStack: string[]
  features: string[]
  results: string[]
  githubUrl?: string
  demoUrl?: string
  architectureImage?: string
  screenshots: string[]
  featured: boolean
  priority: number
}

export interface Experience {
  id: string
  role: string
  company: string
  location: string
  startDate: string
  endDate: string
  highlights: string[]
}

export interface Education {
  id: string
  school: string
  degree: string
  field: string
  startYear: number
  endYear: number
  location: string
  note?: string
}

export interface SkillGroup {
  category: string
  skills: string[]
}
