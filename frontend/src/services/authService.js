import api from './api'

const authService = {
    register: async (name, email, password) => {
        const response = await api.post('/auth/register', { name, email, password })
        return response.data
    },

    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password })
        return response.data
    },

    getMe: async () => {
        const response = await api.get('/auth/me')
        return response.data
    },

    updateProfile: async (data) => {
        const response = await api.put('/auth/profile', data)
        return response.data
    },

    updatePassword: async (currentPassword, newPassword) => {
        const response = await api.put('/auth/password', { currentPassword, newPassword })
        return response.data
    }
}

export default authService
