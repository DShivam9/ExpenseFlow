import { cn } from '../../utils/formatters'

const EmptyState = ({
    icon: Icon,
    title,
    description,
    action,
    className = ''
}) => {
    return (
        <div className={cn(
            'flex flex-col items-center justify-center py-12 px-6 text-center',
            className
        )}>
            {Icon && (
                <div className="w-16 h-16 rounded-2xl bg-dark-800/50 flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-dark-400" />
                </div>
            )}
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            {description && (
                <p className="text-dark-400 text-sm max-w-sm mb-6">{description}</p>
            )}
            {action}
        </div>
    )
}

export default EmptyState
