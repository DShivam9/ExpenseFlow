const express = require('express');
const router = express.Router();
const {
    getExpenses,
    getExpense,
    createExpense,
    updateExpense,
    deleteExpense,
    getExpenseStats
} = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');
const { validate, expenseRules, objectIdRule } = require('../middleware/validate');

// All routes are protected
router.use(protect);

// Stats route (must come before /:id route)
router.get('/stats', getExpenseStats);

// CRUD routes
router.route('/')
    .get(getExpenses)
    .post(expenseRules, validate, createExpense);

router.route('/:id')
    .get(objectIdRule('id'), validate, getExpense)
    .put(objectIdRule('id'), expenseRules, validate, updateExpense)
    .delete(objectIdRule('id'), validate, deleteExpense);

module.exports = router;
