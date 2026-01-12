import { motion } from 'framer-motion'
import { useState } from 'react'
import { Bell, Calendar, Check, ChevronRight, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatCurrency } from '../../utils/formatters'

const BillRemindersWidget = ({ reminders = [], loading = false }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        })
    }

    const upcoming = [...reminders]
        .filter(r => !r.isPaid)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5)

    const getDaysUntil = (dateString) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const due = new Date(dateString)
        due.setHours(0, 0, 0, 0)
        return Math.ceil((due - today) / (1000 * 60 * 60 * 24))
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    if (loading) {
        return (
            <div className="h-full p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                <div className="animate-pulse">
                    <div className="h-5 w-32 bg-white/5 rounded mb-6" />
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-14 bg-white/5 rounded-lg" />
                        ))}
                    </div>
                </div>
            </div>
        )
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
                          hover:border-white/20 transition-all duration-300 overflow-hidden flex flex-col">

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
                <div className="flex items-center justify-between mb-5 relative z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
                            <Bell className="w-4 h-4 text-white/80" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Bill Reminders</h3>
                            <p className="text-xs text-zinc-500">{upcoming.length} upcoming</p>
                        </div>
                    </div>
                    <Link
                        to="/app/reminders"
                        className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1"
                    >
                        View All
                        <ChevronRight className="w-3 h-3" />
                    </Link>
                </div>

                {/* Reminders List */}
                <div className="flex-1 space-y-2 relative z-10">
                    {upcoming.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                                <Check className="w-6 h-6 text-white/60" />
                            </div>
                            <p className="text-sm text-zinc-500">All caught up!</p>
                            <p className="text-xs text-zinc-600">No pending bills</p>
                        </div>
                    ) : (
                        upcoming.map((reminder, index) => {
                            const days = getDaysUntil(reminder.dueDate)
                            // Urgency = brighter white for sooner due dates
                            const urgency = days <= 2 ? 1 : days <= 5 ? 0.7 : 0.4

                            return (
                                <motion.div
                                    key={reminder._id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.03)' }}
                                    className="flex items-center justify-between p-3 rounded-lg border border-white/5
                                             hover:border-white/10 transition-all cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        {days <= 2 && (
                                            <AlertCircle className="w-4 h-4 text-white/70" />
                                        )}
                                        <div>
                                            <p className="text-sm font-medium text-white">{reminder.name}</p>
                                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                                                <Calendar className="w-3 h-3" />
                                                <span>{formatDate(reminder.dueDate)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-white">
                                            {formatCurrency(reminder.amount)}
                                        </p>
                                        <p className="text-xs font-medium" style={{ opacity: urgency, color: 'white' }}>
                                            {days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `${days} days`}
                                        </p>
                                    </div>
                                </motion.div>
                            )
                        })
                    )}
                </div>

                {/* Total Due */}
                {upcoming.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between relative z-10"
                    >
                        <span className="text-xs text-zinc-500">Total due this week</span>
                        <span className="text-sm font-bold text-white">
                            {formatCurrency(
                                upcoming
                                    .filter(r => getDaysUntil(r.dueDate) <= 7)
                                    .reduce((sum, r) => sum + r.amount, 0)
                            )}
                        </span>
                    </motion.div>
                )}
            </div>
        </motion.div>
    )
}

export default BillRemindersWidget
