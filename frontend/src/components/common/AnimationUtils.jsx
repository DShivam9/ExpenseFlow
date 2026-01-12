import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'

// Cursor removed - was causing lag and didn't fit the aesthetic
export const CustomCursor = () => null


// 3D Tilt Card with Parallax Effect
export const TiltCard = ({ children, className = '', tiltStrength = 10, glareOpacity = 0.15 }) => {
    const ref = useRef(null)
    const [rotateX, setRotateX] = useState(0)
    const [rotateY, setRotateY] = useState(0)
    const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 })

    const handleMouseMove = (e) => {
        if (!ref.current) return

        const rect = ref.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        const mouseX = e.clientX - centerX
        const mouseY = e.clientY - centerY

        const rotX = (mouseY / (rect.height / 2)) * -tiltStrength
        const rotY = (mouseX / (rect.width / 2)) * tiltStrength

        setRotateX(rotX)
        setRotateY(rotY)

        // Calculate glare position
        const glareX = ((e.clientX - rect.left) / rect.width) * 100
        const glareY = ((e.clientY - rect.top) / rect.height) * 100
        setGlarePosition({ x: glareX, y: glareY })
    }

    const handleMouseLeave = () => {
        setRotateX(0)
        setRotateY(0)
        setGlarePosition({ x: 50, y: 50 })
    }

    return (
        <motion.div
            ref={ref}
            className={`relative overflow-hidden ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transformStyle: 'preserve-3d',
                perspective: 1000,
            }}
            animate={{
                rotateX,
                rotateY,
            }}
            transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
            }}
        >
            {children}
            {/* Glare overlay */}
            <motion.div
                className="absolute inset-0 pointer-events-none rounded-inherit"
                style={{
                    background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,${glareOpacity}) 0%, transparent 50%)`,
                }}
                animate={{
                    opacity: rotateX !== 0 || rotateY !== 0 ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
            />
        </motion.div>
    )
}

// Glow Card with Mouse-Tracking Effect
export const GlowCard = ({ children, className = '', glowColor = 'rgba(79, 156, 249, 0.4)', glowSize = 200 }) => {
    const ref = useRef(null)
    const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 })
    const [isHovering, setIsHovering] = useState(false)

    const handleMouseMove = (e) => {
        if (!ref.current) return

        const rect = ref.current.getBoundingClientRect()
        setGlowPosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        })
    }

    return (
        <motion.div
            ref={ref}
            className={`relative overflow-hidden ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Glow effect */}
            <motion.div
                className="absolute pointer-events-none"
                style={{
                    left: glowPosition.x,
                    top: glowPosition.y,
                    width: glowSize,
                    height: glowSize,
                    x: '-50%',
                    y: '-50%',
                    background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
                    filter: 'blur(20px)',
                }}
                animate={{
                    opacity: isHovering ? 1 : 0,
                    scale: isHovering ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
            />
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    )
}

// Particle Background System
export const ParticleBackground = ({ count = 30, color = 'rgba(79, 156, 249, 0.3)' }) => {
    const particles = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 5,
    }))

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {particles.map(particle => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: particle.size,
                        height: particle.size,
                        backgroundColor: color,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        x: [0, Math.random() * 20 - 10, 0],
                        opacity: [0.2, 0.6, 0.2],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    )
}

// Magnetic button wrapper
export const MagneticButton = ({ children, className = '', strength = 0.3, ...props }) => {
    const ref = useRef(null)
    const [transform, setTransform] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e) => {
        if (!ref.current) return

        const rect = ref.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        const deltaX = (e.clientX - centerX) * strength
        const deltaY = (e.clientY - centerY) * strength

        setTransform({ x: deltaX, y: deltaY })
    }

    const handleMouseLeave = () => {
        setTransform({ x: 0, y: 0 })
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: transform.x, y: transform.y }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}

// Page transition wrapper
export const PageTransition = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1]
            }}
        >
            {children}
        </motion.div>
    )
}

// Reveal on scroll wrapper
export const RevealOnScroll = ({ children, delay = 0, direction = 'up' }) => {
    const ref = useRef(null)
    const [isInView, setIsInView] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.1, rootMargin: '-50px' }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => observer.disconnect()
    }, [])

    const variants = {
        hidden: {
            opacity: 0,
            y: direction === 'up' ? 30 : direction === 'down' ? -30 : 0,
            x: direction === 'left' ? 30 : direction === 'right' ? -30 : 0,
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
        },
    }

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={variants}
            transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    )
}

// Stagger children animation
export const StaggerContainer = ({ children, staggerDelay = 0.1 }) => {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                visible: {
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
        >
            {children}
        </motion.div>
    )
}

export const StaggerItem = ({ children }) => {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    )
}

// Animated number counter
export const AnimatedNumber = ({ value, duration = 1, decimals = 0 }) => {
    const [displayValue, setDisplayValue] = useState(0)
    const ref = useRef(null)
    const [hasAnimated, setHasAnimated] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true)

                    const startTime = performance.now()
                    const startValue = 0
                    const endValue = parseFloat(value)

                    const animate = (currentTime) => {
                        const elapsed = (currentTime - startTime) / 1000
                        const progress = Math.min(elapsed / duration, 1)

                        // Easing function (ease-out-expo)
                        const easeProgress = 1 - Math.pow(2, -10 * progress)

                        const current = startValue + (endValue - startValue) * easeProgress
                        setDisplayValue(current)

                        if (progress < 1) {
                            requestAnimationFrame(animate)
                        }
                    }

                    requestAnimationFrame(animate)
                }
            },
            { threshold: 0.5 }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => observer.disconnect()
    }, [value, duration, hasAnimated])

    return (
        <span ref={ref} className="mono-numbers">
            {displayValue.toFixed(decimals)}
        </span>
    )
}

// Floating element with subtle motion
export const FloatingElement = ({ children, delay = 0, amplitude = 10 }) => {
    return (
        <motion.div
            animate={{
                y: [-amplitude, amplitude, -amplitude],
            }}
            transition={{
                duration: 6,
                delay,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
        >
            {children}
        </motion.div>
    )
}

export default {
    CustomCursor,
    MagneticButton,
    PageTransition,
    RevealOnScroll,
    StaggerContainer,
    StaggerItem,
    AnimatedNumber,
    FloatingElement,
}
