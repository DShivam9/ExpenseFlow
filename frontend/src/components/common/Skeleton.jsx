import { cn } from '../../utils/formatters'

// Text skeleton
const SkeletonText = ({ width = 'w-full', className = '' }) => (
    <div className={cn('h-4 skeleton rounded', width, className)} />
)

// Circle skeleton
const SkeletonCircle = ({ size = 'w-10 h-10', className = '' }) => (
    <div className={cn('skeleton rounded-full', size, className)} />
)

// Card skeleton
const SkeletonCard = ({ className = '' }) => (
    <div className={cn('glass-card p-5 space-y-4', className)}>
        <div className="flex items-center gap-3">
            <SkeletonCircle />
            <div className="flex-1 space-y-2">
                <SkeletonText width="w-1/3" />
                <SkeletonText width="w-1/2" />
            </div>
        </div>
        <SkeletonText />
        <SkeletonText width="w-3/4" />
    </div>
)

// Stat card skeleton
const SkeletonStat = ({ className = '' }) => (
    <div className={cn('glass-card p-5', className)}>
        <div className="flex items-center gap-3 mb-4">
            <SkeletonCircle size="w-12 h-12" />
            <SkeletonText width="w-24" />
        </div>
        <SkeletonText width="w-20" className="h-8 mb-2" />
        <SkeletonText width="w-32" />
    </div>
)

// Chart skeleton
const SkeletonChart = ({ height = 'h-64', className = '' }) => (
    <div className={cn('glass-card p-5', className)}>
        <SkeletonText width="w-32" className="mb-4" />
        <div className={cn('skeleton rounded-lg', height)} />
    </div>
)

// Table row skeleton
const SkeletonTableRow = () => (
    <div className="flex items-center gap-4 p-4 border-b border-white/5">
        <SkeletonCircle size="w-10 h-10" />
        <div className="flex-1">
            <SkeletonText width="w-1/3" className="mb-2" />
            <SkeletonText width="w-1/4" className="h-3" />
        </div>
        <SkeletonText width="w-20" />
    </div>
)

// Expense list skeleton
const SkeletonExpenseList = ({ count = 5 }) => (
    <div className="glass-card overflow-hidden">
        {Array.from({ length: count }).map((_, i) => (
            <SkeletonTableRow key={i} />
        ))}
    </div>
)

const Skeleton = {
    Text: SkeletonText,
    Circle: SkeletonCircle,
    Card: SkeletonCard,
    Stat: SkeletonStat,
    Chart: SkeletonChart,
    TableRow: SkeletonTableRow,
    ExpenseList: SkeletonExpenseList
}

export default Skeleton
