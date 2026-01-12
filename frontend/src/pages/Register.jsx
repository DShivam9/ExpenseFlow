import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, ArrowRight, ArrowLeft, Fingerprint, Check } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../context/ToastContext'
import Waves from '../components/effects/Waves'

const benefits = [
    'Track unlimited expenses',
    'Real-time budget alerts',
    'Beautiful analytics dashboard',
    'Bank-grade security',
    'Multi-currency support'
]

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const { register } = useAuth()
    const toast = useToast()
    const navigate = useNavigate()

    const validate = () => {
        const newErrors = {}
        if (!formData.name) newErrors.name = 'Name is required'
        if (!formData.email) newErrors.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format'
        if (!formData.password) newErrors.password = 'Password is required'
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return

        setLoading(true)
        try {
            await register(formData.name, formData.email, formData.password)
            toast.success('Account created successfully!')
            navigate('/app/dashboard')
        } catch (error) {
            toast.error(error.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    return (
        <div className="min-h-screen bg-black flex relative">
            {/* Full-Page Waves Background */}
            <Waves
                lineColor="rgba(255, 255, 255, 0.25)"
                backgroundColor="transparent"
                waveSpeedX={0.02}
                waveSpeedY={0.01}
                waveAmpX={40}
                waveAmpY={20}
                friction={0.9}
                tension={0.01}
                maxCursorMove={120}
                xGap={12}
                yGap={36}
            />

            {/* Left Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10 pointer-events-none">

                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute top-6 left-6 z-10"
                >
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm pointer-events-auto"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md relative z-10 pointer-events-auto"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="lg:hidden w-14 h-14 rounded-xl bg-white flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-white/10"
                        >
                            <Fingerprint className="w-7 h-7 text-black" />
                        </motion.div>

                        <h1 className="text-2xl sm:text-3xl font-bold text-white">Create your account</h1>
                        <p className="text-zinc-500 mt-2">Start your journey to financial clarity</p>
                    </div>

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 sm:p-8"
                    >
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange('name')}
                                        className="w-full bg-black/50 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                                    />
                                </div>
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange('email')}
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
                                        value={formData.password}
                                        onChange={handleChange('password')}
                                        className="w-full bg-black/50 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                                    />
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange('confirmPassword')}
                                        className="w-full bg-black/50 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                                    />
                                </div>
                                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                            </div>

                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="w-full bg-white text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors disabled:opacity-50 mt-2"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-zinc-500 text-sm">
                                Already have an account?{' '}
                                <Link to="/login" className="text-white hover:underline font-medium">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </motion.div>

                    {/* Terms */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-6 text-center text-xs text-zinc-600"
                    >
                        By creating an account, you agree to our{' '}
                        <a href="#" className="text-zinc-400 hover:text-white transition-colors">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-zinc-400 hover:text-white transition-colors">Privacy Policy</a>
                    </motion.p>
                </motion.div>
            </div>

            {/* Right Panel - Benefits (Hidden on mobile) */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="hidden lg:flex lg:w-1/2 relative flex-col justify-center p-12 overflow-hidden z-10 pointer-events-none"
            >
                <div className="relative z-10 max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center gap-3 mb-10"
                    >
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-2xl shadow-white/10">
                            <Fingerprint className="w-6 h-6 text-black" />
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">ExpenseFlow</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-4xl font-bold text-white leading-tight mb-6"
                    >
                        Take control of your
                        <span className="block text-zinc-500">financial future.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-lg text-zinc-400 mb-10"
                    >
                        Join thousands of users who are mastering their money with ExpenseFlow.
                    </motion.p>

                    {/* Benefits List */}
                    <ul className="space-y-4">
                        {benefits.map((benefit, i) => (
                            <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + i * 0.1 }}
                                className="flex items-center gap-3 text-zinc-300"
                            >
                                <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                                    <Check className="w-3.5 h-3.5 text-white" />
                                </div>
                                {benefit}
                            </motion.li>
                        ))}
                    </ul>

                    {/* Social Proof */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 }}
                        className="mt-12 p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-2">
                                {['A', 'B', 'C', 'D'].map((letter, i) => (
                                    <div
                                        key={i}
                                        className="w-8 h-8 rounded-full bg-zinc-700 border-2 border-zinc-900 flex items-center justify-center text-white text-xs font-medium"
                                    >
                                        {letter}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <p className="text-white text-sm font-medium">10,000+ users</p>
                                <p className="text-zinc-500 text-xs">already tracking their expenses</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}

export default Register
