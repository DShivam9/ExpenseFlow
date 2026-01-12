// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount)
}

// Format date
export const formatDate = (date, format = 'short') => {
    const d = new Date(date)

    if (format === 'short') {
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    if (format === 'medium') {
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    if (format === 'long') {
        return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    }

    if (format === 'iso') {
        return d.toISOString().split('T')[0]
    }

    return d.toLocaleDateString('en-US')
}

// Format relative time
export const formatRelativeTime = (date) => {
    const now = new Date()
    const d = new Date(date)
    const diffInSeconds = Math.floor((now - d) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

    return formatDate(date, 'short')
}

// Format number with abbreviation
export const formatNumber = (num) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
}

// Format percentage
export const formatPercentage = (value, decimals = 1) => {
    return `${value.toFixed(decimals)}%`
}

// Get current month and year
export const getCurrentPeriod = () => {
    const now = new Date()
    return {
        month: now.getMonth() + 1,
        year: now.getFullYear()
    }
}

// Get month name
export const getMonthName = (month, short = false) => {
    const months = short
        ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return months[month - 1]
}

// Debounce function
export const debounce = (func, wait) => {
    let timeout
    return (...args) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => func(...args), wait)
    }
}

// Classname helper
export const cn = (...classes) => {
    return classes.filter(Boolean).join(' ')
}
