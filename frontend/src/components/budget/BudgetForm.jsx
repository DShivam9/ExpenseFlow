import { useState, useEffect } from 'react'
import Modal from '../common/Modal'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import { CATEGORIES } from '../../utils/constants'

const BudgetForm = ({ isOpen, onClose, onSubmit, budget = null, existingCategories = [] }) => {
    const [formData, setFormData] = useState({
        category: '',
        limit: '',
        alertThreshold: '80',
        notes: ''
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const isEditing = !!budget

    // Populate form when editing
    useEffect(() => {
        if (budget) {
            setFormData({
                category: budget.category,
                limit: budget.limit.toString(),
                alertThreshold: (budget.alertThreshold || 80).toString(),
                notes: budget.notes || ''
            })
        } else {
            // Reset form
            setFormData({
                category: '',
                limit: '',
                alertThreshold: '80',
                notes: ''
            })
        }
        setErrors({})
    }, [budget, isOpen])

    // Filter out already used categories when creating new budget
    const availableCategories = Object.entries(CATEGORIES)
        .filter(([key]) => key !== 'total')
        .filter(([key]) => isEditing || !existingCategories.includes(key))
        .map(([value, { label }]) => ({ value, label }))

    const validate = () => {
        const newErrors = {}

        if (!formData.category) {
            newErrors.category = 'Please select a category'
        }
        if (!formData.limit || parseFloat(formData.limit) <= 0) {
            newErrors.limit = 'Please enter a valid budget limit'
        }
        if (formData.alertThreshold &&
            (parseFloat(formData.alertThreshold) < 50 || parseFloat(formData.alertThreshold) > 100)) {
            newErrors.alertThreshold = 'Alert threshold must be between 50% and 100%'
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
                limit: parseFloat(formData.limit),
                alertThreshold: parseInt(formData.alertThreshold, 10)
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
            title={isEditing ? 'Edit Budget' : 'Create Budget'}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Category */}
                <Select
                    label="Category"
                    value={formData.category}
                    onChange={handleChange('category')}
                    options={availableCategories}
                    placeholder="Select category"
                    error={errors.category}
                    disabled={isEditing}
                />

                {/* Budget Limit */}
                <Input
                    label="Budget Limit"
                    type="number"
                    step="1"
                    placeholder="Enter monthly budget"
                    value={formData.limit}
                    onChange={handleChange('limit')}
                    error={errors.limit}
                />

                {/* Alert Threshold */}
                <div>
                    <label className="label">Alert Threshold (%)</label>
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min="50"
                            max="100"
                            step="5"
                            value={formData.alertThreshold}
                            onChange={handleChange('alertThreshold')}
                            className="flex-1 h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                        [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
                        [&::-webkit-slider-thumb]:bg-primary-500"
                        />
                        <span className="w-12 text-center text-white font-medium">
                            {formData.alertThreshold}%
                        </span>
                    </div>
                    <p className="text-xs text-dark-400 mt-1">
                        Get warned when spending reaches this percentage
                    </p>
                    {errors.alertThreshold && (
                        <p className="text-xs text-red-400 mt-1">{errors.alertThreshold}</p>
                    )}
                </div>

                {/* Notes (optional) */}
                <div>
                    <label className="label">Notes (Optional)</label>
                    <textarea
                        value={formData.notes}
                        onChange={handleChange('notes')}
                        placeholder="Any notes about this budget..."
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
                        {isEditing ? 'Update' : 'Create'} Budget
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default BudgetForm
