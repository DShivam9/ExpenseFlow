import { motion } from 'framer-motion'
import { Lock, Check, Sparkles } from 'lucide-react'

const tierStyles = {
    bronze: {
        bg: 'bg-gradient-to-br from-amber-900/30 to-orange-900/30',
        border: 'border-amber-800/50',
        text: 'text-amber-400',
        glow: 'shadow-amber-500/10'
    },
    silver: {
        bg: 'bg-gradient-to-br from-zinc-600/30 to-zinc-500/30',
        border: 'border-zinc-500/50',
        text: 'text-zinc-300',
        glow: 'shadow-zinc-400/10'
    },
    gold: {
        bg: 'bg-gradient-to-br from-yellow-600/30 to-amber-500/30',
        border: 'border-yellow-500/50',
        text: 'text-yellow-400',
        glow: 'shadow-yellow-500/10'
    },
    platinum: {
        bg: 'bg-gradient-to-br from-cyan-600/30 to-blue-500/30',
        border: 'border-cyan-500/50',
        text: 'text-cyan-400',
        glow: 'shadow-cyan-500/10'
    }
}

const AchievementBadge = ({
    achievement,
    size = 'normal', // 'small', 'normal', 'large'
    showDetails = true,
    onClick
}) => {
    const { name, description, icon, tier, unlocked, unlockedAt } = achievement
    const styles = tierStyles[tier] || tierStyles.bronze

    const sizeClasses = {
        small: 'w-12 h-12 text-lg',
        normal: 'w-16 h-16 text-2xl',
        large: 'w-24 h-24 text-4xl'
    }

    const formatDate = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    return (
        <motion.div
            whileHover={{ scale: unlocked ? 1.05 : 1 }}
            whileTap={{ scale: unlocked ? 0.95 : 1 }}
            onClick={onClick}
            className={`
                relative flex flex-col items-center text-center p-4 rounded-xl
                transition-all duration-200 cursor-pointer
                ${unlocked
                    ? `${styles.bg} ${styles.border} border shadow-lg ${styles.glow}`
                    : 'bg-zinc-900/50 border border-zinc-800/50'
                }
            `}
        >
            {/* Badge Icon */}
            <div className={`
                ${sizeClasses[size]} rounded-full flex items-center justify-center mb-3
                ${unlocked
                    ? `${styles.bg} ${styles.border} border`
                    : 'bg-zinc-800/50 border border-zinc-700/50'
                }
            `}>
                {unlocked ? (
                    <span className="select-none">{icon}</span>
                ) : (
                    <Lock className="w-5 h-5 text-zinc-600" />
                )}
            </div>

            {/* Details */}
            {showDetails && (
                <>
                    <h4 className={`text-sm font-medium mb-1 ${unlocked ? 'text-white' : 'text-zinc-500'}`}>
                        {name}
                    </h4>
                    <p className={`text-xs ${unlocked ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        {description}
                    </p>

                    {/* Unlock Status */}
                    <div className="mt-3">
                        {unlocked ? (
                            <div className="flex items-center gap-1 text-xs">
                                <Check className={`w-3 h-3 ${styles.text}`} />
                                <span className={styles.text}>
                                    {formatDate(unlockedAt)}
                                </span>
                            </div>
                        ) : (
                            <span className="text-xs text-zinc-600 capitalize">{tier}</span>
                        )}
                    </div>
                </>
            )}

            {/* Shine effect for unlocked */}
            {unlocked && (
                <motion.div
                    initial={{ x: '-100%', opacity: 0 }}
                    animate={{ x: '100%', opacity: [0, 0.5, 0] }}
                    transition={{
                        duration: 1.5,
                        delay: Math.random() * 2,
                        repeat: Infinity,
                        repeatDelay: 5 + Math.random() * 5
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-xl pointer-events-none"
                />
            )}

            {/* New badge indicator */}
            {unlocked && unlockedAt && (
                new Date(unlockedAt) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
            ) && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg"
                    >
                        <Sparkles className="w-3 h-3 text-black" />
                    </motion.div>
                )}
        </motion.div>
    )
}

export default AchievementBadge
