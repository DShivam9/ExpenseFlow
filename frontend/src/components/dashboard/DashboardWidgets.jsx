import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
    Lightbulb,
    TrendingDown,
    TrendingUp,
    AlertTriangle,
    ThumbsUp,
    Flame,
    Target,
    Calendar
} from 'lucide-react'

// AI Insight of the day widget
export const InsightWidget = ({ stats }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

    // Generate insight based on stats
    const getInsight = () => {
        const { summary } = stats

        if (summary.monthOverMonth.percentage < -10) {
            return {
                type: 'success',
                icon: TrendingDown,
                iconColor: 'text-emerald-400',
                bgColor: 'from-emerald-500/20 to-emerald-500/5',
                borderColor: 'border-emerald-500/30',
                title: 'Great job! 🎉',
                message: `You've reduced spending by ${Math.abs(summary.monthOverMonth.percentage).toFixed(1)}% compared to last month. Keep up the good work!`,
            }
        } else if (summary.monthOverMonth.percentage > 15) {
            return {
                type: 'warning',
                icon: AlertTriangle,
                iconColor: 'text-amber-400',
                bgColor: 'from-amber-500/20 to-amber-500/5',
                borderColor: 'border-amber-500/30',
                title: 'Spending Alert',
                message: `Your spending is up ${summary.monthOverMonth.percentage.toFixed(1)}% this month. Consider reviewing your budget categories.`,
            }
        } else if (summary.avgExpense < 50) {
            return {
                type: 'tip',
                icon: ThumbsUp,
                iconColor: 'text-primary-400',
                bgColor: 'from-primary-500/20 to-primary-500/5',
                borderColor: 'border-primary-500/30',
                title: 'Smart Spending',
                message: `Your average transaction is $${summary.avgExpense.toFixed(2)}. Small purchases add up - you're doing well keeping them low!`,
            }
        } else {
            return {
                type: 'info',
                icon: Lightbulb,
                iconColor: 'text-secondary-400',
                bgColor: 'from-secondary-500/20 to-secondary-500/5',
                borderColor: 'border-secondary-500/30',
                title: 'Daily Tip',
                message: 'Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings. It\'s a simple way to balance your budget!',
            }
        }
    }

    const insight = getInsight()
    const InsightIcon = insight.icon

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className={`glass-card-premium p-5 bg-gradient-to-br ${insight.bgColor} border ${insight.borderColor}`}
        >
            <div className="flex items-start gap-4">
                <motion.div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${insight.bgColor} flex items-center justify-center flex-shrink-0`}
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                >
                    <InsightIcon className={`w-6 h-6 ${insight.iconColor}`} />
                </motion.div>
                <div>
                    <h3 className="font-semibold text-white mb-1">{insight.title}</h3>
                    <p className="text-sm text-dark-300 leading-relaxed">{insight.message}</p>
                </div>
            </div>
        </motion.div>
    )
}

// Spending streak widget
export const StreakWidget = ({ daysWithinBudget = 12, bestStreak = 21 }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

    const flameColors = daysWithinBudget >= 7
        ? 'from-orange-500 to-red-500'
        : 'from-primary-500 to-secondary-500'

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card-premium p-5"
        >
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-sm text-dark-400 mb-1">Budget Streak</p>
                    <div className="flex items-baseline gap-2">
                        <motion.span
                            className="text-3xl font-bold text-white mono-numbers"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ delay: 0.3, type: 'spring' }}
                        >
                            {daysWithinBudget}
                        </motion.span>
                        <span className="text-dark-400 text-sm">days</span>
                    </div>
                </div>

                <motion.div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${flameColors} flex items-center justify-center`}
                    animate={{
                        scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <Flame className="w-7 h-7 text-white" />
                </motion.div>
            </div>

            {/* Progress to next milestone */}
            <div className="space-y-2">
                <div className="flex justify-between text-xs text-dark-400">
                    <span>Next milestone: 14 days</span>
                    <span>{Math.round((daysWithinBudget / 14) * 100)}%</span>
                </div>
                <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${Math.min((daysWithinBudget / 14) * 100, 100)}%` } : {}}
                        transition={{ duration: 1, delay: 0.4 }}
                        className={`h-full rounded-full bg-gradient-to-r ${flameColors}`}
                    />
                </div>
                <p className="text-xs text-dark-500">
                    Best streak: <span className="text-dark-300">{bestStreak} days</span>
                </p>
            </div>
        </motion.div>
    )
}

// Weekly comparison mini widget
export const WeeklyComparisonWidget = ({ thisWeek = 485.50, lastWeek = 612.00 }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

    const difference = thisWeek - lastWeek
    const percentChange = ((difference / lastWeek) * 100)
    const isDown = difference < 0

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card-premium p-5"
        >
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-sm text-dark-400 mb-1">This Week</p>
                    <p className="text-2xl font-bold text-white mono-numbers">
                        ${thisWeek.toLocaleString()}
                    </p>
                </div>

                <motion.div
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium
                      ${isDown ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}
                    initial={{ opacity: 0, x: 10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 }}
                >
                    {isDown ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                    {Math.abs(percentChange).toFixed(1)}%
                </motion.div>
            </div>

            {/* Comparison bar */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <span className="text-xs text-dark-400 w-16">This week</span>
                    <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={isInView ? { width: `${(thisWeek / Math.max(thisWeek, lastWeek)) * 100}%` } : {}}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-dark-400 w-16">Last week</span>
                    <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={isInView ? { width: `${(lastWeek / Math.max(thisWeek, lastWeek)) * 100}%` } : {}}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="h-full rounded-full bg-dark-500"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

// Goals progress widget
export const GoalsWidget = ({ goals = [] }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

    const defaultGoals = [
        { name: 'Save $500', progress: 72, icon: Target },
        { name: 'Stay under budget', progress: 85, icon: TrendingDown },
        { name: 'Log daily', progress: 100, icon: Calendar },
    ]

    const displayGoals = goals.length > 0 ? goals : defaultGoals

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card-premium p-5"
        >
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-400" />
                Monthly Goals
            </h3>

            <div className="space-y-4">
                {displayGoals.map((goal, index) => {
                    const GoalIcon = goal.icon || Target
                    return (
                        <motion.div
                            key={goal.name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            className="flex items-center gap-3"
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                              ${goal.progress >= 100 ? 'bg-emerald-500/20' : 'bg-dark-700'}`}>
                                <GoalIcon className={`w-4 h-4 ${goal.progress >= 100 ? 'text-emerald-400' : 'text-dark-400'}`} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm text-dark-200">{goal.name}</span>
                                    <span className={`text-xs font-medium ${goal.progress >= 100 ? 'text-emerald-400' : 'text-dark-400'}`}>
                                        {goal.progress}%
                                    </span>
                                </div>
                                <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={isInView ? { width: `${Math.min(goal.progress, 100)}%` } : {}}
                                        transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                                        className={`h-full rounded-full ${goal.progress >= 100
                                                ? 'bg-emerald-500'
                                                : 'bg-gradient-to-r from-primary-500 to-secondary-500'
                                            }`}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </motion.div>
    )
}

export default { InsightWidget, StreakWidget, WeeklyComparisonWidget, GoalsWidget }
