import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * ScrollFloat
 * Splits text into characters and animates them based on scroll position.
 * @param {string} text - The text to animate
 * @param {number} animationDuration - Duration of the float animation
 * @param {number} ease - Easing function
 * @param {number} scrollStart - Viewport percentage to start scroll effect
 * @param {number} scrollEnd - Viewport percentage to end scroll effect
 * @param {number} stagger - Stagger delay between characters
 */
const ScrollFloat = ({
    children,
    animationDuration = 1,
    ease = 'back.out(2)',
    scrollStart = 0,
    scrollEnd = 1, // 100% of viewport
    stagger = 0.05,
    className = ""
}) => {
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: [`${scrollStart * 100}% end`, `${scrollEnd * 100}% end`]
    });

    const words = children.split(" ");

    // Variants for each character
    const itemVariants = {
        hidden: { opacity: 0, y: 50, rotateX: -90 },
        visible: { opacity: 1, y: 0, rotateX: 0 }
    };

    return (
        <h2 ref={containerRef} className={`scroll-float-container flex flex-wrap gap-[0.3em] overflow-hidden ${className}`}>
            {/* We map words to keep them together, then characters */}
            {words.map((word, i) => (
                <span key={i} className="inline-block whitespace-nowrap">
                    {word.split("").map((char, j) => (
                        <motion.span
                            key={j}
                            className="inline-block origin-bottom"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "0px" }}
                            transition={{
                                duration: animationDuration,
                                ease: [0.22, 1, 0.36, 1], // Custom ease similar to 'back.out'
                                delay: (i * 0.1) + (j * stagger) // Stagger by word + character
                            }}
                            variants={itemVariants}
                        >
                            {char}
                        </motion.span>
                    ))}
                </span>
            ))}
        </h2>
    );
};

export default ScrollFloat;
