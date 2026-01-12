import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, ArrowLeft, Fingerprint, Shield, TrendingUp } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../context/ToastContext'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import Particles from '../components/effects/Particles'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const { login } = useAuth()
    const toast = useToast()
    const navigate = useNavigate()

    const validate = () => {
        const newErrors = {}
        if (!email) newErrors.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format'
        if (!password) newErrors.password = 'Password is required'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return

        setLoading(true)
        try {
            await login(email, password)
            toast.success('Welcome back!')
            navigate('/app/dashboard')
        } catch (error) {
            toast.error(error.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black flex">
            {/* Left Panel - Branding (Hidden on mobile) */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden"
            >
                {/* Particles Background */}
                <Particles
                    particleColors={['#ffffff', '#ffffff']}
                    particleCount={200}
                    particleSpread={10}
                    speed={0.1}
                    particleBaseSize={100}
                    moveParticlesOnHover={true}
                    alphaParticles={false}
                    disableRotation={false}
                    className="pointer-events-auto"
                />
                {/* Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                {/* Content */}
                <div className="relative z-10 pointer-events-none">
                    <Link to="/" className="inline-flex items-center gap-3 group">
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-2xl shadow-white/10">
                            <Fingerprint className="w-6 h-6 text-black" />
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">ExpenseFlow</span>
                    </Link>
                </div>

                {/* Center Hero Text */}
                <div className="relative z-10 max-w-lg pointer-events-none">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-5xl font-bold text-white leading-tight mb-6"
                    >
                        Welcome back to your
                        <span className="block text-zinc-500">financial command center.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg text-zinc-400"
                    >
                        Secure access to your spending insights, budgets, and real-time analytics.
                    </motion.p>

                    {/* Stats Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 flex gap-8"
                    >
                        <div>
                            <p className="text-3xl font-bold text-white">256-bit</p>
                            <p className="text-sm text-zinc-500 flex items-center gap-1 mt-1">
                                <Shield className="w-3 h-3" /> Encryption
                            </p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white">99.9%</p>
                            <p className="text-sm text-zinc-500 flex items-center gap-1 mt-1">
                                <TrendingUp className="w-3 h-3" /> Uptime
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Decorative */}
                <div className="relative z-10 text-xs text-zinc-600 font-mono pointer-events-none">
                    SECURE • ENCRYPTED • PRIVATE
                </div>
            </motion.div>

            {/* Animated Vertical Divider with Pulse */}
            <div className="hidden lg:flex self-stretch items-center">
                <div className="w-px h-full relative overflow-hidden">
                    {/* Base Line */}
                    <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-700 to-zinc-900" />
                    {/* Animated Glow Pulse */}
                    <motion.div
                        animate={{
                            y: ["-100%", "400%"]
                        }}
                        transition={{
                            duration: 2.5,
                            delay: 1,
                            repeat: Infinity,
                            repeatDelay: 0.8,
                            ease: "easeInOut"
                        }}
                        className="absolute left-0 w-full h-[25%] bg-gradient-to-b from-transparent via-white/80 to-transparent"
                    />
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
                {/* Subtle Radial Glow */}
                <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none" />

                {/* Mobile Grid Background */}
                <div className="lg:hidden absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

                {/* Back Button (Mobile) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute top-6 left-6 z-10"
                >
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md relative z-10"
                >
                    {/* Header */}
                    <div className="text-center mb-10">
                        {/* Mobile Logo */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="lg:hidden w-14 h-14 rounded-xl bg-white flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-white/10"
                        >
                            <Fingerprint className="w-7 h-7 text-black" />
                        </motion.div>

                        <h1 className="text-2xl sm:text-3xl font-bold text-white">Sign in to your account</h1>
                        <p className="text-zinc-500 mt-2">Enter your credentials to continue</p>
                    </div>

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 sm:p-8"
                    >
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-black/50 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-black/50 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                                    />
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>

                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="w-full bg-white text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-zinc-500 text-sm">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-white hover:underline font-medium">
                                    Create one
                                </Link>
                            </p>
                        </div>
                    </motion.div>

                    {/* Demo Credentials */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6 p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-xl text-center"
                    >
                        <p className="text-xs text-zinc-500 mb-2">Demo Credentials</p>
                        <div className="flex justify-center gap-4 text-xs">
                            <code className="bg-zinc-800 px-2 py-1 rounded text-zinc-400">demo@example.com</code>
                            <code className="bg-zinc-800 px-2 py-1 rounded text-zinc-400">demo123</code>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}

export default Login
