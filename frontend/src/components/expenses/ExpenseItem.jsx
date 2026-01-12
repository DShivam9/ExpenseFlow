import { useState } from 'react'
import { Edit2, Trash2, MoreVertical } from 'lucide-react'
import { CATEGORIES } from '../../utils/constants'
import { formatCurrency, formatDate, cn } from '../../utils/formatters'

const ExpenseItem = ({ expense, onEdit, onDelete }) => {
    const [showActions, setShowActions] = useState(false)
    const category = CATEGORIES[expense.category] || CATEGORIES.other

    return (
        <div
            className="group flex items-center gap-4 p-4 border-b border-white/5 last:border-b-0
                 hover:bg-white/5 transition-colors"
        >
            {/* Category icon */}
            <div className={cn(
                'w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                'transition-transform group-hover:scale-110',
                category.bgColor
            )}>
                <span className="text-lg sm:text-xl">{getCategoryEmoji(expense.category)}</span>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-medium text-white truncate">
                    {expense.description}
                </p>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-dark-400">
                    <span className={category.textColor}>{category.label}</span>
                    <span>•</span>
                    <span>{formatDate(expense.date, 'medium')}</span>
                </div>
            </div>

            {/* Amount */}
            <div className="text-right flex-shrink-0">
                <p className="text-sm sm:text-base font-semibold text-white">
                    -{formatCurrency(expense.amount)}
                </p>
                {expense.paymentMethod && (
                    <p className="text-xs text-dark-400 capitalize">{expense.paymentMethod}</p>
                )}
            </div>

            {/* Actions */}
            <div className="relative flex-shrink-0">
                <button
                    onClick={() => setShowActions(!showActions)}
                    className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-white/10 
                     transition-colors opacity-0 group-hover:opacity-100"
                >
                    <MoreVertical className="w-4 h-4" />
                </button>

                {showActions && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowActions(false)}
                        />
                        <div className="absolute right-0 top-full mt-1 z-20 bg-surface-light border border-white/10 
                           rounded-xl shadow-xl overflow-hidden min-w-[140px] animate-scale-in">
                            <button
                                onClick={() => {
                                    onEdit(expense)
                                    setShowActions(false)
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white 
                          hover:bg-white/10 transition-colors"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit
                            </button>
                            <button
                                onClick={() => {
                                    onDelete(expense._id)
                                    setShowActions(false)
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 
                          hover:bg-red-500/10 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

// Helper function to get emoji for category
const getCategoryEmoji = (category) => {
    const emojis = {
        food: '🍕',
        transportation: '🚗',
        entertainment: '🎬',
        shopping: '🛍️',
        utilities: '💡',
        healthcare: '💊',
        education: '📚',
        travel: '✈️',
        subscriptions: '📱',
        groceries: '🛒',
        rent: '🏠',
        other: '📦'
    }
    return emojis[category] || '📦'
}

export default ExpenseItem
