import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { cn } from "../../utils/cn";
import { Link } from "react-router-dom";

export const FloatingDock = ({
    items,
    desktopClassName,
    mobileClassName,
    orientation = "horizontal" // New prop: "horizontal" | "vertical"
}) => {
    return (
        <>
            <FloatingDockDesktop items={items} className={desktopClassName} orientation={orientation} />
            <FloatingDockMobile items={items} className={mobileClassName} />
        </>
    );
};

const FloatingDockMobile = ({
    items,
    className,
}) => {
    const [open, setOpen] = useState(false);
    return (
        <div className={cn("relative block md:hidden", className)}>
            <AnimatePresence>
                {open && (
                    <motion.div
                        layoutId="nav"
                        className="absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2">
                        {items.map((item, idx) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{
                                    opacity: 0,
                                    y: 10,
                                    transition: { delay: idx * 0.05 },
                                }}
                                transition={{ delay: (items.length - 1 - idx) * 0.05 }}>
                                {item.onClick ? (
                                    <button
                                        onClick={() => { item.onClick(); setOpen(false); }}
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                                        <div className="h-4 w-4">{item.icon}</div>
                                    </button>
                                ) : (
                                    <Link
                                        to={item.href}
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                                        <div className="h-4 w-4">{item.icon}</div>
                                    </Link>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
            <button
                onClick={() => setOpen(!open)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800">
                <IconLayoutNavbarCollapse className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
            </button>
        </div>
    );
};

const FloatingDockDesktop = ({
    items,
    className,
    orientation
}) => {
    let mouse = useMotionValue(Infinity); // Use explicit "mouse" for X or Y depending on orientation
    const isVertical = orientation === "vertical";

    return (
        <motion.div
            onMouseMove={(e) => mouse.set(isVertical ? e.pageY : e.pageX)}
            onMouseLeave={() => mouse.set(Infinity)}
            className={cn(
                "mx-auto hidden md:flex gap-4 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10",
                // Conditional styles for orientation
                isVertical
                    ? "flex-col h-auto w-16 items-center py-4 px-2"
                    : "h-16 items-end px-4 pb-3",
                className
            )}>
            {items.map((item) => (
                <IconContainer mouse={mouse} key={item.title} {...item} orientation={orientation} />
            ))}
        </motion.div>
    );
};

function IconContainer({
    mouse,
    title,
    icon,
    href,
    onClick,
    orientation
}) {
    let ref = useRef(null);
    const isVertical = orientation === "vertical";

    let distance = useTransform(mouse, (val) => {
        let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, y: 0, width: 0, height: 0 };

        if (isVertical) {
            // Distance based on Y center
            return val - bounds.y - bounds.height / 2;
        } else {
            // Distance based on X center (default)
            return val - bounds.x - bounds.width / 2;
        }
    });

    let sizeTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
    let iconSizeTransform = useTransform(distance, [-150, 0, 150], [20, 40, 20]);

    let size = useSpring(sizeTransform, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });

    let iconSize = useSpring(iconSizeTransform, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });

    const [hovered, setHovered] = useState(false);

    const content = (
        <motion.div
            ref={ref}
            style={{ width: size, height: size }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="relative flex aspect-square items-center justify-center rounded-full bg-gray-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 cursor-pointer">
            <AnimatePresence>
                {hovered && (
                    <motion.div
                        initial={{ opacity: 0, x: isVertical ? 20 : "-50%", y: isVertical ? 0 : 10 }}
                        animate={{ opacity: 1, x: isVertical ? 10 : "-50%", y: isVertical ? 0 : -50 }}
                        exit={{ opacity: 0, x: isVertical ? 20 : "-50%", y: isVertical ? 0 : 2 }}
                        className={cn(
                            "absolute w-fit rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs whitespace-pre text-neutral-700 dark:border-neutral-900 dark:bg-neutral-800 dark:text-white z-50",
                            isVertical ? "left-full ml-2" : "-top-8 left-1/2"
                        )}>
                        {title}
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.div
                style={{ width: iconSize, height: iconSize }}
                className="flex items-center justify-center">
                {icon}
            </motion.div>
        </motion.div>
    );

    if (onClick) {
        return <div onClick={onClick}>{content}</div>;
    }

    return <Link to={href}>{content}</Link>;
}
