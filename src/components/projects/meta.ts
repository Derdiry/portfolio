import type { ProjectCategory, ProjectStatus } from '@/types'

export const CATEGORY_META: Record<ProjectCategory, { label: string; color: string }> = {
  time_series:          { label: 'Time Series',   color: 'text-amber-400 border-amber-400/30  bg-amber-400/10'  },
  nlp_rag:              { label: 'NLP / RAG',     color: 'text-violet-400 border-violet-400/30 bg-violet-400/10' },
  mlops:                { label: 'MLOps',         color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' },
  industrial_ai:        { label: 'Industrial AI', color: 'text-blue-400 border-blue-400/30 bg-blue-400/10'     },
  business_intelligence:{ label: 'Business Intelligence', color: 'text-orange-400 border-orange-400/30 bg-orange-400/10' },
  computer_vision:      { label: 'Computer Vision', color: 'text-pink-400 border-pink-400/30 bg-pink-400/10'  },
}

export const STATUS_META: Record<ProjectStatus, { label: string; color: string; dot: string }> = {
  complete:       { label: 'Complete',       color: 'text-green-400 border-green-400/30 bg-green-400/10',   dot: 'bg-green-400'  },
  in_progress:    { label: 'In Progress',    color: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10', dot: 'bg-yellow-400' },
  papers_in_prep: { label: 'Papers in Prep', color: 'text-blue-400 border-blue-400/30 bg-blue-400/10',      dot: 'bg-blue-400'   },
}

export const ALL_CATEGORIES: Array<{ value: ProjectCategory | 'all'; label: string }> = [
  { value: 'all',                   label: 'All'                  },
  { value: 'time_series',           label: 'Time Series'          },
  { value: 'nlp_rag',               label: 'NLP / RAG'            },
  { value: 'mlops',                 label: 'MLOps'                },
  { value: 'industrial_ai',         label: 'Industrial AI'        },
  { value: 'business_intelligence', label: 'Business Intelligence' },
  { value: 'computer_vision',       label: 'Computer Vision'      },
]
