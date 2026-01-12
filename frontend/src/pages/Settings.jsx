import { useState } from 'react'
import { User, Lock, DollarSign, Bell, Trash2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../context/ToastContext'
import authService from '../services/authService'
import Card from '../components/common/Card'
import Input from '../components/common/Input'
import Select from '../components/common/Select'
import Button from '../components/common/Button'
import { CURRENCIES } from '../utils/constants'

const Settings = () => {
    const { user, updateUser, logout } = useAuth()
    const toast = useToast()

    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        currency: user?.currency || 'USD'
    })

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const [loadingProfile, setLoadingProfile] = useState(false)
    const [loadingPassword, setLoadingPassword] = useState(false)

    const currencyOptions = Object.entries(CURRENCIES).map(([value, { label, symbol }]) => ({
        value,
        label: `${symbol} ${label}`
    }))

    const handleProfileSubmit = async (e) => {
        e.preventDefault()
        setLoadingProfile(true)

        try {
            const response = await authService.updateProfile(profileData)
            updateUser(response.data)
            toast.success('Profile updated successfully!')
        } catch (error) {
            toast.error(error.message || 'Failed to update profile')
        } finally {
            setLoadingProfile(false)
        }
    }

    const handlePasswordSubmit = async (e) => {
        e.preventDefault()

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }

        setLoadingPassword(true)

        try {
            await authService.updatePassword(passwordData.currentPassword, passwordData.newPassword)
            toast.success('Password updated successfully!')
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        } catch (error) {
            toast.error(error.message || 'Failed to update password')
        } finally {
            setLoadingPassword(false)
        }
    }

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            toast.info('Account deletion is not implemented in this demo')
        }
    }

    return (
        <div className="page-container">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Profile Section */}
                <Card>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Profile Settings</h2>
                            <p className="text-sm text-dark-400">Manage your account details</p>
                        </div>
                    </div>

                    <form onSubmit={handleProfileSubmit} className="space-y-5">
                        <Input
                            label="Full Name"
                            value={profileData.name}
                            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter your name"
                        />

                        <div>
                            <label className="label">Email</label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="input opacity-50 cursor-not-allowed"
                            />
                            <p className="text-xs text-dark-400 mt-1">Email cannot be changed</p>
                        </div>

                        <Select
                            label="Currency"
                            value={profileData.currency}
                            onChange={(e) => setProfileData(prev => ({ ...prev, currency: e.target.value }))}
                            options={currencyOptions}
                        />

                        <Button type="submit" loading={loadingProfile}>
                            Save Changes
                        </Button>
                    </form>
                </Card>

                {/* Password Section */}
                <Card>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-secondary-500/20 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-secondary-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Change Password</h2>
                            <p className="text-sm text-dark-400">Update your password</p>
                        </div>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-5">
                        <Input
                            label="Current Password"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            placeholder="Enter current password"
                        />

                        <Input
                            label="New Password"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                            placeholder="Enter new password"
                        />

                        <Input
                            label="Confirm New Password"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            placeholder="Confirm new password"
                        />

                        <Button type="submit" loading={loadingPassword}>
                            Update Password
                        </Button>
                    </form>
                </Card>

                {/* Danger Zone */}
                <Card className="border-red-500/30">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                            <Trash2 className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Danger Zone</h2>
                            <p className="text-sm text-dark-400">Irreversible actions</p>
                        </div>
                    </div>

                    <p className="text-sm text-dark-300 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                    </p>

                    <Button variant="danger" onClick={handleDeleteAccount}>
                        Delete Account
                    </Button>
                </Card>
            </div>
        </div>
    )
}

export default Settings
