import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
    Plus,
    Target,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Wallet,
    Edit2,
    Trash2,
    PieChart
} from 'lucide-react'
import { mockBudgets, mockBudgetSummary, delay } from '../utils/mockData'
import { CATEGORIES } from '../utils/constants'
import { formatCurrency, cn } from '../utils/formatters'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import Modal from '../components/common/Modal'
import Input from '../components/common/Input'
import Select from '../components/common/Select'
import EmptyState from '../components/common/EmptyState'

// Summary card at the top
const BudgetSummaryCard = ({ summary, delay: animDelay }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

    const percentUsed = summary.totalBudget > 0
        ? (summary.totalSpent / summary.totalBudget) * 100
        : 0

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: animDelay }}
            className="glass-card p-6 relative overflow-hidden"
        >
            {/* Background gradient based on status */}
            <div className={cn(
                "absolute inset-0 opacity-10",
                percentUsed > 90 ? "bg-gradient-to-br from-red-500 to-orange-500" :
                    percentUsed > 70 ? "bg-gradient-to-br from-amber-500 to-yellow-500" :
                        "bg-gradient-to-br from-emerald-500 to-teal-500"
            )} />

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                        <PieChart className="w-6 h-6 text-primary-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">Monthly Budget Overview</h3>
                        <p className="text-sm text-dark-400">{summary.budgetCount} active budgets</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                        <p className="text-sm text-dark-400 mb-1">Total Budget</p>
                        <p className="text-2xl font-bold text-white">{formatCurrency(summary.totalBudget)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-dark-400 mb-1">Spent</p>
                        <p className="text-2xl font-bold text-primary-400">{formatCurrency(summary.totalSpent)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-dark-400 mb-1">Remaining</p>
                        <p className={cn(
                            "text-2xl font-bold",
                            summary.totalRemaining >= 0 ? "text-emerald-400" : "text-red-400"
                        )}>
                            {formatCurrency(summary.totalRemaining)}
                        </p>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="relative h-3 bg-dark-700 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${Math.min(percentUsed, 100)}%` } : {}}
                        transition={{ duration: 1, delay: animDelay + 0.3, ease: "easeOut" }}
                        className={cn(
                            "h-full rounded-full",
                            percentUsed > 90 ? "bg-gradient-to-r from-red-500 to-red-400" :
                                percentUsed > 70 ? "bg-gradient-to-r from-amber-500 to-amber-400" :
                                    "bg-gradient-to-r from-primary-500 to-secondary-500"
                        )}
                    />
                </div>
                <p className="text-sm text-dark-400 mt-2 text-center">
                    {percentUsed.toFixed(1)}% of budget used
                </p>
            </div>
        </motion.div>
    )
}

