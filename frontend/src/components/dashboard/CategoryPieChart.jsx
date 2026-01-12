import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { PieChart as PieChartIcon } from 'lucide-react'
import { CATEGORIES } from '../../utils/constants'
import { formatCurrency } from '../../utils/formatters'
import Card from '../common/Card'


const COLORS = [
    '#8b5cf6', // primary-500
    '#06b6d4', // secondary-500
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
    '#ef4444', // red-500
    '#ec4899', // pink-500
    '#6366f1', // indigo-500
    '#14b8a6', // teal-500
]

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload
        const category = CATEGORIES[data._id] || CATEGORIES.other
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-3 border border-primary-500/30 shadow-xl"
            >
                <div className="flex items-center gap-2 mb-1">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: payload[0].payload.color }}
                    />
                    <p className="text-sm text-white font-medium">{category.label}</p>
                </div>
                <p className="text-lg font-bold text-white">
                    {formatCurrency(data.total)}
                </p>
                <p className="text-xs text-dark-400">{data.count} transactions</p>
            </motion.div>
        )
    }
    return null
}

const CategoryPieChart = ({ data = [], loading }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

    const chartData = data.map((item, index) => ({
        ...item,
        color: COLORS[index % COLORS.length]
    }))

    const total = data.reduce((sum, item) => sum + item.total, 0)

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
        >
            <Card className="h-full">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-white">By Category</h3>
                        <p className="text-sm text-dark-400">Spending breakdown</p>
                    </div>
                    <motion.div
                        className="w-10 h-10 rounded-xl bg-secondary-500/20 flex items-center justify-center"
                        whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                        <PieChartIcon className="w-5 h-5 text-secondary-400" />
                    </motion.div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-48">
                        <div className="w-32 h-32 skeleton rounded-full" />
                    </div>
                ) : (
                    <>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={70}
                                        paddingAngle={3}
                                        dataKey="total"
                                        animationDuration={1000}
                                        animationBegin={200}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                                stroke="transparent"
                                                style={{
                                                    filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))'
                                                }}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Legend */}
                        <div className="space-y-2 mt-4">
                            {chartData.slice(0, 4).map((item, index) => {
                                const category = CATEGORIES[item._id] || CATEGORIES.other
                                const percentage = total > 0 ? (item.total / total * 100).toFixed(1) : 0

                                return (
                                    <motion.div
                                        key={item._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                        className="flex items-center justify-between group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full transition-transform group-hover:scale-125"
                                                style={{ backgroundColor: item.color }}
                                            />
                                            <span className="text-sm text-dark-300 group-hover:text-white transition-colors">
                                                {category.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-white">
                                                {formatCurrency(item.total)}
                                            </span>
                                            <span className="text-xs text-dark-400">
                                                {percentage}%
                                            </span>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </>
                )}
            </Card>
        </motion.div>
    )
}

export default CategoryPieChart
