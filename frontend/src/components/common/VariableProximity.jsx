import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Individual letter component
const Letter = ({ letter, mouseX, mouseY, containerRef }) => {
    const letterRef = useRef(null);
    const [bounds, setBounds] = useState(null);

    useEffect(() => {
        if (letterRef.current) {
            setBounds(letterRef.current.getBoundingClientRect());
        }
    }, []);

    // Re-calculate bounds on resize
    useEffect(() => {
        const updateBounds = () => {
            if (letterRef.current) {
                setBounds(letterRef.current.getBoundingClientRect());
            }
        }
        window.addEventListener('resize', updateBounds);
        return () => window.removeEventListener('resize', updateBounds);
    }, []);

    const distance = useTransform(mouseX, (val) => {
        if (!bounds) return 0;
        const letterX = bounds.x + bounds.width / 2;
        const letterY = bounds.y + bounds.height / 2;
        const d = Math.sqrt(
            Math.pow(val - letterX, 2) + Math.pow(mouseY.get() - letterY, 2)
        );
        return d;
    });

    // Scale range: closer = bigger. Max scale at 0 distance, min scale at >150 distance
    const scale = useTransform(distance, [0, 150], [1.5, 1]);
    const colorLightness = useTransform(distance, [0, 150], [100, 70]); // 100% white to 70% gray

    // Smooth the scale
    const smoothScale = useSpring(scale, { damping: 15, stiffness: 200 });

    return (
        <motion.span
            ref={letterRef}
            style={{
                scale: smoothScale,
                display: 'inline-block',
                color: useTransform(colorLightness, l => `hsl(0, 0%, ${l}%)`)
            }}
            className="origin-bottom font-bold"
        >
            {letter === " " ? "\u00A0" : letter}
        </motion.span>
    );
};

const VariableProximity = ({ label, className = "" }) => {
    const containerRef = useRef(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <h2
            ref={containerRef}
            className={`${className} cursor-default`}
            aria-label={label}
        >
            {label.split('').map((letter, i) => (
                <Letter
                    key={i}
                    letter={letter}
                    mouseX={mouseX}
                    mouseY={mouseY}
                    containerRef={containerRef}
                />
            ))}
        </h2>
    );
};

export default VariableProximity;
