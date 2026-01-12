const Budget = require('../models/Budget');

// @desc    Get all budgets for user
// @route   GET /api/budgets
// @access  Private
const getBudgets = async (req, res, next) => {
    try {
        const { month, year } = req.query;

        const currentDate = new Date();
        const targetMonth = month ? parseInt(month, 10) : currentDate.getMonth() + 1;
        const targetYear = year ? parseInt(year, 10) : currentDate.getFullYear();

        const budgets = await Budget.find({
            user: req.user.id,
            month: targetMonth,
            year: targetYear
        }).lean();

        res.status(200).json({
            success: true,
            count: budgets.length,
            data: budgets
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get budget status with spending
// @route   GET /api/budgets/status
// @access  Private
const getBudgetStatus = async (req, res, next) => {
    try {
        const { month, year } = req.query;

        const currentDate = new Date();
        const targetMonth = month ? parseInt(month, 10) : currentDate.getMonth() + 1;
        const targetYear = year ? parseInt(year, 10) : currentDate.getFullYear();

        const budgetStatus = await Budget.getBudgetStatus(
            req.user.id,
            targetMonth,
            targetYear
        );

        // Calculate overall stats
        const totalBudget = budgetStatus
            .filter(b => b.category !== 'total')
            .reduce((sum, b) => sum + b.limit, 0);

        const totalSpent = budgetStatus
            .filter(b => b.category !== 'total')
            .reduce((sum, b) => sum + b.spent, 0);

        const overBudgetCategories = budgetStatus.filter(b => b.isOverBudget);
        const nearLimitCategories = budgetStatus.filter(b => b.isNearLimit);

        res.status(200).json({
            success: true,
            data: {
                budgets: budgetStatus,
                summary: {
                    totalBudget,
                    totalSpent,
                    totalRemaining: totalBudget - totalSpent,
                    overallPercentage: totalBudget > 0
                        ? Math.round((totalSpent / totalBudget) * 10000) / 100
                        : 0,
                    overBudgetCount: overBudgetCategories.length,
                    nearLimitCount: nearLimitCategories.length
                },
                alerts: {
                    overBudget: overBudgetCategories.map(b => ({
                        category: b.category,
                        overspent: b.spent - b.limit
                    })),
                    nearLimit: nearLimitCategories.map(b => ({
                        category: b.category,
                        percentage: b.percentage
                    }))
                },
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

// @desc    Create or update budget
// @route   POST /api/budgets
// @access  Private
const createBudget = async (req, res, next) => {
    try {
        const { category, limit, month, year, alertThreshold, notes } = req.body;

        // Try to find existing budget for this category/month/year
        let budget = await Budget.findOne({
            user: req.user.id,
            category,
            month,
            year
        });

        if (budget) {
            // Update existing budget
            budget.limit = limit;
            if (alertThreshold) budget.alertThreshold = alertThreshold;
            if (notes !== undefined) budget.notes = notes;
            await budget.save();
        } else {
            // Create new budget
            budget = await Budget.create({
                user: req.user.id,
                category,
                limit,
                month,
                year,
                alertThreshold: alertThreshold || 80,
                notes
            });
        }

        res.status(201).json({
            success: true,
            data: budget
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private
const updateBudget = async (req, res, next) => {
    try {
        let budget = await Budget.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: 'Budget not found'
            });
        }

        const { limit, alertThreshold, notes } = req.body;

        budget = await Budget.findByIdAndUpdate(
            req.params.id,
            { limit, alertThreshold, notes },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: budget
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = async (req, res, next) => {
    try {
        const budget = await Budget.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: 'Budget not found'
            });
        }

        await budget.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Copy budgets from previous month
// @route   POST /api/budgets/copy
// @access  Private
const copyFromPreviousMonth = async (req, res, next) => {
    try {
        const { month, year } = req.body;

        // Calculate previous month
        let prevMonth = month - 1;
        let prevYear = year;
        if (prevMonth < 1) {
            prevMonth = 12;
            prevYear = year - 1;
        }

        // Get previous month's budgets
        const prevBudgets = await Budget.find({
            user: req.user.id,
            month: prevMonth,
            year: prevYear
        }).lean();

        if (prevBudgets.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No budgets found for previous month'
            });
        }

        // Create new budgets for current month
        const newBudgets = await Promise.all(
            prevBudgets.map(async (budget) => {
                // Check if budget already exists for this month
                const existing = await Budget.findOne({
                    user: req.user.id,
                    category: budget.category,
                    month,
                    year
                });

                if (existing) return existing;

                return Budget.create({
                    user: req.user.id,
                    category: budget.category,
                    limit: budget.limit,
                    month,
                    year,
                    alertThreshold: budget.alertThreshold
                });
            })
        );

        res.status(201).json({
            success: true,
            count: newBudgets.length,
            data: newBudgets
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getBudgets,
    getBudgetStatus,
    createBudget,
    updateBudget,
    deleteBudget,
    copyFromPreviousMonth
};
