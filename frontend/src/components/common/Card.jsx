import { cn } from '../../utils/formatters'

const Card = ({
    children,
    className = '',
    hover = false,
    padding = 'md',
    ...props
}) => {
    const paddings = {
        none: '',
        sm: 'p-4',
        md: 'p-5 sm:p-6',
        lg: 'p-6 sm:p-8'
    }

    return (
        <div
            className={cn(
                hover ? 'glass-card-hover' : 'glass-card',
                paddings[padding],
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

export default Card
