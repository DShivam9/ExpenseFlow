import { useState, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    LayoutDashboard,
    Receipt,
    PiggyBank,
    Settings,
    X,
    Wallet,
    LogOut,
    ChevronRight
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const navItems = [
    { path: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/app/expenses', label: 'Expenses', icon: Receipt },
    { path: '/app/budgets', label: 'Budgets', icon: PiggyBank },
    { path: '/app/settings', label: 'Settings', icon: Settings },
]

// Animated nav item component
const NavItem = ({ item, isActive, isExpanded, onClick }) => {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <NavLink
            to={item.path}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative block"
        >
            <motion.div
                className={`
                    flex items-center gap-3 px-3 py-3 rounded-xl font-medium
                    transition-colors duration-200 relative overflow-hidden
                    ${isActive
                        ? 'bg-primary-500/15 text-primary-400'
                        : 'text-dark-300 hover:text-white hover:bg-white/5'
                    }
                `}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
            >
                {/* Glow effect on hover */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-transparent pointer-events-none"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        />
                    )}
                </AnimatePresence>

                {/* Active indicator bar */}
                {isActive && (
                    <motion.div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full"
                        layoutId="activeIndicator"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )}

                <motion.div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-primary-500/20' : 'bg-white/5'
                        }`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-primary-400' : ''}`} />
                </motion.div>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                            className="whitespace-nowrap overflow-hidden"
                        >
                            {item.label}
                        </motion.span>
                    )}
                </AnimatePresence>

                {/* Tooltip when collapsed */}
                <AnimatePresence>
                    {!isExpanded && isHovered && (
                        <motion.div
                            initial={{ opacity: 0, x: 10, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 10, scale: 0.9 }}
                            className="absolute left-full ml-3 px-3 py-2 bg-surface-light rounded-lg text-sm text-white whitespace-nowrap z-50 shadow-xl border border-white/10"
                        >
                            {item.label}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-surface-light rotate-45 border-l border-b border-white/10" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </NavLink>
    )
}

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation()
    const { user, logout } = useAuth()
    const [isExpanded, setIsExpanded] = useState(true)
    const sidebarRef = useRef(null)

    // Desktop: hover to expand, collapsed by default
    const handleMouseEnter = () => {
        if (window.innerWidth >= 1024) {
            setIsExpanded(true)
        }
    }

    const handleMouseLeave = () => {
        if (window.innerWidth >= 1024) {
            setIsExpanded(false)
        }
    }

    return (
        <>
            {/* Mobile overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        onClick={onClose}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                ref={sidebarRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                initial={false}
                animate={{
                    width: isExpanded ? 256 : 80,
                    x: isOpen || window.innerWidth >= 1024 ? 0 : -256
                }}
                transition={{
                    width: { type: "spring", stiffness: 300, damping: 30 },
                    x: { type: "spring", stiffness: 300, damping: 30 }
                }}
                className={`
                    fixed top-0 left-0 h-full bg-surface/95 backdrop-blur-xl
                    border-r border-white/5 z-50 overflow-hidden
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
                style={{ width: isExpanded ? 256 : 80 }}
            >
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 via-transparent to-secondary-500/5 pointer-events-none" />

                {/* Header */}
                <div className="relative flex items-center justify-between p-4 border-b border-white/5">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <motion.div
                            className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0"
                            whileHover={{ scale: 1.1, rotate: 10 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            <Wallet className="w-5 h-5 text-white" />
                        </motion.div>
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <h1 className="font-bold text-white whitespace-nowrap">ExpenseFlow</h1>
                                    <p className="text-xs text-dark-400 whitespace-nowrap">Smart Budgeting</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 rounded-lg text-dark-400 hover:text-white hover:bg-white/5"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Expand/Collapse toggle (desktop) */}
                <motion.button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="hidden lg:flex absolute right-0 top-20 translate-x-1/2 w-6 h-6 bg-surface-light border border-white/10 rounded-full items-center justify-center text-dark-400 hover:text-white hover:bg-primary-500/20 transition-colors z-10"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronRight className="w-3 h-3" />
                    </motion.div>
                </motion.button>

                {/* Navigation */}
                <nav className="relative p-3 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path
                        return (
                            <NavItem
                                key={item.path}
                                item={item}
                                isActive={isActive}
                                isExpanded={isExpanded}
                                onClick={onClose}
                            />
                        )
                    })}
                </nav>

                {/* User section */}
                <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/5">
                    <motion.div
                        className="flex items-center gap-3 p-3 rounded-xl bg-dark-900/50 overflow-hidden"
                        whileHover={{ backgroundColor: 'rgba(15, 23, 42, 0.7)' }}
                    >
                        <motion.div
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold flex-shrink-0"
                            whileHover={{ scale: 1.1 }}
                        >
                            {user?.name?.charAt(0).toUpperCase()}
                        </motion.div>
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    className="flex-1 min-w-0"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                >
                                    <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                                    <p className="text-xs text-dark-400 truncate">{user?.email}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <motion.button
                            onClick={logout}
                            className="p-2 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0"
                            title="Logout"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <LogOut className="w-4 h-4" />
                        </motion.button>
                    </motion.div>
                </div>
            </motion.aside>
        </>
    )
}

export default Sidebar
