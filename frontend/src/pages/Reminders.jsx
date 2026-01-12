import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Plus, Calendar, Check, Trash2, Edit2, X, AlertCircle, DollarSign } from 'lucide-react'
import { mockBillReminders } from '../utils/mockData'
import { formatCurrency } from '../utils/formatters'

const Reminders = () => {
    const [reminders, setReminders] = useState(mockBillReminders)
    const [showModal, setShowModal] = useState(false)
    const [filter, setFilter] = useState('all') // 'all' | 'upcoming' | 'paid'

    const getDaysUntil = (dateString) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const due = new Date(dateString)
        due.setHours(0, 0, 0, 0)
        return Math.ceil((due - today) / (1000 * 60 * 60 * 24))
    }

    const getUrgencyStyle = (days) => {
        if (days <= 2) return { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' }
        if (days <= 5) return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' }
        return { text: 'text-zinc-400', bg: 'bg-zinc-800/50', border: 'border-zinc-700/30' }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        })
    }

    const markAsPaid = (id) => {
        setReminders(prev => prev.map(r =>
            r._id === id ? { ...r, isPaid: true } : r
        ))
    }

    const filteredReminders = reminders.filter(r => {
        if (filter === 'paid') return r.isPaid
        if (filter === 'upcoming') return !r.isPaid
        return true
    })

    const totalUpcoming = reminders
        .filter(r => !r.isPaid)
        .reduce((sum, r) => sum + r.amount, 0)

    return (
        <div className="min-h-screen p-6 lg:p-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
            >
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Bill Reminders</h1>
                    <p className="text-zinc-500">Never miss a payment again</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Reminder
                </button>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            >
                <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs text-zinc-500">Total Due</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{formatCurrency(totalUpcoming)}</p>
                </div>
                <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Bell className="w-4 h-4 text-blue-400" />
                        <span className="text-xs text-zinc-500">Upcoming Bills</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{reminders.filter(r => !r.isPaid).length}</p>
                </div>
                <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs text-zinc-500">Paid This Month</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{reminders.filter(r => r.isPaid).length}</p>
                </div>
            </motion.div>

            {/* Filter Tabs */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex gap-2 mb-6"
            >
                {['all', 'upcoming', 'paid'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`
                            px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all
                            ${filter === tab
                                ? 'bg-white text-black'
                                : 'bg-zinc-900/50 text-zinc-400 hover:text-white border border-zinc-800/50'
                            }
                        `}
                    >
                        {tab}
                    </button>
                ))}
            </motion.div>

            {/* Reminders List */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
            >
                {filteredReminders.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                            <Bell className="w-8 h-8 text-zinc-600" />
                        </div>
                        <p className="text-zinc-500">No reminders found</p>
                    </div>
                ) : (
                    filteredReminders.map((reminder, index) => {
                        const days = getDaysUntil(reminder.dueDate)
                        const urgency = getUrgencyStyle(days)

                        return (
                            <motion.div
                                key={reminder._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`
                                    bg-zinc-900/50 backdrop-blur-xl border rounded-xl p-5
                                    ${reminder.isPaid
                                        ? 'border-zinc-800/50 opacity-60'
                                        : `${urgency.border}`
                                    }
                                `}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {/* Icon */}
                                        <div className={`
                                            w-12 h-12 rounded-xl flex items-center justify-center
                                            ${reminder.isPaid
                                                ? 'bg-emerald-500/10'
                                                : `${urgency.bg}`
                                            }
                                        `}>
                                            {reminder.isPaid ? (
                                                <Check className="w-5 h-5 text-emerald-400" />
                                            ) : days <= 2 ? (
                                                <AlertCircle className={`w-5 h-5 ${urgency.text}`} />
                                            ) : (
                                                <Bell className={`w-5 h-5 ${urgency.text}`} />
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div>
                                            <h3 className={`font-semibold ${reminder.isPaid ? 'text-zinc-500 line-through' : 'text-white'}`}>
                                                {reminder.name}
                                            </h3>
                                            <div className="flex items-center gap-3 text-sm text-zinc-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {formatDate(reminder.dueDate)}
                                                </span>
                                                <span className="capitalize">{reminder.recurring}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Amount & Actions */}
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className={`text-lg font-bold ${reminder.isPaid ? 'text-zinc-500' : 'text-white'}`}>
                                                {formatCurrency(reminder.amount)}
                                            </p>
                                            {!reminder.isPaid && (
                                                <p className={`text-xs font-medium ${urgency.text}`}>
                                                    {days === 0 ? 'Due Today' : days === 1 ? 'Due Tomorrow' : `${days} days left`}
                                                </p>
                                            )}
                                        </div>

                                        {!reminder.isPaid && (
                                            <button
                                                onClick={() => markAsPaid(reminder._id)}
                                                className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg text-emerald-400 transition-colors"
                                                title="Mark as paid"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })
                )}
            </motion.div>

            {/* Add Reminder Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">Add Reminder</h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-zinc-500 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <p className="text-zinc-500 text-center py-8">
                                Reminder creation will be available once backend is connected.
                            </p>

                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Reminders
