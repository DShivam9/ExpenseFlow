import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../utils/formatters'

const Select = forwardRef(({
    label,
    error,
    options = [],
    placeholder = 'Select...',
    className = '',
    containerClassName = '',
    ...props
}, ref) => {
    return (
        <div className={cn('w-full', containerClassName)}>
            {label && (
                <label className="label">{label}</label>
            )}
            <div className="relative">
                <select
                    ref={ref}
                    className={cn(
                        'input appearance-none pr-10 cursor-pointer',
                        error && 'input-error',
                        className
                    )}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>{placeholder}</option>
                    )}
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            className="bg-dark-900 text-white"
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400 pointer-events-none" />
            </div>
            {error && (
                <p className="mt-1.5 text-sm text-red-400">{error}</p>
            )}
        </div>
    )
})

Select.displayName = 'Select'

export default Select
