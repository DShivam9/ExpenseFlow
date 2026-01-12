"use client";
import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * TiltedCard
 * 
 * A 3D interactive card that tilts and tracks the mouse.
 * Inspired by React Bits / Aceternity UI.
 */
function TiltedCard({
    children,
    className = "",
    containerHeight = "300px",
    containerWidth = "100%",
    scaleOnHover = 1.05,
    rotateAmplitude = 12,
    showMobileWarning = true,
    showTooltip = true,
    overlayContent = null,
    displayOverlayContent = false,
}) {
    const ref = useRef(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth springs for the tilt effect
    const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseY = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [rotateAmplitude, -rotateAmplitude]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-rotateAmplitude, rotateAmplitude]);

    const handleMouseMove = (e) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseXPos = e.clientX - rect.left;
        const mouseYPos = e.clientY - rect.top;

        const xPct = mouseXPos / width - 0.5;
        const yPct = mouseYPos / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`relative cursor-pointer transition-transform duration-200 ease-out preserve-3d group ${className}`}
            style={{
                width: containerWidth,
                height: containerHeight,
                transformStyle: "preserve-3d",
                perspective: "1000px",
            }}
            whileHover={{ scale: scaleOnHover }}
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className="w-full h-full relative"
            >
                {/* Card Content - We wrap children in a 3D preserving div */}
                <div style={{ transform: "translateZ(0px)" }} className="w-full h-full">
                    {children}
                </div>
            </motion.div>
        </motion.div>
    );
}

// Add a helper for 3D depth elements
export const TiltedContent = ({ children, translateZ = 30, className = "" }) => {
    return (
        <div
            style={{ transform: `translateZ(${translateZ}px)` }}
            className={`${className} transition-transform duration-200`}
        >
            {children}
        </div>
    )
}

export default TiltedCard;
