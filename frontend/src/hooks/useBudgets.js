import { useState, useEffect, useCallback } from 'react'
import budgetService from '../services/budgetService'
import { useToast } from '../context/ToastContext'
import { getCurrentPeriod } from '../utils/formatters'

export const useBudgets = (initialMonth, initialYear) => {
    const { month: currentMonth, year: currentYear } = getCurrentPeriod()
    const [budgets, setBudgets] = useState([])
    const [summary, setSummary] = useState(null)
    const [alerts, setAlerts] = useState({ overBudget: [], nearLimit: [] })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [month, setMonth] = useState(initialMonth || currentMonth)
    const [year, setYear] = useState(initialYear || currentYear)
    const toast = useToast()

    const fetchBudgetStatus = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await budgetService.getStatus({ month, year })
            setBudgets(response.data.budgets)
            setSummary(response.data.summary)
            setAlerts(response.data.alerts)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [month, year])

    useEffect(() => {
        fetchBudgetStatus()
    }, [fetchBudgetStatus])

    const createBudget = async (data) => {
        try {
            const response = await budgetService.create({ ...data, month, year })
            toast.success('Budget saved successfully!')
            fetchBudgetStatus()
            return response.data
        } catch (err) {
            toast.error(err.message)
            throw err
        }
    }

    const updateBudget = async (id, data) => {
        try {
            const response = await budgetService.update(id, data)
            toast.success('Budget updated successfully!')
            fetchBudgetStatus()
            return response.data
        } catch (err) {
            toast.error(err.message)
            throw err
        }
    }

    const deleteBudget = async (id) => {
        try {
            await budgetService.delete(id)
            toast.success('Budget deleted successfully!')
            fetchBudgetStatus()
        } catch (err) {
            toast.error(err.message)
            throw err
        }
    }

    const copyFromPrevious = async () => {
        try {
            await budgetService.copyFromPrevious(month, year)
            toast.success('Budgets copied from previous month!')
            fetchBudgetStatus()
        } catch (err) {
            toast.error(err.message)
            throw err
        }
    }

    const changePeriod = (newMonth, newYear) => {
        setMonth(newMonth)
        setYear(newYear)
    }

    return {
        budgets,
        summary,
        alerts,
        loading,
        error,
        month,
        year,
        changePeriod,
        refresh: fetchBudgetStatus,
        createBudget,
        updateBudget,
        deleteBudget,
        copyFromPrevious
    }
}
