import { createContext, useState, useEffect, useContext } from 'react'
import { mockUser, delay } from '../utils/mockData'

const AuthContext = createContext(null)

// Set to true to use mock data (no backend required)
const USE_MOCK_DATA = true

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token')
            if (token) {
                if (USE_MOCK_DATA) {
                    // Use mock user for development - no delay on auth check for instant reload
                    setUser(mockUser)
                } else {
                    // Real API call
                    const { default: authService } = await import('../services/authService')
                    const response = await authService.getCurrentUser()
                    setUser(response.data)
                }
            }
        } catch (error) {
            console.error('Auth check failed:', error)
            localStorage.removeItem('token')
        } finally {
            setLoading(false)
        }
    }

    const login = async (email, password) => {
        if (USE_MOCK_DATA) {
            // Mock login - accept any credentials
            await delay(800)
            localStorage.setItem('token', 'mock-jwt-token')
            setUser(mockUser)
            return { success: true }
        } else {
            const { default: authService } = await import('../services/authService')
            const response = await authService.login(email, password)
            localStorage.setItem('token', response.token)
            setUser(response.data)
            return response
        }
    }

    const register = async (name, email, password) => {
        if (USE_MOCK_DATA) {
            // Mock register
            await delay(800)
            const newUser = { ...mockUser, name, email }
            localStorage.setItem('token', 'mock-jwt-token')
            setUser(newUser)
            return { success: true }
        } else {
            const { default: authService } = await import('../services/authService')
            const response = await authService.register(name, email, password)
            localStorage.setItem('token', response.token)
            setUser(response.data)
            return response
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    const updateUser = (updatedData) => {
        setUser(prev => ({ ...prev, ...updatedData }))
    }

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            updateUser,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export default AuthContext
