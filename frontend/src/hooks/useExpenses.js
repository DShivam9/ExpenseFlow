import { useState, useEffect, useCallback } from 'react'
import expenseService from '../services/expenseService'
import { useToast } from '../context/ToastContext'

export const useExpenses = (initialParams = {}) => {
    const [expenses, setExpenses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 0,
        currentPage: 1
    })
    const [params, setParams] = useState(initialParams)
    const toast = useToast()

    const fetchExpenses = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await expenseService.getAll(params)
            setExpenses(response.data)
            setPagination({
                total: response.total,
                totalPages: response.totalPages,
                currentPage: response.currentPage
            })
        } catch (err) {
            setError(err.message)
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }, [params, toast])

    useEffect(() => {
        fetchExpenses()
    }, [fetchExpenses])

    const createExpense = async (data) => {
        try {
            const response = await expenseService.create(data)
            toast.success('Expense added successfully!')
            fetchExpenses()
            return response.data
        } catch (err) {
            toast.error(err.message)
            throw err
        }
    }

    const updateExpense = async (id, data) => {
        try {
            const response = await expenseService.update(id, data)
            toast.success('Expense updated successfully!')
            fetchExpenses()
            return response.data
        } catch (err) {
            toast.error(err.message)
            throw err
        }
    }

    const deleteExpense = async (id) => {
        try {
            await expenseService.delete(id)
            toast.success('Expense deleted successfully!')
            fetchExpenses()
        } catch (err) {
            toast.error(err.message)
            throw err
        }
    }

    const updateParams = (newParams) => {
        setParams(prev => ({ ...prev, ...newParams }))
    }

    return {
        expenses,
        loading,
        error,
        pagination,
        params,
        setParams: updateParams,
        refresh: fetchExpenses,
        createExpense,
        updateExpense,
        deleteExpense
    }
}
