import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { TrendingUp, Shield, Target, Wallet } from 'lucide-react'

const HealthScoreCard = ({ score = 75, breakdown = {} }) => {
    const [animatedScore, setAnimatedScore] = useState(0)
    const [hasAnimated, setHasAnimated] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        })
    }

    useEffect(() => {
        if (hasAnimated) return
        setHasAnimated(true)
        const duration = 1500
        const start = performance.now()

        const animate = (currentTime) => {
            const elapsed = currentTime - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setAnimatedScore(Math.round(eased * score))

            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }

        requestAnimationFrame(animate)
    }, [score, hasAnimated])

    const getStatus = (score) => {
        if (score >= 80) return 'Excellent'
        if (score >= 60) return 'Good'
        if (score >= 40) return 'Fair'
        return 'Needs Work'
    }

    const size = 140
    const strokeWidth = 6
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (animatedScore / 100) * circumference

    const breakdownItems = [
        { label: 'Budget Adherence', value: breakdown.budgetAdherence ?? 82, icon: Target },
        { label: 'Savings Rate', value: breakdown.savingsRate ?? 68, icon: Wallet },
        { label: 'Spending Stability', value: breakdown.spendingStability ?? 75, icon: Shield }
    ]

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
                        background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(20px)'
                    }}
                />

                {/* Top highlight */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                {/* Header */}
                <div className="flex items-center justify-between mb-6 relative z-10">
                    <div>
                        <h3 className="text-lg font-semibold text-white">Financial Health</h3>
                        <p className="text-sm text-zinc-500">Overall score</p>
                    </div>
                    <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="px-3 py-1 rounded-full text-xs font-medium text-white bg-white/10 border border-white/20"
                    >
                        {getStatus(score)}
                    </motion.span>
                </div>

                {/* Score Circle */}
                <div className="flex items-center justify-center mb-6 relative z-10">
                    <div className="relative">
                        <svg width={size} height={size} className="-rotate-90">
                            <circle
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                stroke="currentColor"
                                strokeWidth={strokeWidth}
                                fill="none"
                                className="text-white/10"
                            />
                            <motion.circle
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                stroke="url(#scoreGradient)"
                                strokeWidth={strokeWidth}
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset: offset }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                            <defs>
                                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                                    <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
                                </linearGradient>
                            </defs>
                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold text-white tabular-nums">
                                {animatedScore}
                            </span>
                            <span className="text-xs text-zinc-500">out of 100</span>
                        </div>
                    </div>
                </div>

                {/* Breakdown */}
                <div className="space-y-3 relative z-10">
                    {breakdownItems.map((item, index) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            className="group/item"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <item.icon className="w-3.5 h-3.5 text-zinc-500" />
                                    <span className="text-sm text-zinc-400">{item.label}</span>
                                </div>
                                <span className="text-sm font-medium text-white">{item.value}%</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.value}%` }}
                                    transition={{ duration: 1, delay: 0.7 + index * 0.1, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-white/60 to-white/30 rounded-full"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Trend indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between relative z-10"
                >
                    <span className="text-xs text-zinc-500">vs. last month</span>
                    <div className="flex items-center gap-1 text-white/80">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">+5 pts</span>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default HealthScoreCard
