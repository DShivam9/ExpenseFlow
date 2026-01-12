import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Receipt, Target, Sparkles } from 'lucide-react'
import Modal from '../common/Modal'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import { CATEGORIES } from '../../utils/constants'

const QuickAddFAB = ({ onAddExpense, onAddBudget }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [showExpenseForm, setShowExpenseForm] = useState(false)
    const [expenseData, setExpenseData] = useState({
        amount: '',
        category: '',
        description: ''
    })

    const actions = [
        {
            icon: Receipt,
            label: 'Quick Expense',
            color: 'from-primary-500 to-primary-600',
            onClick: () => {
                setIsOpen(false)
                setShowExpenseForm(true)
            }
        },
        {
            icon: Target,
            label: 'New Budget',
            color: 'from-secondary-500 to-secondary-600',
            onClick: () => {
                setIsOpen(false)
                if (onAddBudget) onAddBudget()
            }
        },
    ]

    const handleQuickAdd = () => {
        if (expenseData.amount && expenseData.category && onAddExpense) {
            onAddExpense({
                ...expenseData,
                amount: parseFloat(expenseData.amount),
                date: new Date().toISOString(),
                paymentMethod: 'credit_card'
            })
        }
        setShowExpenseForm(false)
        setExpenseData({ amount: '', category: '', description: '' })
    }

    const categoryOptions = Object.entries(CATEGORIES)
        .filter(([key]) => key !== 'total')
        .map(([value, { label }]) => ({ value, label }))

    return (
        <>
            {/* FAB Button */}
            <div className="fixed bottom-6 right-6 z-50 lg:bottom-8 lg:right-8">
                <AnimatePresence>
                    {isOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/40 backdrop-blur-sm -z-10"
                                onClick={() => setIsOpen(false)}
                            />

                            {/* Action buttons */}
                            <div className="absolute bottom-16 right-0 flex flex-col items-end gap-3">
                                {actions.map((action, index) => (
                                    <motion.button
                                        key={action.label}
                                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.8 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={action.onClick}
                                        className="flex items-center gap-3 group"
                                    >
                                        {/* Label */}
                                        <motion.span
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + index * 0.05 }}
                                            className="px-3 py-1.5 rounded-lg bg-dark-800/90 text-white text-sm font-medium
                                 shadow-lg backdrop-blur-sm border border-white/10"
                                        >
                                            {action.label}
                                        </motion.span>

                                        {/* Icon button */}
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color}
                                    flex items-center justify-center shadow-lg
                                    group-hover:scale-110 transition-transform`}>
                                            <action.icon className="w-5 h-5 text-white" />
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </>
                    )}
                </AnimatePresence>

                {/* Main FAB */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative w-14 h-14 lg:w-16 lg:h-16 rounded-2xl
                     bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600
                     flex items-center justify-center shadow-lg z-10
                     hover:shadow-primary-500/40 hover:shadow-xl transition-shadow"
                >
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 
                          blur-xl opacity-50 -z-10" />

                    <motion.div
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {isOpen ? (
                            <X className="w-6 h-6 text-white" />
                        ) : (
                            <Plus className="w-6 h-6 text-white" />
                        )}
                    </motion.div>

                    {/* Pulse ring */}
                    {!isOpen && (
                        <motion.div
                            className="absolute inset-0 rounded-2xl border-2 border-primary-400"
                            animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                    )}
                </motion.button>
            </div>

            {/* Quick Expense Form Modal */}
            <Modal
                isOpen={showExpenseForm}
                onClose={() => setShowExpenseForm(false)}
                title="Quick Add Expense"
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-primary-500/10 border border-primary-500/20">
                        <Sparkles className="w-5 h-5 text-primary-400" />
                        <p className="text-sm text-dark-300">
                            Quickly log an expense without leaving your current page
                        </p>
                    </div>

                    <Input
                        label="Amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={expenseData.amount}
                        onChange={(e) => setExpenseData(prev => ({ ...prev, amount: e.target.value }))}
                        autoFocus
                    />

                    <Select
                        label="Category"
                        value={expenseData.category}
                        onChange={(e) => setExpenseData(prev => ({ ...prev, category: e.target.value }))}
                        options={categoryOptions}
                        placeholder="Select category"
                    />

                    <Input
                        label="Description (optional)"
                        placeholder="What was this for?"
                        value={expenseData.description}
                        onChange={(e) => setExpenseData(prev => ({ ...prev, description: e.target.value }))}
                    />

                    <div className="flex gap-3 pt-2">
                        <Button
                            variant="secondary"
                            onClick={() => setShowExpenseForm(false)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleQuickAdd}
                            className="flex-1"
                            disabled={!expenseData.amount || !expenseData.category}
                        >
                            Add Expense
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default QuickAddFAB
