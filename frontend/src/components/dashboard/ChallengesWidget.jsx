import { motion } from 'framer-motion'
import { useState } from 'react'
import { Flame, Clock, Trophy, ChevronRight, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

const ChallengesWidget = ({ challenges = [], loading = false }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        })
    }

    if (loading) {
        return (
            <div className="h-full p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                <div className="animate-pulse">
                    <div className="h-5 w-32 bg-white/5 rounded mb-6" />
                    <div className="space-y-4">
                        {[1, 2].map(i => (
                            <div key={i} className="h-24 bg-white/5 rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    const activeChallenge = challenges[0]

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

                {/* Spotlight effect */}
                <div
                    className="absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        left: mousePosition.x - 80,
                        top: mousePosition.y - 80,
                        width: 160,
                        height: 160,
                        background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(20px)'
                    }}
                />

                {/* Top highlight */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                {/* Header */}
                <div className="flex items-center justify-between mb-5 relative z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
                            <Flame className="w-4 h-4 text-white/80" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Active Challenge</h3>
                            <p className="text-xs text-zinc-500">{challenges.length} available</p>
                        </div>
                    </div>
                    <Link
                        to="/app/achievements"
                        className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1"
                    >
                        View All
                        <ChevronRight className="w-3 h-3" />
                    </Link>
                </div>

                {/* Challenge Content */}
                {activeChallenge ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex-1 bg-white/5 rounded-xl p-4 border border-white/10 relative z-10"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h4 className="font-medium text-white mb-1">{activeChallenge.title}</h4>
                                <p className="text-xs text-zinc-500">{activeChallenge.description}</p>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 bg-white/10 border border-white/10 rounded-full">
                                <Trophy className="w-3 h-3 text-white/80" />
                                <span className="text-xs font-medium text-white/80">+{activeChallenge.reward} pts</span>
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="mb-3">
                            <div className="flex justify-between text-xs mb-1.5">
                                <span className="text-zinc-500">Progress</span>
                                <span className="text-white font-medium">
                                    {activeChallenge.current}/{activeChallenge.target}{activeChallenge.unit}
                                </span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(activeChallenge.current / activeChallenge.target) * 100}%` }}
                                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-white/70 to-white/40 rounded-full"
                                />
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-zinc-500">
                                <Clock className="w-3.5 h-3.5" />
                                <span className="text-xs">{activeChallenge.daysRemaining} days left</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-white/70">
                                <Zap className="w-3 h-3" />
                                <span>{Math.round((activeChallenge.current / activeChallenge.target) * 100)}% complete</span>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-8 relative z-10">
                        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                            <Trophy className="w-6 h-6 text-zinc-600" />
                        </div>
                        <p className="text-sm text-zinc-500 mb-2">No active challenges</p>
                        <Link
                            to="/app/achievements"
                            className="text-xs text-white/70 hover:text-white transition-colors"
                        >
                            Browse challenges →
                        </Link>
                    </div>
                )}

                {/* Other challenges indicator */}
                {challenges.length > 1 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-4 pt-4 border-t border-white/10 relative z-10"
                    >
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-500">Other active challenges</span>
                            <div className="flex -space-x-2">
                                {challenges.slice(1, 4).map((c) => (
                                    <div
                                        key={c._id}
                                        className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[10px] text-white/70"
                                        title={c.title}
                                    >
                                        {c.title.charAt(0)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    )
}

export default ChallengesWidget
