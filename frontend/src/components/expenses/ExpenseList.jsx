import { Receipt } from 'lucide-react'
import Card from '../common/Card'
import EmptyState from '../common/EmptyState'
import Skeleton from '../common/Skeleton'
import ExpenseItem from './ExpenseItem'
import Button from '../common/Button'

const ExpenseList = ({
    expenses,
    loading,
    pagination,
    onEdit,
    onDelete,
    onLoadMore
}) => {
    if (loading && expenses.length === 0) {
        return <Skeleton.ExpenseList count={6} />
    }

    if (!loading && expenses.length === 0) {
        return (
            <Card>
                <EmptyState
                    icon={Receipt}
                    title="No expenses found"
                    description="Start tracking your spending by adding your first expense."
                />
            </Card>
        )
    }

    return (
        <div>
            <Card padding="none" className="overflow-hidden">
                {expenses.map((expense) => (
                    <ExpenseItem
                        key={expense._id}
                        expense={expense}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </Card>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm text-dark-400">
                        Showing {expenses.length} of {pagination.total} expenses
                    </p>

                    {pagination.currentPage < pagination.totalPages && (
                        <Button
                            variant="secondary"
                            onClick={onLoadMore}
                            loading={loading}
                        >
                            Load More
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}

export default ExpenseList
