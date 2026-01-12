import { useState, useEffect } from 'react'
import Modal from '../common/Modal'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import { CATEGORIES, PAYMENT_METHODS } from '../../utils/constants'
import { formatDate } from '../../utils/formatters'

const ExpenseForm = ({ isOpen, onClose, onSubmit, expense = null }) => {
    const [formData, setFormData] = useState({
        amount: '',
        category: '',
        description: '',
        date: formatDate(new Date(), 'iso'),
        paymentMethod: 'cash',
        notes: ''
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const isEditing = !!expense

    // Populate form when editing
    useEffect(() => {
        if (expense) {
            setFormData({
                amount: expense.amount.toString(),
                category: expense.category,
                description: expense.description,
                date: formatDate(expense.date, 'iso'),
                paymentMethod: expense.paymentMethod || 'cash',
                notes: expense.notes || ''
            })
        } else {
            // Reset form
            setFormData({
                amount: '',
                category: '',
                description: '',
                date: formatDate(new Date(), 'iso'),
                paymentMethod: 'cash',
                notes: ''
            })
        }
        setErrors({})
    }, [expense, isOpen])

    const categoryOptions = Object.entries(CATEGORIES)
        .filter(([key]) => key !== 'total')
        .map(([value, { label }]) => ({ value, label }))

    const paymentOptions = Object.entries(PAYMENT_METHODS)
        .map(([value, { label }]) => ({ value, label }))

    const validate = () => {
        const newErrors = {}

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            newErrors.amount = 'Please enter a valid amount'
        }
        if (!formData.category) {
            newErrors.category = 'Please select a category'
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Please enter a description'
        }
        if (!formData.date) {
            newErrors.date = 'Please select a date'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validate()) return

        setLoading(true)
        try {
            await onSubmit({
                ...formData,
                amount: parseFloat(formData.amount)
            })
            onClose()
        } catch (error) {
            // Error is handled by the hook
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? 'Edit Expense' : 'Add New Expense'}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Amount */}
                <Input
                    label="Amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={handleChange('amount')}
                    error={errors.amount}
                />

                {/* Category */}
                <Select
                    label="Category"
                    value={formData.category}
                    onChange={handleChange('category')}
                    options={categoryOptions}
                    placeholder="Select category"
                    error={errors.category}
                />

                {/* Description */}
                <Input
                    label="Description"
                    placeholder="What was this expense for?"
                    value={formData.description}
                    onChange={handleChange('description')}
                    error={errors.description}
                />

                {/* Date and Payment Method */}
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange('date')}
                        error={errors.date}
                    />
                    <Select
                        label="Payment Method"
                        value={formData.paymentMethod}
                        onChange={handleChange('paymentMethod')}
                        options={paymentOptions}
                    />
                </div>

                {/* Notes (optional) */}
                <div>
                    <label className="label">Notes (Optional)</label>
                    <textarea
                        value={formData.notes}
                        onChange={handleChange('notes')}
                        placeholder="Any additional details..."
                        className="input min-h-[80px] resize-none"
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        loading={loading}
                        className="flex-1"
                    >
                        {isEditing ? 'Update' : 'Add'} Expense
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default ExpenseForm
