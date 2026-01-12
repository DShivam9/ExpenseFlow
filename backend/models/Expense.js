const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'Please provide an amount'],
        min: [0.01, 'Amount must be greater than 0']
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
            'other'
        ]
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        trim: true,
        maxlength: [200, 'Description cannot be more than 200 characters']
    },
    date: {
        type: Date,
        required: [true, 'Please provide a date'],
        default: Date.now
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'credit', 'debit', 'upi', 'other'],
        default: 'cash'
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [500, 'Notes cannot be more than 500 characters']
    },
    isRecurring: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for faster queries
expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, category: 1 });

// Static method to get category totals for a user
expenseSchema.statics.getCategoryTotals = async function (userId, startDate, endDate) {
    return this.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId),
                date: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: '$category',
                total: { $sum: '$amount' },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { total: -1 }
        }
    ]);
};

// Static method to get monthly totals
expenseSchema.statics.getMonthlyTotals = async function (userId, year) {
    return this.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId),
                date: {
                    $gte: new Date(year, 0, 1),
                    $lte: new Date(year, 11, 31)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$date' },
                total: { $sum: '$amount' },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);
};

module.exports = mongoose.model('Expense', expenseSchema);
