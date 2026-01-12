const { validationResult, body, param, query } = require('express-validator');

// Middleware to check validation results
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// Auth validation rules
const registerRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginRules = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email'),
    body('password')
        .notEmpty().withMessage('Password is required')
];

// Expense validation rules
const expenseRules = [
    body('amount')
        .notEmpty().withMessage('Amount is required')
        .isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
    body('category')
        .notEmpty().withMessage('Category is required')
        .isIn([
            'food', 'transportation', 'entertainment', 'shopping',
            'utilities', 'healthcare', 'education', 'travel',
            'subscriptions', 'groceries', 'rent', 'other'
        ]).withMessage('Invalid category'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 200 }).withMessage('Description cannot exceed 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Invalid date format'),
    body('paymentMethod')
        .optional()
        .isIn(['cash', 'credit', 'debit', 'upi', 'other']).withMessage('Invalid payment method')
];

// Budget validation rules
const budgetRules = [
    body('category')
        .notEmpty().withMessage('Category is required')
        .isIn([
            'food', 'transportation', 'entertainment', 'shopping',
            'utilities', 'healthcare', 'education', 'travel',
            'subscriptions', 'groceries', 'rent', 'other', 'total'
        ]).withMessage('Invalid category'),
    body('limit')
        .notEmpty().withMessage('Budget limit is required')
        .isFloat({ min: 1 }).withMessage('Budget limit must be at least 1'),
    body('month')
        .notEmpty().withMessage('Month is required')
        .isInt({ min: 1, max: 12 }).withMessage('Month must be between 1 and 12'),
    body('year')
        .notEmpty().withMessage('Year is required')
        .isInt({ min: 2020, max: 2100 }).withMessage('Invalid year')
];

// MongoDB ObjectId validation
const objectIdRule = (paramName) => [
    param(paramName).isMongoId().withMessage('Invalid ID format')
];

module.exports = {
    validate,
    registerRules,
    loginRules,
    expenseRules,
    budgetRules,
    objectIdRule
};
