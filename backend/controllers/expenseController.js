const Expense = require('../models/Expense');

// @desc    Get all expenses for user
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res, next) => {
    try {
        const {
            category,
            startDate,
            endDate,
            minAmount,
            maxAmount,
            search,
            sort = '-date',
            page = 1,
            limit = 20
        } = req.query;

        // Build query
        const query = { user: req.user.id };

        // Category filter
        if (category) {
            query.category = category;
        }

        // Date range filter
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        // Amount range filter
        if (minAmount || maxAmount) {
            query.amount = {};
            if (minAmount) query.amount.$gte = parseFloat(minAmount);
            if (maxAmount) query.amount.$lte = parseFloat(maxAmount);
        }

        // Search in description
        if (search) {
            query.description = { $regex: search, $options: 'i' };
        }

        // Pagination
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;

        // Execute query
        const [expenses, total] = await Promise.all([
            Expense.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limitNum)
                .lean(),
            Expense.countDocuments(query)
        ]);

        res.status(200).json({
            success: true,
            count: expenses.length,
            total,
            totalPages: Math.ceil(total / limitNum),
            currentPage: pageNum,
            data: expenses
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
const getExpense = async (req, res, next) => {
    try {
        const expense = await Expense.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
        }

        res.status(200).json({
            success: true,
            data: expense
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create expense
// @route   POST /api/expenses
// @access  Private
const createExpense = async (req, res, next) => {
    try {
        const expenseData = {
            ...req.body,
            user: req.user.id
        };

        const expense = await Expense.create(expenseData);

        res.status(201).json({
            success: true,
            data: expense
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res, next) => {
    try {
        let expense = await Expense.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
        }

        expense = await Expense.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: expense
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res, next) => {
    try {
        const expense = await Expense.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
        }

        await expense.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get expense statistics
// @route   GET /api/expenses/stats
// @access  Private
const getExpenseStats = async (req, res, next) => {
    try {
        const { month, year } = req.query;

        const currentDate = new Date();
        const targetYear = year ? parseInt(year, 10) : currentDate.getFullYear();
        const targetMonth = month ? parseInt(month, 10) : currentDate.getMonth() + 1;

        // Current month date range
        const startOfMonth = new Date(targetYear, targetMonth - 1, 1);
        const endOfMonth = new Date(targetYear, targetMonth, 0, 23, 59, 59);

        // Previous month date range
        const startOfPrevMonth = new Date(targetYear, targetMonth - 2, 1);
        const endOfPrevMonth = new Date(targetYear, targetMonth - 1, 0, 23, 59, 59);

        // Get current month stats
        const [categoryTotals, monthlyTotals, currentMonthTotal, prevMonthTotal, recentExpenses] = await Promise.all([
            // Category breakdown for current month
            Expense.getCategoryTotals(req.user.id, startOfMonth, endOfMonth),

            // Monthly totals for the year
            Expense.getMonthlyTotals(req.user.id, targetYear),

            // Current month total
            Expense.aggregate([
                {
                    $match: {
                        user: req.user._id,
                        date: { $gte: startOfMonth, $lte: endOfMonth }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$amount' },
                        count: { $sum: 1 },
                        avgExpense: { $avg: '$amount' }
                    }
                }
            ]),

            // Previous month total for comparison
            Expense.aggregate([
                {
                    $match: {
                        user: req.user._id,
                        date: { $gte: startOfPrevMonth, $lte: endOfPrevMonth }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$amount' }
                    }
                }
            ]),

            // Recent expenses
            Expense.find({ user: req.user.id })
                .sort('-date')
                .limit(5)
                .lean()
        ]);

        // Calculate month-over-month change
        const currentTotal = currentMonthTotal[0]?.total || 0;
        const prevTotal = prevMonthTotal[0]?.total || 0;
        const percentChange = prevTotal > 0
            ? ((currentTotal - prevTotal) / prevTotal) * 100
            : 0;

        // Daily average for current month
        const daysInMonth = endOfMonth.getDate();
        const daysPassed = Math.min(currentDate.getDate(), daysInMonth);
        const dailyAverage = daysPassed > 0 ? currentTotal / daysPassed : 0;

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalSpent: currentTotal,
                    transactionCount: currentMonthTotal[0]?.count || 0,
                    avgExpense: currentMonthTotal[0]?.avgExpense || 0,
                    dailyAverage,
                    monthOverMonth: {
                        amount: currentTotal - prevTotal,
                        percentage: Math.round(percentChange * 100) / 100
                    }
                },
                categoryBreakdown: categoryTotals,
                monthlyTrend: monthlyTotals,
                recentExpenses,
                period: {
                    month: targetMonth,
                    year: targetYear
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getExpenses,
    getExpense,
    createExpense,
    updateExpense,
    deleteExpense,
    getExpenseStats
};
