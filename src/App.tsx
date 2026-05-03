import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from '@/context/ThemeContext'
import { AuthProvider } from '@/context/AuthContext'
import ProtectedRoute from '@/components/admin/ProtectedRoute'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Home from '@/pages/Home'
import Projects from '@/pages/Projects'
import ProjectDetail from '@/pages/ProjectDetail'
import About from '@/pages/About'
import Resume from '@/pages/Resume'
import Contact from '@/pages/Contact'
import { logPageView } from '@/lib/api'

const AdminLogin     = lazy(() => import('@/pages/admin/AdminLogin'))
const AdminLayout    = lazy(() => import('@/pages/admin/AdminLayout'))
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))
const AdminProfile   = lazy(() => import('@/pages/admin/AdminProfile'))
const AdminProjects  = lazy(() => import('@/pages/admin/AdminProjects'))
const AdminContent   = lazy(() => import('@/pages/admin/AdminContent'))

function getVisitorId(): string {
  const key = 'portfolio_vid'
  let vid = localStorage.getItem(key)
  if (!vid) {
    vid = crypto.randomUUID()
    localStorage.setItem(key, vid)
  }
  return vid
}

function Analytics() {
  const { pathname } = useLocation()
  useEffect(() => {
    logPageView({
      page: pathname,
      visitor_id: getVisitorId(),
      referrer: document.referrer || undefined,
      user_agent: navigator.userAgent,
    }).catch(() => {
      // Silently ignore — analytics must never break the page
    })
  }, [pathname])
  return null
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <ScrollToTop />
      <Analytics />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/"             element={<Home />} />
          <Route path="/projects"     element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/about"        element={<About />} />
          <Route path="/resume"       element={<Resume />} />
          <Route path="/contact"      element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ThemeProvider>
          <BrowserRouter>
            <Toaster position="bottom-right" />
            <Suspense fallback={
              <div className="min-h-screen bg-brand-bg flex items-center justify-center">
                <span className="text-brand-muted font-mono text-sm animate-pulse">Loading…</span>
              </div>
            }>
              <Routes>
                {/* Admin routes — no Navbar/Footer */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="profile"   element={<AdminProfile />} />
                    <Route path="projects"  element={<AdminProjects />} />
                    <Route path="content"   element={<AdminContent />} />
                  </Route>
                </Route>

                {/* Public routes — with Navbar/Footer */}
                <Route path="/*" element={<PublicLayout />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </HelmetProvider>
  )
}
