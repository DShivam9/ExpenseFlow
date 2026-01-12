import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'

/**
 * DecryptedText
 * 
 * Animates text from random characters to the final string.
 * "Matrix" or "Cyberpunk" decryption effect.
 */

// Default characters to shuffle through
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&"

export const DecryptedText = ({
    text,
    speed = 50,
    maxIterations = 10,
    className = "",
    animateOnView = true,
    revealDirection = "start", // "start" | "end" | "center"
    sequential = true // if true, reveals one by one. if false, all at once eventually
}) => {
    const [displayText, setDisplayText] = useState(text)
    const [isAnimating, setIsAnimating] = useState(false)
    const iterations = useRef(0)

    // Determine the shuffled state relative to progress
    const revealText = () => {
        setIsAnimating(true)
        iterations.current = 0

        const interval = setInterval(() => {
            setDisplayText(prev => {
                let result = ""

                // If text is "EXPENSE", length 7.
                // We want to reveal indices 0..N based on iterations.
                // Or just scramble all and settle.

                // Simple approach: Scramble all characters that aren't "done"
                const progress = iterations.current / maxIterations

                result = text
                    .split("")
                    .map((char, index) => {
                        if (char === " ") return " " // Keep spaces

                        // If sequential, we reveal from index 0 to length based on progress
                        if (sequential) {
                            if (index < Math.floor(text.length * progress)) {
                                return char
                            }
                        } else {
                            // Non-sequential: random chance to settle
                            if (iterations.current >= maxIterations) {
                                return char
                            }
                        }

                        // Otherwise return random char
                        return CHARS[Math.floor(Math.random() * CHARS.length)]
                    })
                    .join("")

                if (sequential) {
                    if (iterations.current >= maxIterations) {
                        clearInterval(interval)
                        setIsAnimating(false)
                        return text // Force final
                    }
                } else {
                    if (iterations.current >= maxIterations) {
                        clearInterval(interval)
                        setIsAnimating(false)
                        return text
                    }
                }

                iterations.current += 1 / text.length // Slow increment for sequential
                if (!sequential) iterations.current += 1

                return result
            })
        }, speed)

        return () => clearInterval(interval)
    }

    useEffect(() => {
        // trigger animation
        const cleanup = revealText()
        return cleanup
    }, [text])

    return (
        <span className={className}>
            {displayText}
        </span>
    )
}

// Improved version that tracks per-character state for smoother "wave" reveal
export const HyperText = ({
    text,
    className,
    duration = 800,
    delay = 0,
}) => {
    const [display, setDisplay] = useState(text.split("").map(() => " "));
    const [trigger, setTrigger] = useState(false);
    const interations = useRef(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setTrigger(true)
        }, delay);
        return () => clearTimeout(timer)
    }, [delay])

    useEffect(() => {
        if (!trigger) return;

        const interval = setInterval(() => {
            setDisplay((current) =>
                current.map((char, i) => {
                    if (i < interations.current) {
                        return text[i];
                    }
                    return CHARS[Math.floor(Math.random() * CHARS.length)];
                })
            );
            interations.current += 0.1; // speed of reveal wave

            if (interations.current > text.length) {
                clearInterval(interval);
                setDisplay(text.split(""));
            }
        }, duration / (text.length * 10)); // normalize speed

        return () => clearInterval(interval);
    }, [text, duration, trigger]);

    return (
        <div className={`flex overflow-hidden ${className}`}>
            {display.map((l, i) => (
                <motion.span key={i} className="inline-block" style={{ width: l === " " ? "0.5em" : "auto" }}>
                    {l}
                </motion.span>
            ))}
        </div>
    );
};
