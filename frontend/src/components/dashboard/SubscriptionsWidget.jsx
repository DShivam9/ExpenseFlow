import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, CreditCard, ArrowUpRight } from 'lucide-react'
import { formatCurrency } from '../../utils/formatters'

const SubscriptionsWidget = ({ subscriptions = [], loading }) => {
    // Mouse position for spotlight effect
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        })
    }

    const getInitials = (name) => {
        return name.substring(0, 2).toUpperCase()
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4 }}
            onMouseMove={handleMouseMove}
            className="relative h-full group"
        >
            {/* Glass Card */}
            <div className="h-full p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 
                          hover:border-white/20 transition-all duration-300 overflow-hidden flex flex-col">

                {/* Spotlight effect following mouse */}
                <div
                    className="absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        left: mousePosition.x - 100,
                        top: mousePosition.y - 100,
                        width: 200,
                        height: 200,
                        background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(20px)'
                    }}
                />

                {/* Top highlight line */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                {/* Header */}
                <div className="flex items-center justify-between mb-6 relative z-10">
                    <div>
                        <h3 className="text-lg font-semibold text-white">Upcoming</h3>
                        <p className="text-sm text-zinc-500">Recurring payments</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white/70" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 relative z-10">
                    {loading ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/5 rounded-xl animate-pulse" />
                                    <div className="flex-1">
                                        <div className="w-24 h-4 bg-white/5 rounded animate-pulse mb-1" />
                                        <div className="w-16 h-3 bg-white/5 rounded animate-pulse" />
                                    </div>
                                    <div className="w-16 h-4 bg-white/5 rounded animate-pulse" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {subscriptions.map((sub, index) => (
                                <motion.div
                                    key={sub._id}
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.03)' }}
                                    className="flex items-center gap-3 p-2 -mx-2 rounded-xl cursor-pointer transition-colors"
                                >
                                    {/* Monochrome badge */}
                                    <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 
                                                  flex items-center justify-center font-bold text-xs text-white/80
                                                  group-hover:bg-white/15 transition-colors">
                                        {getInitials(sub.name)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">
                                            {sub.name}
                                        </p>
                                        <p className="text-xs text-zinc-500">
                                            {new Date(sub.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-white">
                                            {formatCurrency(sub.amount)}
                                        </p>
                                        <div className="flex items-center justify-end gap-1 text-[10px] text-zinc-600">
                                            <span>Auto</span>
                                            <CreditCard className="w-2.5 h-2.5" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-auto pt-6 relative z-10">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 
                                 hover:bg-white/10 hover:border-white/20
                                 text-xs text-zinc-400 hover:text-white transition-all duration-300 
                                 flex items-center justify-center gap-2"
                    >
                        View Calendar <ArrowUpRight className="w-3 h-3" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}

export default SubscriptionsWidget
