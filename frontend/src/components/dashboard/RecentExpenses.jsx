import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Clock } from 'lucide-react'
import { CATEGORIES } from '../../utils/constants'
import { formatCurrency, formatRelativeTime } from '../../utils/formatters'

const getCategoryEmoji = (cat) => {
    const emojis = {
        food: '🍕', transportation: '🚗', entertainment: '🎬', shopping: '🛍️',
        utilities: '💡', healthcare: '💊', education: '📚', travel: '✈️',
        subscriptions: '📱', groceries: '🛒', rent: '🏠', other: '📦'
    }
    return emojis[cat] || '📦'
}

const ExpenseItem = ({ expense, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)', x: 4 }}
            className="flex items-center gap-3 p-3 rounded-xl transition-colors cursor-pointer group"
        >
            <motion.div
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0"
                whileHover={{ scale: 1.1, rotate: 5 }}
            >
                <span className="text-lg">{getCategoryEmoji(expense.category)}</span>
            </motion.div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate group-hover:text-white/80 transition-colors">
                    {expense.description}
                </p>
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatRelativeTime(expense.date)}</span>
                </div>
            </div>

            <p className="text-sm font-semibold text-white whitespace-nowrap">
                -{formatCurrency(expense.amount)}
            </p>
        </motion.div>
    )
}

const RecentExpenses = ({ expenses = [], loading }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        })
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4 }}
            onMouseMove={handleMouseMove}
            className="relative h-full group"
        >
            {/* Glass Card */}
            <div className="h-full p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 
                          hover:border-white/20 transition-all duration-300 overflow-hidden">

                {/* Spotlight effect */}
                <div
                    className="absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        left: mousePosition.x - 80,
                        top: mousePosition.y - 80,
                        width: 160,
                        height: 160,
                        background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(20px)'
                    }}
                />

                {/* Top highlight */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                {/* Header */}
                <div className="flex items-center justify-between mb-4 relative z-10">
                    <div>
                        <h3 className="text-lg font-semibold text-white">Recent Expenses</h3>
                        <p className="text-sm text-zinc-500">Your latest transactions</p>
                    </div>
                    <motion.div whileHover={{ x: 3 }}>
                        <Link
                            to="/app/expenses"
                            className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors"
                        >
                            View All
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                    {loading ? (
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3 p-3">
                                    <div className="w-10 h-10 bg-white/5 rounded-xl animate-pulse" />
                                    <div className="flex-1">
                                        <div className="w-32 h-4 mb-1 bg-white/5 rounded animate-pulse" />
                                        <div className="w-20 h-3 bg-white/5 rounded animate-pulse" />
                                    </div>
                                    <div className="w-16 h-4 bg-white/5 rounded animate-pulse" />
                                </div>
                            ))}
                        </div>
                    ) : expenses.length > 0 ? (
                        <div className="space-y-1">
                            {expenses.map((expense, index) => (
                                <ExpenseItem key={expense._id} expense={expense} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                                <span className="text-2xl">💸</span>
                            </div>
                            <p className="text-zinc-500 text-sm">No recent expenses</p>
                            <Link
                                to="/app/expenses"
                                className="text-white/70 text-sm mt-2 hover:text-white transition-colors"
                            >
                                Add your first expense →
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export default RecentExpenses
