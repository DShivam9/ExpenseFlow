import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { lazy, Suspense, Component, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from './hooks/useAuth'
import { CustomCursor } from './components/common/AnimationUtils'
import { AnimatedBackground } from './components/common/AnimatedBackground'
import Lenis from 'lenis'

// Lazy load pages
const Landing = lazy(() => import('./pages/Landing'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Layout = lazy(() => import('./components/layout/Layout'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Expenses = lazy(() => import('./pages/Expenses'))
const Budgets = lazy(() => import('./pages/Budgets'))
const Settings = lazy(() => import('./pages/Settings'))
const Achievements = lazy(() => import('./pages/Achievements'))
const Reminders = lazy(() => import('./pages/Reminders'))

// Error Boundary to catch render errors
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-8">
          <div className="glass-card p-8 max-w-lg text-center">
            <h2 className="text-xl font-bold text-white mb-4">Something went wrong</h2>
            <p className="text-dark-400 mb-4">{this.state.error?.message || 'An unexpected error occurred'}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

// Minimal spinner for route transitions (only shows AFTER the main Preloader is gone)
const RouteLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
  </div>
)

// Minimal auth loading state - only shown during auth check
const AuthLoadingState = () => (
  <div className="min-h-screen bg-background" />
)

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <AuthLoadingState />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Public Route Component
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <AuthLoadingState />
  }

  if (user) {
    return <Navigate to="/app/dashboard" replace />
  }

  return children
}

// Enhanced page transition animations
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1,
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.99,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

// Page wrapper with enhanced transitions
const PageWrapper = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    className="page-transition"
  >
    {children}
  </motion.div>
)

// Animated routes
const AnimatedRoutes = () => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* Landing page - public */}
        <Route path="/" element={
          <PageWrapper>
            <Landing />
          </PageWrapper>
        } />

        {/* Auth Routes */}
        <Route path="/login" element={
          <PublicRoute>
            <PageWrapper>
              <Login />
            </PageWrapper>
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <PageWrapper>
              <Register />
            </PageWrapper>
          </PublicRoute>
        } />

        {/* Protected App Routes */}
        <Route path="/app" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={
            <PageWrapper><Dashboard /></PageWrapper>
          } />
          <Route path="expenses" element={
            <PageWrapper><Expenses /></PageWrapper>
          } />
          <Route path="budgets" element={
            <PageWrapper><Budgets /></PageWrapper>
          } />
          <Route path="settings" element={
            <PageWrapper><Settings /></PageWrapper>
          } />
          <Route path="achievements" element={
            <PageWrapper><Achievements /></PageWrapper>
          } />
          <Route path="reminders" element={
            <PageWrapper><Reminders /></PageWrapper>
          } />
        </Route>

        {/* Legacy redirects */}
        <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/expenses" element={<Navigate to="/app/expenses" replace />} />
        <Route path="/budgets" element={<Navigate to="/app/budgets" replace />} />
        <Route path="/settings" element={<Navigate to="/app/settings" replace />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

import { BackgroundBeams } from './components/ui/background-beams';
import { scheduler } from './utils/performance/AnimationScheduler'

function App() {
  // Initialize Lenis for ultra-smooth scrolling
  useEffect(() => {
    // ... (lenis handling remains)
    const lenis = new Lenis({
      // ...
      infinite: false,
    })

    const cleanupLenis = scheduler.subscribe('smooth-scroll', (delta, time) => {
      lenis.raf(time)
    })

    return () => {
      cleanupLenis()
      lenis.destroy()
    }
  }, [])

  return (
    <ErrorBoundary>
      {/* Background - Beams */}
      <div className="fixed inset-0 -z-50 pointer-events-none bg-black">
        <BackgroundBeams />
      </div>

      <AnimatePresence mode="wait">
        {/* Custom cursor - only shows on desktop */}
        <CustomCursor />

        {/* Main app content */}
        <Suspense fallback={<RouteLoader />}>
          <AnimatedRoutes />
        </Suspense>
      </AnimatePresence>
    </ErrorBoundary >
  )
}

export default App
