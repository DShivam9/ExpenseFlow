import { Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardHeader from './DashboardHeader'
import { FloatingDock } from '../ui/floating-dock'
import Sidebar from './Sidebar'
import { useState, useEffect } from 'react'
import { Preloader } from '../common/Preloader'
import { useToast } from '../../context/ToastContext'
import { usePreloader } from '../../context/PreloaderContext'
import { useAuth } from '../../hooks/useAuth'
import {
    IconLayoutDashboard,
    IconReceipt,
    IconChartPie,
    IconSettings,
    IconPlus,
    IconLogout,
    IconTrophy
} from '@tabler/icons-react'

const Layout = () => {
    const { hasPlayed, setHasPlayed } = usePreloader()
    const [isLoading, setIsLoading] = useState(!hasPlayed)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [showQuickAdd, setShowQuickAdd] = useState(false)
    const { showToast } = useToast()
    const { logout } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (hasPlayed) return // Already played, skip loader

        const timer = setTimeout(() => {
            setHasPlayed(true)
            setIsLoading(false)
        }, 3750)
        return () => clearTimeout(timer)
    }, [hasPlayed, setHasPlayed])

    const handleAddExpense = (expense) => {
        console.log('Quick add expense:', expense)
        showToast('Expense added successfully!', 'success')
        setShowQuickAdd(false)
    }

    const handleLogout = () => {
        logout()
        showToast('Signed out successfully', 'success')
        navigate('/')
    }

    const navItems = [
        {
            title: "Dashboard",
            icon: <IconLayoutDashboard className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
            href: "/app/dashboard",
        },
        {
            title: "Expenses",
            icon: <IconReceipt className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
            href: "/app/expenses",
        },
        {
            title: "Budgets",
            icon: <IconChartPie className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
            href: "/app/budgets",
        },
        {
            title: "Achievements",
            icon: <IconTrophy className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
            href: "/app/achievements",
        },
        {
            title: "Settings",
            icon: <IconSettings className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
            href: "/app/settings",
        },
        {
            title: "Sign Out",
            icon: <IconLogout className="h-full w-full text-red-400" />,
            onClick: handleLogout,
        },
    ]

    return (
        <AnimatePresence mode="wait">
            {isLoading ? (
                <Preloader key="preloader" />
            ) : (
                <div className="min-h-screen bg-transparent">
                    {/* Noir Glass gradient orbs - Violet/Cyan ambient effect */}
                    <div className="fixed inset-0 overflow-hidden pointer-events-none">
                        {/* Violet orb - top right */}
                        <motion.div
                            className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-[150px]"
                            style={{
                                background: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, transparent 70%)',
                            }}
                            animate={{
                                scale: [1, 1.15, 1],
                                x: [0, 30, 0],
                                y: [0, 20, 0],
                            }}
                            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                        />

                        {/* Cyan orb - left center */}
                        <motion.div
                            className="absolute top-1/3 -left-32 w-[400px] h-[400px] rounded-full blur-[120px]"
                            style={{
                                background: 'radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, transparent 70%)',
                            }}
                            animate={{
                                scale: [1, 1.2, 1],
                                y: [0, -40, 0],
                            }}
                            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
                        />

                        {/* Pink orb - bottom */}
                        <motion.div
                            className="absolute -bottom-32 right-1/4 w-[450px] h-[450px] rounded-full blur-[130px]"
                            style={{
                                background: 'radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, transparent 70%)',
                            }}
                            animate={{
                                scale: [1, 1.1, 1],
                                x: [0, -30, 0],
                            }}
                            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
                        />

                        {/* Subtle dot pattern */}
                        <div
                            className="absolute inset-0 opacity-[0.02]"
                            style={{
                                backgroundImage: `radial-gradient(rgba(168, 85, 247, 0.5) 1px, transparent 1px)`,
                                backgroundSize: '40px 40px'
                            }}
                        />
                    </div>

                    {/* Mobile Sidebar - Controlled by state */}
                    <div className="lg:hidden">
                        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                    </div>

                    {/* Desktop: Vertical Floating Dock (Immersive Sidebar) */}
                    <div className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-50 flex-col gap-4">
                        <FloatingDock
                            items={navItems}
                            orientation="vertical"
                            desktopClassName="bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50"
                            mobileClassName="hidden" // Handled by separate mobile sidebar
                        />
                    </div>

                    {/* Main content - Full width with vertical dock padding */}
                    <div className="relative lg:pl-32 transition-[padding] duration-300 ease-in-out">
                        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

                        <main className="relative pb-28 pt-20 lg:pt-8 px-4 md:px-8">
                            <Outlet />
                        </main>
                    </div>

                    {/* Quick Add Floating Button - Bottom Right */}
                    <motion.button
                        onClick={() => setShowQuickAdd(true)}
                        className="hidden lg:flex fixed right-8 bottom-8 z-50 items-center justify-center w-14 h-14 bg-violet-600 rounded-full shadow-lg hover:bg-violet-700 pointer-events-auto"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <IconPlus className="w-6 h-6 text-white" />
                    </motion.button>

                    {/* Quick Add Modal */}
                    <AnimatePresence>
                        {showQuickAdd && (
                            <QuickAddModal
                                onClose={() => setShowQuickAdd(false)}
                                onSubmit={handleAddExpense}
                            />
                        )}
                    </AnimatePresence>
                </div>
            )}
        </AnimatePresence>
    )
}

// Quick Add Modal - Noir Glass style with violet accent
const QuickAddModal = ({ onClose, onSubmit }) => {
    const [amount, setAmount] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('food')

    const categories = [
        { id: 'food', label: '🍕 Food' },
        { id: 'transport', label: '🚗 Transport' },
        { id: 'shopping', label: '🛍️ Shopping' },
        { id: 'entertainment', label: '🎮 Entertainment' },
        { id: 'bills', label: '📃 Bills' },
        { id: 'other', label: '📦 Other' },
    ]

    const handleSubmit = (e) => {
        e.preventDefault()
        if (amount && description) {
            onSubmit({ amount: parseFloat(amount), description, category })
        }
    }

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed bottom-0 left-0 right-0 z-50 p-4 lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:max-w-md lg:w-full"
            >
                <div
                    className="glass-card p-6 rounded-2xl lg:rounded-2xl"
                    style={{
                        background: 'linear-gradient(135deg, rgba(22, 22, 26, 0.98) 0%, rgba(12, 12, 15, 0.95) 100%)',
                        border: '1px solid rgba(168, 85, 247, 0.2)',
                        boxShadow: '0 30px 60px rgba(0, 0, 0, 0.6), 0 0 50px rgba(168, 85, 247, 0.08)',
                    }}
                >
                    <h2 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        Quick Add Expense
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Amount */}
                        <div>
                            <label className="label">Amount</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400 font-bold">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="input pl-10 text-2xl font-bold"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="label">Description</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What did you spend on?"
                                className="input"
                            />
                        </div>

                        {/* Categories */}
                        <div>
                            <label className="label">Category</label>
                            <div className="grid grid-cols-3 gap-2">
                                {categories.map((cat) => (
                                    <motion.button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setCategory(cat.id)}
                                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${category === cat.id
                                            ? 'bg-violet-500/20 text-violet-300 border border-violet-500/50'
                                            : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10'
                                            }`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {cat.label}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <motion.button
                                type="button"
                                onClick={onClose}
                                className="btn-secondary flex-1"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                type="submit"
                                className="btn-primary flex-1"
                                disabled={!amount || !description}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Add Expense
                            </motion.button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </>
    )
}

export default Layout
