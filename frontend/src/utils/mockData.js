// Mock data for frontend development
// This allows UI development without backend connection

export const mockUser = {
    _id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    currency: 'USD',
    createdAt: new Date().toISOString()
}

export const mockExpenses = [
    {
        _id: '1',
        amount: 85.50,
        category: 'food',
        description: 'Dinner at Italian Restaurant',
        date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        paymentMethod: 'credit_card',
        notes: 'Anniversary dinner'
    },
    {
        _id: '2',
        amount: 45.00,
        category: 'transportation',
        description: 'Uber rides this week',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        paymentMethod: 'debit_card'
    },
    {
        _id: '3',
        amount: 129.99,
        category: 'shopping',
        description: 'New running shoes',
        date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        paymentMethod: 'credit_card'
    },
    {
        _id: '4',
        amount: 12.99,
        category: 'subscriptions',
        description: 'Netflix monthly',
        date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
        paymentMethod: 'credit_card'
    },
    {
        _id: '5',
        amount: 250.00,
        category: 'utilities',
        description: 'Electricity bill',
        date: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
        paymentMethod: 'bank_transfer'
    },
    {
        _id: '6',
        amount: 35.50,
        category: 'groceries',
        description: 'Weekly groceries',
        date: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
        paymentMethod: 'debit_card'
    },
    {
        _id: '7',
        amount: 75.00,
        category: 'entertainment',
        description: 'Concert tickets',
        date: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(),
        paymentMethod: 'credit_card'
    },
    {
        _id: '8',
        amount: 150.00,
        category: 'healthcare',
        description: 'Doctor visit copay',
        date: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(),
        paymentMethod: 'debit_card'
    }
]

export const mockBudgets = [
    {
        _id: '1',
        category: 'food',
        limit: 500,
        spent: 385.50,
        remaining: 114.50,
        percentage: 77.1,
        isOverBudget: false,
        isNearLimit: true,
        alertThreshold: 80
    },
    {
        _id: '2',
        category: 'transportation',
        limit: 200,
        spent: 145.00,
        remaining: 55.00,
        percentage: 72.5,
        isOverBudget: false,
        isNearLimit: false,
        alertThreshold: 80
    },
    {
        _id: '3',
        category: 'shopping',
        limit: 300,
        spent: 329.99,
        remaining: -29.99,
        percentage: 110,
        isOverBudget: true,
        isNearLimit: false,
        alertThreshold: 80
    },
    {
        _id: '4',
        category: 'entertainment',
        limit: 150,
        spent: 75.00,
        remaining: 75.00,
        percentage: 50,
        isOverBudget: false,
        isNearLimit: false,
        alertThreshold: 80
    },
    {
        _id: '5',
        category: 'utilities',
        limit: 300,
        spent: 250.00,
        remaining: 50.00,
        percentage: 83.3,
        isOverBudget: false,
        isNearLimit: true,
        alertThreshold: 80
    },
    {
        _id: '6',
        category: 'groceries',
        limit: 400,
        spent: 285.50,
        remaining: 114.50,
        percentage: 71.4,
        isOverBudget: false,
        isNearLimit: false,
        alertThreshold: 80
    }
    // ... preexisting mockBudgets code ...
]

