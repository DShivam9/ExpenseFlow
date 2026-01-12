import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Target } from 'lucide-react'
import { CATEGORIES } from '../../utils/constants'
import { formatCurrency } from '../../utils/formatters'

const getCategoryEmoji = (cat) => {
    const emojis = {
        food: '🍕', transportation: '🚗', entertainment: '🎬', shopping: '🛍️',
        utilities: '💡', healthcare: '💊', education: '📚', travel: '✈️',
        subscriptions: '📱', groceries: '🛒', rent: '🏠', other: '📦'
    }
    return emojis[cat] || '📦'
}

const BudgetItem = ({ budget, index }) => {
    const category = CATEGORIES[budget.category] || CATEGORIES.other

    // Intensity based on percentage (higher = brighter)
    const intensity = Math.min(budget.percentage / 100, 1)

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ x: 4 }}
            className="group cursor-pointer"
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-lg">{getCategoryEmoji(budget.category)}</span>
                    <span className="text-sm font-medium text-white group-hover:text-white/80 transition-colors">
                        {category.label}
                    </span>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white font-medium">
                    {budget.percentage.toFixed(0)}%
                </span>
            </div>

            {/* Progress bar - monochrome with intensity */}
            <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(budget.percentage, 100)}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + index * 0.1, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-white/80 to-white/40"
                    style={{ opacity: 0.3 + intensity * 0.7 }}
                />
                {/* Glow effect on progress */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(budget.percentage, 100)}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + index * 0.1, ease: "easeOut" }}
                    className="absolute top-0 left-0 h-full rounded-full blur-sm bg-white/20"
                />
            </div>

            <div className="flex justify-between mt-1.5 text-xs text-zinc-500">
                <span>{formatCurrency(budget.spent)} spent</span>
                <span>{formatCurrency(budget.limit)} limit</span>
            </div>
        </motion.div>
    )
}

const BudgetProgress = ({ budgets = [], loading }) => {
    const displayBudgets = budgets.slice(0, 4)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="relative h-full group"
        >
            {/* Glass Card */}
            <div className="h-full p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 
                          hover:border-white/20 transition-all duration-300 overflow-hidden">

                {/* Subtle spotlight effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-white/5 blur-3xl" />
                </div>

                {/* Top highlight line */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                {/* Header */}
                <div className="flex items-center justify-between mb-6 relative z-10">
                    <div>
                        <h3 className="text-lg font-semibold text-white">Budget Progress</h3>
                        <p className="text-sm text-zinc-500">Track your spending limits</p>
                    </div>
                    <motion.div whileHover={{ x: 3 }}>
                        <Link
                            to="/app/budgets"
                            className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors"
                        >
                            Manage
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                    {loading ? (
                        <div className="space-y-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i}>
                                    <div className="flex justify-between mb-2">
                                        <div className="w-24 h-4 bg-white/5 rounded animate-pulse" />
                                        <div className="w-12 h-4 bg-white/5 rounded animate-pulse" />
                                    </div>
                                    <div className="w-full h-2 bg-white/5 rounded-full animate-pulse" />
                                </div>
                            ))}
                        </div>
                    ) : displayBudgets.length > 0 ? (
                        <div className="space-y-4">
                            {displayBudgets.map((budget, index) => (
                                <BudgetItem key={budget._id} budget={budget} index={index} />
                            ))}

                            {budgets.length > 4 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-center pt-2"
                                >
                                    <Link
                                        to="/app/budgets"
                                        className="text-sm text-zinc-500 hover:text-white transition-colors"
                                    >
                                        +{budgets.length - 4} more budgets →
                                    </Link>
                                </motion.div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                                <Target className="w-8 h-8 text-zinc-500" />
                            </div>
                            <p className="text-zinc-500 text-sm">No budgets set</p>
                            <Link
                                to="/app/budgets"
                                className="text-white/70 text-sm mt-2 hover:text-white transition-colors"
                            >
                                Create your first budget →
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export default BudgetProgress
