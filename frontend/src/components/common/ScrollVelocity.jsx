import { useRef } from "react";
import {
    motion,
    useMotionValue,
    useAnimationFrame
} from "framer-motion";
import { wrap } from "@motionone/utils";

const ScrollVelocity = ({
    children,
    baseVelocity = 100,
    className = ""
}) => {
    const baseX = useMotionValue(0);
    const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

    useAnimationFrame((t, delta) => {
        let moveBy = baseVelocity * (delta / 1000);
        baseX.set(baseX.get() + moveBy);
    });

    return (
        <div className={`overflow-hidden m-0 flex flex-nowrap ${className}`}>
            <motion.div
                className="flex flex-nowrap gap-10"
                style={{ x }}
            >
                {children}
                {children}
                {children}
                {children}
            </motion.div>
        </div>
    );
};

// Helper for useTransform since we removed the import but still use it for x
import { useTransform } from "framer-motion";

export default ScrollVelocity;
