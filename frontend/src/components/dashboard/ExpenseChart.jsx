import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, CalendarDays } from 'lucide-react'

// Time period options
const TIME_PERIODS = [
    { id: 'daily', label: 'Daily', shortLabel: 'D' },
    { id: 'weekly', label: 'Weekly', shortLabel: 'W' },
    { id: 'monthly', label: 'Monthly', shortLabel: 'M' },
    { id: 'yearly', label: 'Yearly', shortLabel: 'Y' }
]

const CustomTooltip = ({ active, payload, label, period }) => {
    if (active && payload && payload.length) {
        const formatLabel = () => {
            if (period === 'monthly') {
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                return monthNames[label - 1] || label
            }
            return label
        }

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl"
            >
                <p className="text-sm text-zinc-400 mb-1">{formatLabel()}</p>
                <p className="text-lg font-bold text-white">
                    ${payload[0].value.toLocaleString()}
                </p>
                <p className="text-xs text-zinc-500">
                    {payload[0].payload.count} transactions
                </p>
            </motion.div>
        )
    }
    return null
}

// Generate mock data for different time periods
const generateMockData = (period) => {
    switch (period) {
        case 'daily':
            // Last 14 days
            return Array.from({ length: 14 }, (_, i) => {
                const date = new Date()
                date.setDate(date.getDate() - (13 - i))
                return {
                    _id: i + 1,
                    label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    total: Math.round(50 + Math.random() * 200),
                    count: Math.round(2 + Math.random() * 5)
                }
            })
        case 'weekly':
            // Last 8 weeks
            return Array.from({ length: 8 }, (_, i) => ({
                _id: i + 1,
                label: `Week ${i + 1}`,
                total: Math.round(500 + Math.random() * 1000),
                count: Math.round(10 + Math.random() * 20)
            }))
        case 'monthly':
            // Last 6 months
            return [
                { _id: 7, total: 2150, count: 35 },
                { _id: 8, total: 2450, count: 42 },
                { _id: 9, total: 1980, count: 38 },
                { _id: 10, total: 2680, count: 45 },
                { _id: 11, total: 3082, count: 52 },
                { _id: 12, total: 2847, count: 47 }
            ]
        case 'yearly':
            // Last 5 years
            const currentYear = new Date().getFullYear()
            return Array.from({ length: 5 }, (_, i) => ({
                _id: i + 1,
                label: (currentYear - 4 + i).toString(),
                total: Math.round(25000 + Math.random() * 15000),
                count: Math.round(300 + Math.random() * 200)
            }))
        default:
            return []
    }
}

const ExpenseChart = ({ data = [], loading }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })
    const [selectedPeriod, setSelectedPeriod] = useState('monthly')

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    // Use provided data for monthly, generate mock for others
    const chartData = selectedPeriod === 'monthly' && data.length > 0
        ? data.map(item => ({
            ...item,
            label: monthNames[item._id - 1] || item._id
        }))
        : generateMockData(selectedPeriod)

    const getSubtitle = () => {
        switch (selectedPeriod) {
            case 'daily': return 'Last 14 days'
            case 'weekly': return 'Last 8 weeks'
            case 'monthly': return 'Last 6 months'
            case 'yearly': return 'Last 5 years'
            default: return ''
        }
    }

    const maxValue = Math.max(...chartData.map(d => d.total), 0)

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="h-full flex flex-col"
        >
            {/* Header with Time Period Selector */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-white">Spending Trend</h3>
                    <p className="text-sm text-zinc-500">{getSubtitle()}</p>
                </div>

                {/* Time Period Selector */}
                <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg border border-white/10">
                    {TIME_PERIODS.map((period) => (
                        <button
                            key={period.id}
                            onClick={() => setSelectedPeriod(period.id)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200
                                ${selectedPeriod === period.id
                                    ? 'bg-white text-black'
                                    : 'text-zinc-400 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            <span className="hidden sm:inline">{period.label}</span>
                            <span className="sm:hidden">{period.shortLabel}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart */}
            {loading ? (
                <div className="flex-1 flex items-end gap-2">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex-1 bg-white/5 rounded animate-pulse" style={{ height: `${30 + Math.random() * 50}%` }} />
                    ))}
                </div>
            ) : (
                <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="rgba(255,255,255,0.4)" />
                                    <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
                                    <stop offset="95%" stopColor="rgba(255,255,255,0)" />
                                </linearGradient>
                                <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                                    <stop offset="100%" stopColor="rgba(255,255,255,0.5)" />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis
                                dataKey="label"
                                stroke="#64748b"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#64748b"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
                                domain={[0, maxValue * 1.1]}
                            />
                            <Tooltip content={<CustomTooltip period={selectedPeriod} />} />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke="url(#strokeGradient)"
                                strokeWidth={2}
                                fill="url(#colorTotal)"
                                animationDuration={1000}
                                animationBegin={200}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
        </motion.div>
    )
}

export default ExpenseChart
