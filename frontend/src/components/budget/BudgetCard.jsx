import { useState } from 'react'
import { Edit2, Trash2, AlertTriangle, MoreVertical } from 'lucide-react'
import Card from '../common/Card'
import { CATEGORIES } from '../../utils/constants'
import { formatCurrency, cn } from '../../utils/formatters'

const BudgetCard = ({ budget, onEdit, onDelete }) => {
    const [showActions, setShowActions] = useState(false)
    const category = CATEGORIES[budget.category] || CATEGORIES.other
    const percentage = Math.min(budget.percentage || 0, 100)

    return (
        <Card hover className="relative group">
            {/* Actions menu */}
            <div className="absolute top-4 right-4">
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
                                    onEdit(budget)
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
                                    onDelete(budget._id)
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

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    category.bgColor
                )}>
                    <span className="text-lg">{getCategoryEmoji(budget.category)}</span>
                </div>
                <div>
                    <h3 className="font-semibold text-white">{category.label}</h3>
                    <p className="text-xs text-dark-400">Monthly budget</p>
                </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-dark-400">
                        {formatCurrency(budget.spent)} spent
                    </span>
                    <span className="text-sm font-medium text-white">
                        {formatCurrency(budget.limit)}
                    </span>
                </div>

                <div className="h-3 bg-dark-700/50 rounded-full overflow-hidden">
                    <div
                        className={cn(
                            'h-full rounded-full transition-all duration-500',
                            budget.isOverBudget ? 'bg-red-500' :
                                budget.isNearLimit ? 'bg-amber-500' :
                                    'bg-gradient-to-r from-primary-500 to-secondary-500'
                        )}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {(budget.isOverBudget || budget.isNearLimit) && (
                        <AlertTriangle className={cn(
                            'w-4 h-4',
                            budget.isOverBudget ? 'text-red-400' : 'text-amber-400'
                        )} />
                    )}
                    <span className={cn(
                        'text-sm font-medium',
                        budget.isOverBudget ? 'text-red-400' :
                            budget.isNearLimit ? 'text-amber-400' :
                                budget.remaining >= 0 ? 'text-emerald-400' : 'text-dark-400'
                    )}>
                        {budget.isOverBudget
                            ? `Over by ${formatCurrency(budget.spent - budget.limit)}`
                            : budget.isNearLimit
                                ? `${percentage.toFixed(0)}% used`
                                : `${formatCurrency(budget.remaining)} left`
                        }
                    </span>
                </div>

                <span className="text-xs text-dark-400">
                    {percentage.toFixed(0)}%
                </span>
            </div>
        </Card>
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
        other: '📦',
        total: '💰'
    }
    return emojis[category] || '📦'
}

export default BudgetCard
