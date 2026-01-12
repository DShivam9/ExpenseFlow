const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: [true, 'Please provide a category'],
        enum: [
            'food',
            'transportation',
            'entertainment',
            'shopping',
            'utilities',
            'healthcare',
            'education',
            'travel',
            'subscriptions',
            'groceries',
            'rent',
            'other',
            'total' // For overall monthly budget
        ]
    },
    limit: {
        type: Number,
        required: [true, 'Please provide a budget limit'],
        min: [1, 'Budget limit must be at least 1']
    },
    month: {
        type: Number,
        required: [true, 'Please provide a month'],
        min: 1,
        max: 12
    },
    year: {
        type: Number,
        required: [true, 'Please provide a year'],
        min: 2020,
        max: 2100
    },
    alertThreshold: {
        type: Number,
        default: 80, // Alert when 80% of budget is used
        min: 50,
        max: 100
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [200, 'Notes cannot be more than 200 characters']
    }
}, {
    timestamps: true
});

// Compound unique index - one budget per category per month per user
budgetSchema.index({ user: 1, category: 1, month: 1, year: 1 }, { unique: true });

// Static method to get budget status with actual spending
budgetSchema.statics.getBudgetStatus = async function (userId, month, year) {
    const Expense = mongoose.model('Expense');

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Get all budgets for the month
    const budgets = await this.find({ user: userId, month, year }).lean();

    // Get category totals for the month
    const categoryTotals = await Expense.getCategoryTotals(userId, startDate, endDate);

    // Create a map of category spending
    const spendingMap = {};
    categoryTotals.forEach(item => {
        spendingMap[item._id] = item.total;
    });

    // Calculate total spending
    const totalSpent = categoryTotals.reduce((sum, item) => sum + item.total, 0);

    // Combine budget and spending data
    return budgets.map(budget => {
        const spent = budget.category === 'total'
            ? totalSpent
            : (spendingMap[budget.category] || 0);
        const percentage = (spent / budget.limit) * 100;

        return {
            ...budget,
            spent,
            remaining: budget.limit - spent,
            percentage: Math.round(percentage * 100) / 100,
            isOverBudget: spent > budget.limit,
            isNearLimit: percentage >= budget.alertThreshold && percentage < 100
        };
    });
};

module.exports = mongoose.model('Budget', budgetSchema);
