import { useRef, useEffect, useState } from 'react';
import { scheduler } from '../../utils/performance/AnimationScheduler';
import { usePerformanceMode } from '../../hooks/usePerformanceMode';

/**
 * Squares Background
 * 
 * A performance-optimized grid background where squares randomly fade in and out.
 * Inspired by ReactBits 'Squares'.
 * 
 * Features:
 * - Canvas-based for 60fps performance
 * - Integrated with AnimationScheduler (pauses when hidden)
 * - Adaptive Quality (lowers grid density/update rate on low tier)
 */
const Squares = ({
    direction = 'diagonal', // 'diagonal', 'up', 'down', 'right', 'left'
    speed = 0.5,
    borderColor = '#333',
    hoverFillColor = '#222',
    squareSize = 40
}) => {
    const canvasRef = useRef(null);
    const requestRef = useRef(null);
    const gridOffset = useRef({ x: 0, y: 0 });
    const { tier, reducedMotion } = usePerformanceMode();

    // Grid state
    const hoveredSquare = useRef(null);
    const activeSquares = useRef([]); // Array of {x, y, opacity, life}

    useEffect(() => {
        if (reducedMotion) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Adaptive Settings
        const effectiveSize = tier === 'low' ? squareSize * 2 : squareSize; // Larger squares = fewer to draw
        const effectiveSpeed = tier === 'low' ? speed * 0.5 : speed;
        const maxActive = tier === 'low' ? 10 : (tier === 'medium' ? 20 : 50);

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.scale(dpr, dpr);
        };

        window.addEventListener('resize', resize);
        resize();

        // Main Animation Loop linked to Central Scheduler
        const cleanupSubscription = scheduler.subscribe('squares-bg', (delta) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const width = window.innerWidth;
            const height = window.innerHeight;

            // Update Grid Offset (Movement)
            // We can move the grid pattern to simulate slow motion if desired
            // For now, let's keep it static like the standard "Squares" effect, 
            // or add very subtle movement based on direction.
            if (direction === 'diagonal') {
                gridOffset.current.x += effectiveSpeed * 0.2;
                gridOffset.current.y += effectiveSpeed * 0.2;
            }

            // Draw Grid
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = borderColor;

            // Calculate start points to keep grid seamless
            const startX = (gridOffset.current.x % effectiveSize) - effectiveSize;
            const startY = (gridOffset.current.y % effectiveSize) - effectiveSize;

            ctx.beginPath();
            // Vertical lines
            for (let x = startX; x < width + effectiveSize; x += effectiveSize) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
            }
            // Horizontal lines
            for (let y = startY; y < height + effectiveSize; y += effectiveSize) {
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
            }
            ctx.stroke();

            // Spawn new active squares sporadically
            if (activeSquares.current.length < maxActive && Math.random() < 0.05) {
                const cols = Math.ceil(width / effectiveSize);
                const rows = Math.ceil(height / effectiveSize);
                activeSquares.current.push({
                    x: Math.floor(Math.random() * cols) * effectiveSize + startX,
                    y: Math.floor(Math.random() * rows) * effectiveSize + startY,
                    opacity: 0,
                    phase: 'in' // in, hold, out
                });
            }

            // Draw Active Squares (Random Highlights)
            activeSquares.current.forEach((sq, i) => {
                // Update
                if (sq.phase === 'in') {
                    sq.opacity += 0.02 * effectiveSpeed;
                    if (sq.opacity >= 0.2) sq.phase = 'out'; // Max opacity 0.2
                } else {
                    sq.opacity -= 0.01 * effectiveSpeed;
                }

                // Draw
                if (sq.opacity > 0) {
                    ctx.fillStyle = `rgba(139, 92, 246, ${sq.opacity})`; // Violet brand color
                    ctx.fillRect(sq.x, sq.y, effectiveSize, effectiveSize);
                }
            });

            // Cleanup dead squares
            activeSquares.current = activeSquares.current.filter(sq => sq.opacity > 0);

            // Draw Hovered Square
            if (hoveredSquare.current) {
                ctx.fillStyle = hoverFillColor;
                ctx.fillRect(
                    hoveredSquare.current.x,
                    hoveredSquare.current.y,
                    effectiveSize,
                    effectiveSize
                );
            }
        });

        // Mouse Interaction
        const handleMouseMove = (e) => {
            if (tier === 'low') return; // Disable hover on low tier

            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const startX = (gridOffset.current.x % effectiveSize) - effectiveSize;
            const startY = (gridOffset.current.y % effectiveSize) - effectiveSize;

            const col = Math.floor((x - startX) / effectiveSize);
            const row = Math.floor((y - startY) / effectiveSize);

            hoveredSquare.current = {
                x: col * effectiveSize + startX,
                y: row * effectiveSize + startY
            };
        };

        const handleMouseLeave = () => {
            hoveredSquare.current = null;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cleanupSubscription();
        };
    }, [direction, speed, borderColor, hoverFillColor, squareSize, tier, reducedMotion]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 w-full h-full pointer-events-none opacity-40" // Lower opacity for subtlety
            style={{
                background: '#030014' // Deep Dark Background
            }}
        />
    );
};

export default Squares;
