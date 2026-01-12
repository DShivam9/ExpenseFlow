import { useState } from 'react'
import { Search, Filter, X, ChevronDown } from 'lucide-react'
import { CATEGORIES, PAYMENT_METHODS } from '../../utils/constants'
import { cn } from '../../utils/formatters'

const ExpenseFilters = ({ filters, onFilterChange, onReset }) => {
    const [showFilters, setShowFilters] = useState(false)

    const categoryOptions = Object.entries(CATEGORIES)
        .filter(([key]) => key !== 'total')
        .map(([value, { label }]) => ({ value, label }))

    const hasActiveFilters = filters.category || filters.startDate || filters.endDate ||
        filters.minAmount || filters.maxAmount || filters.search

    return (
        <div className="space-y-4">
            {/* Search and filter toggle */}
            <div className="flex gap-3">
                {/* Search */}
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                    <input
                        type="text"
                        placeholder="Search expenses..."
                        value={filters.search || ''}
                        onChange={(e) => onFilterChange({ search: e.target.value })}
                        className="input pl-12"
                    />
                </div>

                {/* Filter toggle button */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(
                        'btn-secondary relative',
                        hasActiveFilters && 'border-primary-500/50'
                    )}
                >
                    <Filter className="w-5 h-5" />
                    <span className="hidden sm:inline">Filters</span>
                    {hasActiveFilters && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full" />
                    )}
                    <ChevronDown className={cn(
                        'w-4 h-4 transition-transform',
                        showFilters && 'rotate-180'
                    )} />
                </button>
            </div>

            {/* Expanded filters */}
            {showFilters && (
                <div className="glass-card p-4 animate-slide-down">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Category */}
                        <div>
                            <label className="label">Category</label>
                            <select
                                value={filters.category || ''}
                                onChange={(e) => onFilterChange({ category: e.target.value })}
                                className="input"
                            >
                                <option value="">All Categories</option>
                                {categoryOptions.map(({ value, label }) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Date Range */}
                        <div>
                            <label className="label">From Date</label>
                            <input
                                type="date"
                                value={filters.startDate || ''}
                                onChange={(e) => onFilterChange({ startDate: e.target.value })}
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="label">To Date</label>
                            <input
                                type="date"
                                value={filters.endDate || ''}
                                onChange={(e) => onFilterChange({ endDate: e.target.value })}
                                className="input"
                            />
                        </div>

                        {/* Amount Range */}
                        <div>
                            <label className="label">Amount Range</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.minAmount || ''}
                                    onChange={(e) => onFilterChange({ minAmount: e.target.value })}
                                    className="input"
                                />
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.maxAmount || ''}
                                    onChange={(e) => onFilterChange({ maxAmount: e.target.value })}
                                    className="input"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Reset button */}
                    {hasActiveFilters && (
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={onReset}
                                className="btn-ghost text-sm"
                            >
                                <X className="w-4 h-4" />
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default ExpenseFilters
