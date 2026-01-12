import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Plus, Search, Filter, X, ChevronDown, Wallet, TrendingUp, Receipt } from 'lucide-react'
import { mockExpenses, delay } from '../utils/mockData'
import { CATEGORIES } from '../utils/constants'
import { formatCurrency, formatDate, formatRelativeTime } from '../utils/formatters'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import Modal from '../components/common/Modal'
import Input from '../components/common/Input'
import Select from '../components/common/Select'
import EmptyState from '../components/common/EmptyState'

// Mini stat card for top of page
const MiniStat = ({ icon: Icon, label, value, color, delay: animDelay }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: animDelay }}
            className="glass-card p-4 flex items-center gap-3"
        >
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-lg font-bold text-white">{value}</p>
                <p className="text-xs text-dark-400">{label}</p>
            </div>
        </motion.div>
    )
}

// Animated expense row
const ExpenseRow = ({ expense, index, onEdit, onDelete }) => {
    const category = CATEGORIES[expense.category] || CATEGORIES.other

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
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
            className="flex items-center gap-4 p-4 border-b border-white/5 last:border-b-0 group cursor-pointer"
            onClick={() => onEdit(expense)}
        >
            {/* Category icon */}
            <motion.div
                className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${category.bgColor}`}
                whileHover={{ scale: 1.1, rotate: 5 }}
            >
                <span className="text-xl">{getCategoryEmoji(expense.category)}</span>
            </motion.div>

            {/* Details */}
            <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{expense.description}</p>
                <div className="flex items-center gap-2 text-sm text-dark-400">
                    <span className={category.textColor}>{category.label}</span>
                    <span>•</span>
                    <span>{formatRelativeTime(expense.date)}</span>
                </div>
            </div>

            {/* Amount */}
            <div className="text-right">
                <p className="text-lg font-semibold text-white">
                    -{formatCurrency(expense.amount)}
                </p>
                <p className="text-xs text-dark-400 capitalize">{expense.paymentMethod?.replace('_', ' ')}</p>
            </div>

            {/* Hover indicator */}
            <motion.div
                className="w-2 h-2 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"
            />
        </motion.div>
    )
}

const Expenses = () => {
    const [expenses, setExpenses] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingExpense, setEditingExpense] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [showFilters, setShowFilters] = useState(false)
    const [filters, setFilters] = useState({ category: '', startDate: '', endDate: '' })

    useEffect(() => {
        loadExpenses()
    }, [])

    const loadExpenses = async () => {
        setLoading(true)
        await delay(600)
        setExpenses(mockExpenses)
        setLoading(false)
    }

    // Filter expenses
    const filteredExpenses = expenses.filter(e => {
        const matchesSearch = e.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = !filters.category || e.category === filters.category
        return matchesSearch && matchesCategory
    })

    // Calculate stats
    const totalSpent = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)
    const avgExpense = filteredExpenses.length > 0 ? totalSpent / filteredExpenses.length : 0

    const handleEdit = (expense) => {
        setEditingExpense(expense)
        setShowForm(true)
    }

    const handleDelete = (id) => {
        setExpenses(prev => prev.filter(e => e._id !== id))
    }

    const handleSave = (expenseData) => {
        if (editingExpense) {
            setExpenses(prev => prev.map(e =>
                e._id === editingExpense._id ? { ...e, ...expenseData } : e
            ))
        } else {
            const newExpense = {
                ...expenseData,
                _id: Date.now().toString(),
                date: new Date().toISOString()
            }
            setExpenses(prev => [newExpense, ...prev])
        }
        setShowForm(false)
        setEditingExpense(null)
    }

    const categoryOptions = Object.entries(CATEGORIES)
        .filter(([key]) => key !== 'total')
        .map(([value, { label }]) => ({ value, label }))

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
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">Expenses</h1>
                        <p className="text-dark-400">Track and manage your spending</p>
                    </div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button icon={Plus} onClick={() => setShowForm(true)}>
                            Add Expense
                        </Button>
                    </motion.div>
                </div>
            </motion.div>

            {/* Mini Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <MiniStat
                    icon={Wallet}
                    label="Total Spent"
                    value={formatCurrency(totalSpent)}
                    color="bg-primary-500/20 text-primary-400"
                    delay={0}
                />
                <MiniStat
                    icon={Receipt}
                    label="Transactions"
                    value={filteredExpenses.length}
                    color="bg-secondary-500/20 text-secondary-400"
                    delay={0.1}
                />
                <MiniStat
                    icon={TrendingUp}
                    label="Average"
                    value={formatCurrency(avgExpense)}
                    color="bg-emerald-500/20 text-emerald-400"
                    delay={0.2}
                />
                <MiniStat
                    icon={Filter}
                    label="Categories"
                    value={new Set(filteredExpenses.map(e => e.category)).size}
                    color="bg-amber-500/20 text-amber-400"
                    delay={0.3}
                />
            </div>

            {/* Search and Filters */}
            <motion.div
                className="mb-6 space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex gap-3">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search expenses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input pl-14"
                        />
                    </div>

                    {/* Filter toggle */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowFilters(!showFilters)}
                        className={`btn-secondary ${showFilters ? 'border-primary-500/50' : ''}`}
                    >
                        <Filter className="w-5 h-5" />
                        <span className="hidden sm:inline">Filters</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </motion.button>
                </div>

                {/* Expanded filters */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="glass-card p-4 overflow-hidden"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="label">Category</label>
                                    <select
                                        value={filters.category}
                                        onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                                        className="input"
                                    >
                                        <option value="">All Categories</option>
                                        {categoryOptions.map(({ value, label }) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="label">From Date</label>
                                    <input
                                        type="date"
                                        value={filters.startDate}
                                        onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                                        className="input"
                                    />
                                </div>
                                <div>
                                    <label className="label">To Date</label>
                                    <input
                                        type="date"
                                        value={filters.endDate}
                                        onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                                        className="input"
                                    />
                                </div>
                            </div>
                            {(filters.category || filters.startDate || filters.endDate) && (
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={() => setFilters({ category: '', startDate: '', endDate: '' })}
                                    className="mt-4 btn-ghost text-sm"
                                >
                                    <X className="w-4 h-4" />
                                    Clear Filters
                                </motion.button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Expense List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                {loading ? (
                    <Card padding="none">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 border-b border-white/5 animate-pulse">
                                <div className="w-12 h-12 rounded-xl bg-dark-700/50" />
                                <div className="flex-1">
                                    <div className="w-32 h-4 bg-dark-700/50 rounded mb-2" />
                                    <div className="w-24 h-3 bg-dark-700/50 rounded" />
                                </div>
                                <div className="w-20 h-5 bg-dark-700/50 rounded" />
                            </div>
                        ))}
                    </Card>
                ) : filteredExpenses.length > 0 ? (
                    <Card padding="none" className="overflow-hidden">
                        <AnimatePresence>
                            {filteredExpenses.map((expense, index) => (
                                <ExpenseRow
                                    key={expense._id}
                                    expense={expense}
                                    index={index}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </AnimatePresence>
                    </Card>
                ) : (
                    <Card>
                        <EmptyState
                            icon={Receipt}
                            title="No expenses found"
                            description={searchQuery || filters.category
                                ? "Try adjusting your search or filters"
                                : "Start tracking your spending by adding your first expense."}
                            action={
                                !searchQuery && !filters.category && (
                                    <Button onClick={() => setShowForm(true)}>Add Expense</Button>
                                )
                            }
                        />
                    </Card>
                )}
            </motion.div>

            {/* Add/Edit Expense Modal */}
            <ExpenseFormModal
                isOpen={showForm}
                expense={editingExpense}
                onClose={() => { setShowForm(false); setEditingExpense(null) }}
                onSave={handleSave}
            />
        </div>
    )
}

// Expense form modal component
const ExpenseFormModal = ({ isOpen, expense, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        amount: '',
        category: '',
        description: '',
        paymentMethod: 'credit_card'
    })

    useEffect(() => {
        if (expense) {
            setFormData({
                amount: expense.amount.toString(),
                category: expense.category,
                description: expense.description,
                paymentMethod: expense.paymentMethod || 'credit_card'
            })
        } else {
            setFormData({
                amount: '',
                category: '',
                description: '',
                paymentMethod: 'credit_card'
            })
        }
    }, [expense, isOpen])

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave({
            ...formData,
            amount: parseFloat(formData.amount)
        })
    }

    const categoryOptions = Object.entries(CATEGORIES)
        .filter(([key]) => key !== 'total')
        .map(([value, { label }]) => ({ value, label }))

    const paymentOptions = [
        { value: 'credit_card', label: 'Credit Card' },
        { value: 'debit_card', label: 'Debit Card' },
        { value: 'cash', label: 'Cash' },
        { value: 'bank_transfer', label: 'Bank Transfer' }
    ]

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={expense ? 'Edit Expense' : 'Add Expense'}
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                    label="Amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    required
                />

                <Select
                    label="Category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    options={categoryOptions}
                    placeholder="Select category"
                    required
                />

                <Input
                    label="Description"
                    placeholder="What was this expense for?"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                />

                <Select
                    label="Payment Method"
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    options={paymentOptions}
                />

                <div className="flex gap-3 pt-2">
                    <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
                        Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                        {expense ? 'Update' : 'Add'} Expense
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default Expenses
