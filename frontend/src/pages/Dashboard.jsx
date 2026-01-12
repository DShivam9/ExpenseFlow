import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    Receipt,
    Calendar,
    PieChart,
    BarChart3
} from 'lucide-react'
import { mockStats, mockBudgets, mockHealthScore, mockChallenges, mockBillReminders, delay } from '../utils/mockData'
import ExpenseChart from '../components/dashboard/ExpenseChart'
import CategoryPieChart from '../components/dashboard/CategoryPieChart'
import RecentExpenses from '../components/dashboard/RecentExpenses'
import BudgetProgress from '../components/dashboard/BudgetProgress'
import SubscriptionsWidget from '../components/dashboard/SubscriptionsWidget'
import HealthScoreCard from '../components/dashboard/HealthScoreCard'
import ChallengesWidget from '../components/dashboard/ChallengesWidget'
import BillRemindersWidget from '../components/dashboard/BillRemindersWidget'

// Glass Card - Landing page consistent styling
const GlassCard = ({ children, className = '', hover = true, delay: animDelay = 0 }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })
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
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: animDelay, ease: [0.22, 1, 0.36, 1] }}
            whileHover={hover ? { y: -4 } : {}}
            onMouseMove={handleMouseMove}
            className={`relative h-full group ${className}`}
        >
            <div className="h-full p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 
                          hover:border-white/20 transition-all duration-300 overflow-hidden">

                {/* Spotlight effect */}
                <div
                    className="absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        left: mousePosition.x - 100,
                        top: mousePosition.y - 100,
                        width: 200,
                        height: 200,
                        background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(20px)'
                    }}
                />

                {/* Top highlight */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <div className="relative z-10 h-full">
                    {children}
                </div>
            </div>
        </motion.div>
    )
}

// Hero Balance Card - Featured glassmorphism
const BalanceCard = ({ totalSpent, change, changeType }) => {
    const [displayValue, setDisplayValue] = useState(0)
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        })
    }

    useEffect(() => {
        if (!isInView) return
        const duration = 1500
        const steps = 60
        const stepValue = totalSpent / steps
        let current = 0

        const timer = setInterval(() => {
            current += stepValue
            if (current >= totalSpent) {
                setDisplayValue(totalSpent)
                clearInterval(timer)
            } else {
                setDisplayValue(current)
            }
        }, duration / steps)

        return () => clearInterval(timer)
    }, [isInView, totalSpent])

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4 }}
            onMouseMove={handleMouseMove}
            className="relative h-full group col-span-2"
        >
            <div className="h-full p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 
                          hover:border-white/20 transition-all duration-300 overflow-hidden">

                {/* Spotlight effect */}
                <div
                    className="absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        left: mousePosition.x - 150,
                        top: mousePosition.y - 150,
                        width: 300,
                        height: 300,
                        background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(40px)'
                    }}
                />

                {/* Top highlight */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                <div className="relative z-10 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                                <Wallet className="w-6 h-6 text-black" />
                            </div>
                            <div>
                                <span className="text-sm font-medium text-zinc-400 block">Total Spending</span>
                                <span className="text-xs text-zinc-600">This month</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                            <span className="text-xs text-zinc-400">
                                {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                    </div>

                    {/* Main Value */}
                    <div className="flex-1 flex flex-col justify-center">
                        <motion.div
                            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            ${displayValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </motion.div>

                        <motion.div
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium w-fit
                                      bg-white/5 border border-white/10 text-zinc-300"
                            initial={{ opacity: 0, x: -10 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 0.4 }}
                        >
                            {changeType === 'positive' ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                            <span>{Math.abs(change).toFixed(1)}% vs last month</span>
                        </motion.div>
                    </div>
                </div>

                {/* Corner glow */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-white/[0.03] to-transparent blur-3xl" />
            </div>
        </motion.div>
    )
}

// Stat Mini Card
const StatMiniCard = ({ title, value, icon: Icon, delay: animDelay = 0 }) => {
    const [displayValue, setDisplayValue] = useState(0)
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        })
    }

    useEffect(() => {
        if (!isInView) return
        const duration = 1200
        const steps = 40
        const stepValue = value / steps
        let current = 0

        const timer = setInterval(() => {
            current += stepValue
            if (current >= value) {
                setDisplayValue(value)
                clearInterval(timer)
            } else {
                setDisplayValue(current)
            }
        }, duration / steps)

        return () => clearInterval(timer)
    }, [isInView, value])

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: animDelay }}
            whileHover={{ y: -4 }}
            onMouseMove={handleMouseMove}
            className="relative group"
        >
            <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 
                          hover:border-white/20 transition-all duration-300 overflow-hidden">

                {/* Spotlight effect */}
                <div
                    className="absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        left: mousePosition.x - 60,
                        top: mousePosition.y - 60,
                        width: 120,
                        height: 120,
                        background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(15px)'
                    }}
                />

                {/* Top highlight */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-white/80" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">
                        {Math.round(displayValue).toLocaleString()}
                    </p>
                    <p className="text-sm text-zinc-500">{title}</p>
                </div>
            </div>
        </motion.div>
    )
}

