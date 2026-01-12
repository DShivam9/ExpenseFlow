import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Flame, Target, Star, ChevronRight, X } from 'lucide-react'
import { mockAchievements, mockChallenges } from '../utils/mockData'
import AchievementBadge from '../components/common/AchievementBadge'

const Achievements = () => {
    const [selectedAchievement, setSelectedAchievement] = useState(null)
    const [activeTab, setActiveTab] = useState('achievements') // 'achievements' | 'challenges'

    const unlockedCount = mockAchievements.filter(a => a.unlocked).length
    const totalCount = mockAchievements.length

    const tabs = [
        { id: 'achievements', label: 'Achievements', icon: Trophy },
        { id: 'challenges', label: 'Challenges', icon: Flame }
    ]

    // Group achievements by tier
    const groupedByTier = mockAchievements.reduce((acc, achievement) => {
        if (!acc[achievement.tier]) acc[achievement.tier] = []
        acc[achievement.tier].push(achievement)
        return acc
    }, {})

    const tierOrder = ['platinum', 'gold', 'silver', 'bronze']

    return (
        <div className="min-h-screen p-6 lg:p-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-white mb-2">Achievements & Challenges</h1>
                <p className="text-zinc-500">Track your progress and earn rewards</p>
            </motion.div>

            {/* Stats Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
                <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <span className="text-xs text-zinc-500">Unlocked</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{unlockedCount}<span className="text-zinc-500 text-lg">/{totalCount}</span></p>
                </div>
                <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Flame className="w-4 h-4 text-orange-400" />
                        <span className="text-xs text-zinc-500">Active Challenges</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{mockChallenges.length}</p>
                </div>
                <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs text-zinc-500">Completion</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{Math.round((unlockedCount / totalCount) * 100)}%</p>
                </div>
                <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs text-zinc-500">Points Earned</span>
                    </div>
                    <p className="text-2xl font-bold text-white">450</p>
                </div>
            </motion.div>

            {/* Tabs */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex gap-2 mb-6"
            >
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                            ${activeTab === tab.id
                                ? 'bg-white text-black'
                                : 'bg-zinc-900/50 text-zinc-400 hover:text-white border border-zinc-800/50'
                            }
                        `}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </motion.div>

            {/* Content */}
            <AnimatePresence mode="wait">
                {activeTab === 'achievements' ? (
                    <motion.div
                        key="achievements"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        {tierOrder.map(tier => (
                            groupedByTier[tier] && (
                                <div key={tier} className="mb-8">
                                    <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-4 capitalize">
                                        {tier} Tier
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {groupedByTier[tier].map((achievement, index) => (
                                            <motion.div
                                                key={achievement._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <AchievementBadge
                                                    achievement={achievement}
                                                    onClick={() => setSelectedAchievement(achievement)}
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="challenges"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                    >
                        {mockChallenges.map((challenge, index) => (
                            <motion.div
                                key={challenge._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-xl p-6"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h4 className="text-lg font-semibold text-white mb-1">{challenge.title}</h4>
                                        <p className="text-sm text-zinc-500">{challenge.description}</p>
                                    </div>
                                    <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-500/10 rounded-full">
                                        <Trophy className="w-4 h-4 text-amber-400" />
                                        <span className="text-sm font-medium text-amber-400">+{challenge.reward} pts</span>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-zinc-400">Progress</span>
                                        <span className="text-white font-medium">
                                            {challenge.current}/{challenge.target}{challenge.unit}
                                        </span>
                                    </div>
                                    <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(challenge.current / challenge.target) * 100}%` }}
                                            transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                                            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-zinc-500">{challenge.daysRemaining} days remaining</span>
                                    <button className="text-white hover:text-zinc-300 transition-colors flex items-center gap-1">
                                        View Details
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Achievement Detail Modal */}
            <AnimatePresence>
                {selectedAchievement && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedAchievement(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-sm w-full text-center"
                        >
                            <button
                                onClick={() => setSelectedAchievement(null)}
                                className="absolute top-4 right-4 text-zinc-500 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-6xl mb-4">{selectedAchievement.icon}</div>
                            <h3 className="text-xl font-bold text-white mb-2">{selectedAchievement.name}</h3>
                            <p className="text-zinc-400 mb-4">{selectedAchievement.description}</p>
                            <div className={`inline-block px-3 py-1 rounded-full text-sm capitalize ${selectedAchievement.unlocked
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-zinc-800 text-zinc-500'
                                }`}>
                                {selectedAchievement.unlocked ? 'Unlocked' : `${selectedAchievement.tier} Tier`}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Achievements
