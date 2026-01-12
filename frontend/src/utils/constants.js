// Category configuration
export const CATEGORIES = {
    food: { label: 'Food & Dining', color: '#F59E0B', bgColor: 'bg-amber-500/20', textColor: 'text-amber-400' },
    transportation: { label: 'Transportation', color: '#3B82F6', bgColor: 'bg-blue-500/20', textColor: 'text-blue-400' },
    entertainment: { label: 'Entertainment', color: '#8B5CF6', bgColor: 'bg-purple-500/20', textColor: 'text-purple-400' },
    shopping: { label: 'Shopping', color: '#EC4899', bgColor: 'bg-pink-500/20', textColor: 'text-pink-400' },
    utilities: { label: 'Utilities', color: '#6366F1', bgColor: 'bg-indigo-500/20', textColor: 'text-indigo-400' },
    healthcare: { label: 'Healthcare', color: '#EF4444', bgColor: 'bg-red-500/20', textColor: 'text-red-400' },
    education: { label: 'Education', color: '#14B8A6', bgColor: 'bg-teal-500/20', textColor: 'text-teal-400' },
    travel: { label: 'Travel', color: '#F97316', bgColor: 'bg-orange-500/20', textColor: 'text-orange-400' },
    subscriptions: { label: 'Subscriptions', color: '#06B6D4', bgColor: 'bg-cyan-500/20', textColor: 'text-cyan-400' },
    groceries: { label: 'Groceries', color: '#22C55E', bgColor: 'bg-green-500/20', textColor: 'text-green-400' },
    rent: { label: 'Rent', color: '#A855F7', bgColor: 'bg-fuchsia-500/20', textColor: 'text-fuchsia-400' },
    other: { label: 'Other', color: '#6B7280', bgColor: 'bg-gray-500/20', textColor: 'text-gray-400' },
    total: { label: 'Total Budget', color: '#8B5CF6', bgColor: 'bg-purple-500/20', textColor: 'text-purple-400' }
}

export const PAYMENT_METHODS = {
    cash: { label: 'Cash', icon: 'banknote' },
    credit: { label: 'Credit Card', icon: 'credit-card' },
    debit: { label: 'Debit Card', icon: 'credit-card' },
    upi: { label: 'UPI', icon: 'smartphone' },
    other: { label: 'Other', icon: 'wallet' }
}

export const CURRENCIES = {
    USD: { symbol: '$', label: 'US Dollar' },
    EUR: { symbol: '€', label: 'Euro' },
    GBP: { symbol: '£', label: 'British Pound' },
    INR: { symbol: '₹', label: 'Indian Rupee' },
    JPY: { symbol: '¥', label: 'Japanese Yen' },
    CAD: { symbol: 'C$', label: 'Canadian Dollar' },
    AUD: { symbol: 'A$', label: 'Australian Dollar' }
}

export const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]