// Chart Card wrapper
const ChartCard = ({ title, subtitle, icon: Icon, children, delay: animDelay = 0 }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })
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
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: animDelay }}
            whileHover={{ y: -4 }}
            onMouseMove={handleMouseMove}
            className="relative h-full group"
        >
            <div className="h-full p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 
                          hover:border-white/20 transition-all duration-300 overflow-hidden">

                {/* Spotlight effect */}
                <div
                    className="absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        left: mousePosition.x - 100,
                        top: mousePosition.y - 100,
                        width: 200,
                        height: 200,
                        background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(20px)'
                    }}
                />

                {/* Top highlight */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <div className="relative z-10 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white">{title}</h3>
                            <p className="text-sm text-zinc-500">{subtitle}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-white/70" />
                        </div>
                    </div>
                    <div className="flex-1">
                        {children}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

// Main Dashboard
const Dashboard = () => {
    const [stats, setStats] = useState(null)
    const [budgets, setBudgets] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            await delay(800)
            setStats(mockStats)
            setBudgets(mockBudgets)
            setLoading(false)
        }
        fetchData()
    }, [])

    const totalSpent = stats?.totalSpent || 0
    const changePercent = stats?.changePercent || 0
    const changeType = changePercent <= 0 ? 'positive' : 'negative'

    return (
        <div className="min-h-screen p-6 lg:p-8 space-y-6">

            {/* Top Row: Balance + Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Hero Balance - spans 2 columns */}
                <BalanceCard
                    totalSpent={totalSpent}
                    change={changePercent}
                    changeType={changeType}
                />

                {/* Mini Stats */}
                <StatMiniCard
                    title="Transactions"
                    value={stats?.transactionCount || 0}
                    icon={Receipt}
                    delay={0.1}
                />
                <StatMiniCard
                    title="Avg. Per Day"
                    value={stats?.avgPerDay || 0}
                    icon={TrendingUp}
                    delay={0.2}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard
                    title="Spending Trends"
                    subtitle="Daily expenses this month"
                    icon={BarChart3}
                    delay={0.3}
                >
                    <ExpenseChart data={stats?.monthlyTrend || []} loading={loading} />
                </ChartCard>

                <ChartCard
                    title="Category Breakdown"
                    subtitle="Where your money goes"
                    icon={PieChart}
                    delay={0.4}
                >
                    <CategoryPieChart data={stats?.categoryBreakdown || []} loading={loading} />
                </ChartCard>
            </div>

            {/* USP Features Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <HealthScoreCard
                    score={mockHealthScore.score}
                    breakdown={mockHealthScore.breakdown}
                />
                <ChallengesWidget challenges={mockChallenges} loading={loading} />
                <BillRemindersWidget reminders={mockBillReminders} loading={loading} />
                <RecentExpenses expenses={stats?.recentExpenses || []} loading={loading} />
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <BudgetProgress budgets={budgets} loading={loading} />
                <SubscriptionsWidget subscriptions={stats?.upcomingSubscriptions || []} loading={loading} />
            </div>
        </div>
    )
}

export default Dashboard
