const express = require('express');
const router = express.Router();
const {
    getBudgets,
    getBudgetStatus,
    createBudget,
    updateBudget,
    deleteBudget,
    copyFromPreviousMonth
} = require('../controllers/budgetController');
const { protect } = require('../middleware/auth');
const { validate, budgetRules, objectIdRule } = require('../middleware/validate');

// All routes are protected
router.use(protect);

// Special routes
router.get('/status', getBudgetStatus);
router.post('/copy', copyFromPreviousMonth);

// CRUD routes
router.route('/')
    .get(getBudgets)
    .post(budgetRules, validate, createBudget);

router.route('/:id')
    .put(objectIdRule('id'), validate, updateBudget)
    .delete(objectIdRule('id'), validate, deleteBudget);

module.exports = router;