export const mockStats = {
    summary: {
        totalSpent: 2847.50,
        transactionCount: 47,
        avgExpense: 60.58,
        dailyAverage: 94.92,
        monthOverMonth: {
            amount: -234.50,
            percentage: -7.6
        }
    },
    upcomingSubscriptions: [
        { _id: '1', name: 'Netflix Premium', amount: 19.99, date: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(), icon: 'netflix' },
        { _id: '2', name: 'Spotify Duo', amount: 14.99, date: new Date(Date.now() + 1000 * 60 * 60 * 128).toISOString(), icon: 'spotify' },
        { _id: '3', name: 'Claude Pro', amount: 20.00, date: new Date(Date.now() + 1000 * 60 * 60 * 192).toISOString(), icon: 'claude' },
        { _id: '4', name: 'AWS Route53', amount: 3.50, date: new Date(Date.now() + 1000 * 60 * 60 * 240).toISOString(), icon: 'aws' }
    ],
    categoryBreakdown: [
        { _id: 'food', total: 685.50, count: 12 },
        { _id: 'shopping', total: 529.99, count: 8 },
        { _id: 'transportation', total: 345.00, count: 15 },
        { _id: 'utilities', total: 450.00, count: 4 },
        { _id: 'entertainment', total: 275.00, count: 5 },
        { _id: 'subscriptions', total: 62.01, count: 3 }
    ],
    monthlyTrend: [
        { _id: 7, total: 2150.00, count: 35 },
        { _id: 8, total: 2450.00, count: 42 },
        { _id: 9, total: 1980.00, count: 38 },
        { _id: 10, total: 2680.00, count: 45 },
        { _id: 11, total: 3082.00, count: 52 },
        { _id: 12, total: 2847.50, count: 47 }
    ],
    recentExpenses: [
        {
            _id: '1',
            amount: 85.50,
            category: 'food',
            description: 'Dinner at Italian Restaurant',
            date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
        },
        {
            _id: '2',
            amount: 45.00,
            category: 'transportation',
            description: 'Uber rides',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
        },
        {
            _id: '3',
            amount: 129.99,
            category: 'shopping',
            description: 'New running shoes',
            date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
        },
        {
            _id: '4',
            amount: 12.99,
            category: 'subscriptions',
            description: 'Netflix monthly',
            date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString()
        },
        {
            _id: '5',
            amount: 250.00,
            category: 'utilities',
            description: 'Electricity bill',
            date: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString()
        }
    ]
}

export const mockBudgetSummary = {
    totalBudget: 1850,
    totalSpent: 1470.99,
    totalRemaining: 379.01,
    budgetCount: 6
}

// Financial Health Score mock data
export const mockHealthScore = {
    score: 76,
    trend: +5,
    breakdown: {
        budgetAdherence: 82,
        savingsRate: 68,
        spendingStability: 78
    },
    lastUpdated: new Date().toISOString()
}

// Active challenges mock data
export const mockChallenges = [
    {
        _id: '1',
        title: 'Coffee Shop Challenge',
        description: 'Spend 20% less on coffee this week',
        category: 'food',
        target: 20,
        current: 14,
        unit: '%',
        reward: 50,
        daysRemaining: 3,
        isActive: true
    },
    {
        _id: '2',
        title: 'No Impulse Week',
        description: 'Avoid shopping purchases for 7 days',
        category: 'shopping',
        target: 7,
        current: 5,
        unit: 'days',
        reward: 100,
        daysRemaining: 2,
        isActive: true
    }
]

// Achievements mock data
export const mockAchievements = [
    { _id: '1', name: 'First Step', description: 'Log your first expense', icon: '🎯', tier: 'bronze', unlocked: true, unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString() },
    { _id: '2', name: 'Week Warrior', description: 'Track expenses for 7 consecutive days', icon: '🔥', tier: 'bronze', unlocked: true, unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString() },
    { _id: '3', name: 'Budget Keeper', description: 'Stay under budget for a full month', icon: '🛡️', tier: 'silver', unlocked: true, unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString() },
    { _id: '4', name: 'Savings Star', description: 'Save 20% of income for 3 months', icon: '⭐', tier: 'gold', unlocked: false },
    { _id: '5', name: 'Frugal Master', description: 'Complete 10 spending challenges', icon: '👑', tier: 'platinum', unlocked: false },
    { _id: '6', name: 'Streak Legend', description: 'Maintain a 30-day tracking streak', icon: '🏆', tier: 'gold', unlocked: false },
    { _id: '7', name: 'Category Pro', description: 'Create budgets in 5 different categories', icon: '📊', tier: 'silver', unlocked: true, unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() },
    { _id: '8', name: 'Early Bird', description: 'Log an expense before 8 AM', icon: '🌅', tier: 'bronze', unlocked: true, unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString() }
]

// Bill reminders mock data
export const mockBillReminders = [
    { _id: '1', name: 'Rent', amount: 1200, dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), category: 'housing', recurring: 'monthly', isPaid: false },
    { _id: '2', name: 'Electricity', amount: 85, dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(), category: 'utilities', recurring: 'monthly', isPaid: false },
    { _id: '3', name: 'Internet', amount: 59.99, dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), category: 'utilities', recurring: 'monthly', isPaid: false },
    { _id: '4', name: 'Phone Bill', amount: 45, dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString(), category: 'utilities', recurring: 'monthly', isPaid: false },
    { _id: '5', name: 'Gym Membership', amount: 29.99, dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString(), category: 'health', recurring: 'monthly', isPaid: false }
]

// Helper to simulate API delay
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