// Individual budget card
const BudgetCard = ({ budget, index, onEdit, onDelete }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })
    const category = CATEGORIES[budget.category] || CATEGORIES.other

    const getCategoryEmoji = (cat) => {
        const emojis = {
            food: '🍕', transportation: '🚗', entertainment: '🎬', shopping: '🛍️',
            utilities: '💡', healthcare: '💊', education: '📚', travel: '✈️',
            subscriptions: '📱', groceries: '🛒', rent: '🏠', other: '📦'
        }
        return emojis[cat] || '📦'
    }

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="glass-card p-5 relative overflow-hidden group"
        >
            {/* Status indicator line */}
            <div className={cn(
                "absolute top-0 left-0 right-0 h-1",
                budget.isOverBudget ? "bg-red-500" :
                    budget.isNearLimit ? "bg-amber-500" :
                        "bg-emerald-500"
            )} />

            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <motion.div
                        className={cn("w-12 h-12 rounded-xl flex items-center justify-center", category.bgColor)}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                        <span className="text-xl">{getCategoryEmoji(budget.category)}</span>
                    </motion.div>
                    <div>
                        <h3 className="font-semibold text-white">{category.label}</h3>
                        <p className="text-sm text-dark-400">
                            {formatCurrency(budget.spent)} of {formatCurrency(budget.limit)}
                        </p>
                    </div>
                </div>

                {/* Status badge */}
                <div className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                    budget.isOverBudget ? "bg-red-500/20 text-red-400" :
                        budget.isNearLimit ? "bg-amber-500/20 text-amber-400" :
                            "bg-emerald-500/20 text-emerald-400"
                )}>
                    {budget.isOverBudget ? <AlertTriangle className="w-3 h-3" /> :
                        budget.isNearLimit ? <AlertTriangle className="w-3 h-3" /> :
                            <CheckCircle className="w-3 h-3" />}
                    {budget.isOverBudget ? 'Over' : budget.isNearLimit ? 'Alert' : 'On Track'}
                </div>
            </div>

            {/* Progress bar */}
            <div className="relative h-2 bg-dark-700 rounded-full overflow-hidden mb-3">
                <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${Math.min(budget.percentage, 100)}%` } : {}}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className={cn(
                        "h-full rounded-full",
                        budget.isOverBudget ? "bg-red-500" :
                            budget.isNearLimit ? "bg-amber-500" :
                                "bg-gradient-to-r from-primary-500 to-secondary-500"
                    )}
                />
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-between text-sm">
                <span className={cn(
                    "font-medium",
                    budget.remaining >= 0 ? "text-emerald-400" : "text-red-400"
                )}>
                    {budget.remaining >= 0 ? `${formatCurrency(budget.remaining)} left` : `${formatCurrency(Math.abs(budget.remaining))} over`}
                </span>
                <span className="text-dark-400">{budget.percentage.toFixed(0)}%</span>
            </div>

            {/* Hover actions */}
            <motion.div
                className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={false}
            >
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(budget) }}
                    className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                    <Edit2 className="w-4 h-4 text-white" />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(budget._id) }}
                    className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center hover:bg-red-500/30 transition-colors"
                >
                    <Trash2 className="w-4 h-4 text-red-400" />
                </button>
            </motion.div>
        </motion.div>
    )
}

const Budgets = () => {
    const [budgets, setBudgets] = useState([])
    const [summary, setSummary] = useState(mockBudgetSummary)
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingBudget, setEditingBudget] = useState(null)
    const [currentMonth, setCurrentMonth] = useState(new Date())

    useEffect(() => {
        loadBudgets()
    }, [currentMonth])

    const loadBudgets = async () => {
        setLoading(true)
        await delay(600)
        setBudgets(mockBudgets)
        setSummary(mockBudgetSummary)
        setLoading(false)
    }

    const handleEdit = (budget) => {
        setEditingBudget(budget)
        setShowForm(true)
    }

    const handleDelete = (id) => {
        setBudgets(prev => prev.filter(b => b._id !== id))
    }

    const handleSave = (budgetData) => {
        if (editingBudget) {
            setBudgets(prev => prev.map(b =>
                b._id === editingBudget._id ? { ...b, ...budgetData } : b
            ))
        } else {
            const newBudget = {
                ...budgetData,
                _id: Date.now().toString(),
                spent: 0,
                remaining: budgetData.limit,
                percentage: 0,
                isOverBudget: false,
                isNearLimit: false
            }
            setBudgets(prev => [...prev, newBudget])
        }
        setShowForm(false)
        setEditingBudget(null)
    }

    const changeMonth = (delta) => {
        const newDate = new Date(currentMonth)
        newDate.setMonth(newDate.getMonth() + delta)
        setCurrentMonth(newDate)
    }

    const monthLabel = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

    return (
        <div className="page-container">
            {/* Header */}
            <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">Budgets</h1>
                        <p className="text-dark-400">Set and track your spending limits</p>
                    </div>

                    {/* Month selector */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center glass-card">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => changeMonth(-1)}
                                className="p-2 hover:bg-white/5 rounded-l-xl transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5 text-dark-400" />
                            </motion.button>
                            <span className="px-4 py-2 text-white font-medium min-w-[140px] text-center">
                                {monthLabel}
                            </span>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => changeMonth(1)}
                                className="p-2 hover:bg-white/5 rounded-r-xl transition-colors"
                            >
                                <ChevronRight className="w-5 h-5 text-dark-400" />
                            </motion.button>
                        </div>

                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button icon={Plus} onClick={() => setShowForm(true)}>
                                Add Budget
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Summary Card */}
            <div className="mb-8">
                <BudgetSummaryCard summary={summary} delay={0.1} />
            </div>

            {/* Budget Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="glass-card p-5 animate-pulse">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-dark-700/50" />
                                <div>
                                    <div className="w-24 h-4 bg-dark-700/50 rounded mb-2" />
                                    <div className="w-32 h-3 bg-dark-700/50 rounded" />
                                </div>
                            </div>
                            <div className="h-2 bg-dark-700/50 rounded mb-3" />
                            <div className="flex justify-between">
                                <div className="w-16 h-3 bg-dark-700/50 rounded" />
                                <div className="w-8 h-3 bg-dark-700/50 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : budgets.length > 0 ? (
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    initial="hidden"
                    animate="visible"
                >
                    {budgets.map((budget, index) => (
                        <BudgetCard
                            key={budget._id}
                            budget={budget}
                            index={index}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </motion.div>
            ) : (
                <Card>
                    <EmptyState
                        icon={Target}
                        title="No budgets set"
                        description="Create your first budget to start tracking your spending limits."
                        action={<Button onClick={() => setShowForm(true)}>Create Budget</Button>}
                    />
                </Card>
            )}

            {/* Add/Edit Budget Modal */}
            <BudgetFormModal
                isOpen={showForm}
                budget={editingBudget}
                onClose={() => { setShowForm(false); setEditingBudget(null) }}
                onSave={handleSave}
            />
        </div>
    )
}

// Budget form modal
const BudgetFormModal = ({ isOpen, budget, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        category: '',
        limit: '',
        alertThreshold: 80
    })

    useEffect(() => {
        if (budget) {
            setFormData({
                category: budget.category,
                limit: budget.limit.toString(),
                alertThreshold: budget.alertThreshold || 80
            })
        } else {
            setFormData({
                category: '',
                limit: '',
                alertThreshold: 80
            })
        }
    }, [budget, isOpen])

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave({
            ...formData,
            limit: parseFloat(formData.limit),
            alertThreshold: parseInt(formData.alertThreshold)
        })
    }

    const categoryOptions = Object.entries(CATEGORIES)
        .filter(([key]) => key !== 'total')
        .map(([value, { label }]) => ({ value, label }))

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={budget ? 'Edit Budget' : 'Create Budget'}
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <Select
                    label="Category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    options={categoryOptions}
                    placeholder="Select category"
                    required
                    disabled={!!budget}
                />

                <Input
                    label="Monthly Limit"
                    type="number"
                    step="0.01"
                    placeholder="500.00"
                    value={formData.limit}
                    onChange={(e) => setFormData(prev => ({ ...prev, limit: e.target.value }))}
                    required
                />

                <div>
                    <label className="label">Alert Threshold: {formData.alertThreshold}%</label>
                    <input
                        type="range"
                        min="50"
                        max="95"
                        value={formData.alertThreshold}
                        onChange={(e) => setFormData(prev => ({ ...prev, alertThreshold: e.target.value }))}
                        className="w-full h-2 bg-dark-700 rounded-full appearance-none cursor-pointer 
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                       [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary-500 
                       [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                    <p className="text-xs text-dark-400 mt-1">
                        You'll get an alert when spending reaches this percentage
                    </p>
                </div>

                <div className="flex gap-3 pt-2">
                    <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
                        Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                        {budget ? 'Update' : 'Create'} Budget
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default Budgets
