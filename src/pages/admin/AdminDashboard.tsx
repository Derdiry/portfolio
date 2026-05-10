import { Eye, Folder, TrendingUp, Users } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useApi } from '@/hooks/useApi'
import { adminGetAnalytics } from '@/lib/api'

const tooltipStyle = {
  contentStyle: {
    background: '#0d1117',
    border: '1px solid #1e2235',
    borderRadius: 8,
    color: '#e2e8f0',
  },
  labelStyle: { color: '#94a3b8' },
}

interface StatCardProps {
  label: string
  value: number | string
  icon: React.ElementType
  color: string
}

function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="glass rounded-xl p-5 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-brand-muted text-sm">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { data, loading, error } = useApi(adminGetAnalytics)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="w-8 h-8 border-2 border-brand-accent/30 border-t-brand-accent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass rounded-xl p-6 text-red-400">
        Failed to load analytics: {error}
      </div>
    )
  }

  if (!data) return null

  // Daily views chart data
  const dailyData = data.views_last_30_days.map(d => ({
    date: d.date.slice(5), // MM-DD
    views: d.views,
  }))

  // Views by page — top 8
  const pageData = Object.entries(data.views_by_page)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([page, views]) => ({ page, views }))

  const pagesTracked = Object.keys(data.views_by_page).length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-brand-muted mt-1">Analytics overview for your portfolio</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Views"
          value={data.total_views.toLocaleString()}
          icon={Eye}
          color="bg-brand-accent/20"
        />
        <StatCard
          label="Unique Visitors"
          value={data.unique_visitors.toLocaleString()}
          icon={Users}
          color="bg-green-500/20"
        />
        <StatCard
          label="Pages Tracked"
          value={pagesTracked}
          icon={TrendingUp}
          color="bg-blue-500/20"
        />
        <StatCard
          label="Projects Viewed"
          value={data.top_projects.length}
          icon={Folder}
          color="bg-amber-500/20"
        />
      </div>

      {/* Daily views chart */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Daily Views (Last 30 Days)</h2>
        {dailyData.length === 0 ? (
          <p className="text-brand-muted text-sm">No data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2235" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#1e2235' }}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip {...tooltipStyle} />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#06b6d4' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Views by page chart */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Views by Page</h2>
        {pageData.length === 0 ? (
          <p className="text-brand-muted text-sm">No data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(200, pageData.length * 36)}>
            <BarChart data={pageData} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2235" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#1e2235' }}
              />
              <YAxis
                type="category"
                dataKey="page"
                width={140}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="views" fill="#06b6d4" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
