import { useEffect, useRef } from 'react'

/**
 * AnimatedBackground - "Radial Flow"
 * 
 * A sophisticated, system-level background animation.
 * Features a subtle radial flow of particles expanding gently from the center.
 * Designed to convey scale and intelligence without distraction.
 * 
 * CONFIGURATION:
 * Tune these parameters to adjust the feel.
 */
const CONFIG = {
    particleCount: 160,        // Increased density
    baseSpeed: 0.35,          // Faster expansion
    centerBias: 1.5,          // Slightly wider distribution spread
    size: { min: 1.5, max: 3.5 }, // Larger, more visible dots
    colors: [
        { r: 139, g: 92, b: 246, a: 0.4 },  // violet-600 (Much clearer)
        { r: 167, g: 139, b: 250, a: 0.35 }, // violet-400
        { r: 255, g: 255, b: 255, a: 0.25 }, // white (Bright dust)
    ],
    reducedMotion: false,     // Will be detecting system preference
}

class Particle {
    constructor(canvas) {
        this.canvas = canvas
        this.reset(true)
    }

    reset(initial = false) {
        // Polar coordinates for radial control
        // Initialize with a bias towards the center for visual depth
        const angle = Math.random() * Math.PI * 2

        // Distance from center: biased random to cluster near center
        // Math.pow(Math.random(), bias) pushes values closer to 0 (if bias > 1)
        // We want 0 to be center, 1 to be edge (radius)
        const maxRadius = Math.max(this.canvas.width, this.canvas.height) * 0.6
        const distFactor = Math.pow(Math.random(), CONFIG.centerBias)
        const radius = distFactor * maxRadius

        this.x = this.canvas.width / 2 + Math.cos(angle) * radius
        this.y = this.canvas.height / 2 + Math.sin(angle) * radius

        // Velocity vectors based on angle (Outward expansion)
        // Particles move away from center
        const speed = CONFIG.baseSpeed * (0.5 + Math.random() * 0.5)
        this.vx = Math.cos(angle) * speed
        this.vy = Math.sin(angle) * speed

        this.size = Math.random() * (CONFIG.size.max - CONFIG.size.min) + CONFIG.size.min

        const color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)]
        this.color = color
        this.currentAlpha = initial ? Math.random() * color.a : 0 // smooth entry
    }

    update() {
        this.x += this.vx
        this.y += this.vy

        // Fade in
        if (this.currentAlpha < this.color.a) {
            this.currentAlpha += 0.005 // Faster fade in
        }

        // Distance checks for fading/resetting
        const dx = this.x - this.canvas.width / 2
        const dy = this.y - this.canvas.height / 2
        const dist = Math.sqrt(dx * dx + dy * dy)
        const maxDist = Math.max(this.canvas.width, this.canvas.height) * 0.6

        // Alpha fade based on distance (Fade out near edges)
        // Start fading at 50% of screen, 0 opacity at 70%
        const fadeStart = maxDist * 0.5
        if (dist > fadeStart) {
            const fadeOut = 1 - (dist - fadeStart) / (maxDist - fadeStart)
            this.currentAlpha = Math.max(0, fadeOut * this.color.a)
        }

        // Reset if fully transparent or too far
        if (dist > maxDist || this.currentAlpha <= 0) {
            this.reset()
        }
    }

    draw(ctx) {
        // Skip invisible
        if (this.currentAlpha <= 0.001) return

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.currentAlpha})`
        ctx.fill()
    }
}

export const AnimatedBackground = () => {
    const canvasRef = useRef(null)
    const animationRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        let particles = []

        // Detect reduced motion preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        CONFIG.reducedMotion = mediaQuery.matches

        const resize = () => {
            const dpr = window.devicePixelRatio || 1
            canvas.width = window.innerWidth * dpr
            canvas.height = window.innerHeight * dpr
            canvas.style.width = `${window.innerWidth}px`
            canvas.style.height = `${window.innerHeight}px`
            ctx.scale(dpr, dpr)
            initParticles()
        }

        const initParticles = () => {
            // Significantly reduce count if reduced motion is on
            const count = CONFIG.reducedMotion ? 20 : CONFIG.particleCount
            particles = Array.from(
                { length: count },
                () => new Particle({ width: window.innerWidth, height: window.innerHeight })
            )
        }

        const animate = () => {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

            particles.forEach(p => {
                p.update()
                p.draw(ctx)
            })

            animationRef.current = requestAnimationFrame(animate)
        }

        resize()
        window.addEventListener('resize', resize)
        mediaQuery.addEventListener('change', (e) => {
            CONFIG.reducedMotion = e.matches
            resize() // Reinits particles with new motion setting
        })

        animate()

        return () => {
            window.removeEventListener('resize', resize)
            cancelAnimationFrame(animationRef.current)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                pointerEvents: 'none',
                opacity: 0.9 // Increased text opacity
            }}
        />
    )
}

export default AnimatedBackground
