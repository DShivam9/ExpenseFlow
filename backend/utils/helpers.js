// Category configuration with colors and icons
const CATEGORIES = {
    food: { label: 'Food & Dining', color: '#F59E0B', icon: 'utensils' },
    transportation: { label: 'Transportation', color: '#3B82F6', icon: 'car' },
    entertainment: { label: 'Entertainment', color: '#8B5CF6', icon: 'film' },
    shopping: { label: 'Shopping', color: '#EC4899', icon: 'shopping-bag' },
    utilities: { label: 'Utilities', color: '#6366F1', icon: 'zap' },
    healthcare: { label: 'Healthcare', color: '#EF4444', icon: 'heart' },
    education: { label: 'Education', color: '#14B8A6', icon: 'book' },
    travel: { label: 'Travel', color: '#F97316', icon: 'plane' },
    subscriptions: { label: 'Subscriptions', color: '#06B6D4', icon: 'repeat' },
    groceries: { label: 'Groceries', color: '#22C55E', icon: 'shopping-cart' },
    rent: { label: 'Rent', color: '#A855F7', icon: 'home' },
    other: { label: 'Other', color: '#6B7280', icon: 'more-horizontal' },
    total: { label: 'Total Budget', color: '#8B5CF6', icon: 'wallet' }
};

// Format currency
const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency
    }).format(amount);
};

// Format date
const formatDate = (date, format = 'short') => {
    const options = format === 'short'
        ? { month: 'short', day: 'numeric' }
        : { year: 'numeric', month: 'long', day: 'numeric' };

    return new Date(date).toLocaleDateString('en-US', options);
};

// Get month name
const getMonthName = (month) => {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
};

module.exports = {
    CATEGORIES,
    formatCurrency,
    formatDate,
    getMonthName
};
