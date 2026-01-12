import { PiggyBank, AlertTriangle, TrendingUp } from 'lucide-react'
import Card from '../common/Card'
import Button from '../common/Button'
import EmptyState from '../common/EmptyState'
import Skeleton from '../common/Skeleton'
import BudgetCard from './BudgetCard'
import { CATEGORIES } from '../../utils/constants'
import { formatCurrency, cn } from '../../utils/formatters'

const BudgetList = ({
    budgets,
    summary,
    loading,
    onEdit,
    onDelete,
    onAdd
}) => {
    if (loading) {
        return (
            <div className="space-y-6">
                {/* Summary skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton.Stat key={i} />
                    ))}
                </div>

                {/* Budget cards skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton.Card key={i} />
                    ))}
                </div>
            </div>
        )
    }

    // Filter category budgets (exclude 'total')
    const categoryBudgets = budgets.filter(b => b.category !== 'total')

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            {summary && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                            <PiggyBank className="w-6 h-6 text-primary-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">
                                {formatCurrency(summary.totalBudget)}
                            </p>
                            <p className="text-sm text-dark-400">Total Budget</p>
                        </div>
                    </Card>

                    <Card className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-secondary-500/20 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-secondary-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">
                                {formatCurrency(summary.totalSpent)}
                            </p>
                            <p className="text-sm text-dark-400">Total Spent</p>
                        </div>
                    </Card>

                    <Card className={cn(
                        'flex items-center gap-4',
                        summary.totalRemaining < 0 && 'border-red-500/30'
                    )}>
                        <div className={cn(
                            'w-12 h-12 rounded-xl flex items-center justify-center',
                            summary.totalRemaining >= 0
                                ? 'bg-emerald-500/20'
                                : 'bg-red-500/20'
                        )}>
                            <AlertTriangle className={cn(
                                'w-6 h-6',
                                summary.totalRemaining >= 0
                                    ? 'text-emerald-400'
                                    : 'text-red-400'
                            )} />
                        </div>
                        <div>
                            <p className={cn(
                                'text-2xl font-bold',
                                summary.totalRemaining >= 0 ? 'text-emerald-400' : 'text-red-400'
                            )}>
                                {formatCurrency(Math.abs(summary.totalRemaining))}
                            </p>
                            <p className="text-sm text-dark-400">
                                {summary.totalRemaining >= 0 ? 'Remaining' : 'Over Budget'}
                            </p>
                        </div>
                    </Card>
                </div>
            )}

            {/* Budget Cards */}
            {categoryBudgets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryBudgets.map((budget) => (
                        <BudgetCard
                            key={budget._id}
                            budget={budget}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            ) : (
                <Card>
                    <EmptyState
                        icon={PiggyBank}
                        title="No budgets set"
                        description="Create budgets to track your spending by category."
                        action={
                            <Button onClick={onAdd}>
                                Create Budget
                            </Button>
                        }
                    />
                </Card>
            )}
        </div>
    )
}

export default BudgetList
