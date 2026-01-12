import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import Card from '../common/Card'
import { formatCurrency } from '../../utils/formatters'
import { cn } from '../../utils/formatters'

const StatsCard = ({
    title,
    value,
    change,
    changeType = 'neutral',
    icon: Icon,
    iconColor = 'bg-primary-500/20 text-primary-400',
    currency = 'USD',
    loading = false
}) => {
    const [displayValue, setDisplayValue] = useState(0)

    // Animate counter
    useEffect(() => {
        if (loading) return

        const duration = 1000
        const steps = 60
        const stepValue = value / steps
        let current = 0

        const timer = setInterval(() => {
            current += stepValue
            if (current >= value) {
                setDisplayValue(value)
                clearInterval(timer)
            } else {
                setDisplayValue(current)
            }
        }, duration / steps)

        return () => clearInterval(timer)
    }, [value, loading])

    if (loading) {
        return (
            <Card className="animate-pulse">
                <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-dark-700/50" />
                    <div className="w-20 h-4 bg-dark-700/50 rounded" />
                </div>
                <div className="w-24 h-8 bg-dark-700/50 rounded mb-2" />
                <div className="w-32 h-4 bg-dark-700/50 rounded" />
            </Card>
        )
    }

    return (
        <Card hover className="group">
            <div className="flex items-start justify-between mb-4">
                <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110',
                    iconColor
                )}>
                    <Icon className="w-6 h-6" />
                </div>

                {change !== undefined && (
                    <div className={cn(
                        'flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
                        changeType === 'positive' && 'bg-emerald-500/20 text-emerald-400',
                        changeType === 'negative' && 'bg-red-500/20 text-red-400',
                        changeType === 'neutral' && 'bg-dark-700/50 text-dark-300'
                    )}>
                        {changeType === 'positive' && <TrendingUp className="w-3 h-3" />}
                        {changeType === 'negative' && <TrendingDown className="w-3 h-3" />}
                        <span>{change > 0 ? '+' : ''}{change.toFixed(1)}%</span>
                    </div>
                )}
            </div>

            <p className="text-2xl sm:text-3xl font-bold text-white mb-1 count-up">
                {formatCurrency(displayValue, currency)}
            </p>
            <p className="text-sm text-dark-400">{title}</p>
        </Card>
    )
}

export default StatsCard
