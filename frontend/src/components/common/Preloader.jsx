import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const statuses = [
    "Syncing Financial Data...",
    "Encrypting Wallet...",
    "Fetching Exchange Rates...",
    "Dashboard Ready."
];

export const Preloader = () => {
    const [count, setCount] = useState(0);
    const [paramIndex, setParamIndex] = useState(0);
    const [dimension, setDimension] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setDimension({ width: window.innerWidth, height: window.innerHeight });
    }, []);

    useEffect(() => {
        // Counter animation
        const duration = 3500; // slightly less than total load time to ensure 100% is seen
        const interval = 35; // update roughly every frame
        const steps = duration / interval;
        const increment = 100 / steps;

        const timer = setInterval(() => {
            setCount(prev => {
                const next = prev + increment;
                if (next >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return next;
            });
        }, interval);

        // Status text rotation
        const textTimer = setInterval(() => {
            setParamIndex(prev => (prev + 1) % statuses.length);
        }, 900);

        return () => {
            clearInterval(timer);
            clearInterval(textTimer);
        };
    }, []);

    const [sessionId] = useState(() => Math.random().toString(36).substring(7).toUpperCase());

    const slideUp = {
        initial: { top: 0 },
        exit: { top: "-100vh", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 } }
    }

    // Split Shutter Animation Variants
    const topPanel = {
        initial: { y: 0 },
        exit: { y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 } }
    };

    const bottomPanel = {
        initial: { y: 0 },
        exit: { y: "100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 } }
    };

    const contentFade = {
        initial: { opacity: 1 },
        exit: { opacity: 0, transition: { duration: 0.3 } }
    };

    return (
        <motion.div
            initial="initial"
            exit="exit"
            className="fixed inset-0 z-[100] flex items-center justify-center cursor-wait pointer-events-none"
        >
            {/* Top Shutter Panel */}
            <motion.div variants={topPanel} className="absolute top-0 left-0 w-full h-[50vh] bg-black border-b border-zinc-900/50 flex flex-col justify-start p-8">
                {/* Background Texture inside panel */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-50" />

                {/* Top HUD Elements */}
                <div className="hidden md:flex justify-between items-start w-full relative z-10">
                    {/* Top Left */}
                    <div className="flex flex-col items-start gap-1">
                        <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">Financial Engine</span>
                        <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">v2.4.0 Limited</span>
                    </div>
                    {/* Top Right */}
                    <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">Bank-Grade Security</span>
                        </div>
                        <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">AES-256 Encrypted</span>
                    </div>
                </div>
            </motion.div>

            {/* Bottom Shutter Panel */}
            <motion.div variants={bottomPanel} className="absolute bottom-0 left-0 w-full h-[50vh] bg-black border-t border-zinc-900/50 flex flex-col justify-end p-8">
                {/* Background Texture inside panel */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-50" />

                {/* Bottom HUD Elements */}
                <div className="hidden md:flex justify-between items-end w-full relative z-10">
                    {/* Bottom Left */}
                    <div className="flex flex-col items-start gap-1">
                        <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">Market Data: Live</span>
                        <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Currency: USD</span>
                    </div>
                    {/* Bottom Right */}
                    <div className="flex flex-col items-end gap-1">
                        <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">Ledger Session</span>
                        <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">#{sessionId}</span>
                    </div>
                </div>
            </motion.div>

            {/* Center Content (Fades out earlier) */}
            <motion.div variants={contentFade} className="relative z-20 flex flex-col items-center w-full max-w-md px-8 text-center">
                {/* Logo Mark Construction */}
                <div className="relative mb-8">
                    <motion.div
                        initial={{ scale: 0, opacity: 0, rotate: -45 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                    >
                        <div className="w-8 h-8 rounded-full border-4 border-black border-t-transparent animate-spin-slow" />
                    </motion.div>
                </div>

                {/* Typography Reveal */}
                <div className="overflow-hidden mb-8">
                    <motion.h1
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
                        className="text-4xl md:text-5xl font-bold text-white tracking-tighter"
                    >
                        ExpenseFlow
                    </motion.h1>
                </div>

                {/* Bottom Status Section */}
                <div className="w-full flex flex-col gap-4">
                    {/* Progress Bar Container */}
                    <div className="w-full h-[2px] bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-white"
                            initial={{ width: "0%" }}
                            animate={{ width: `${count}%` }}
                            transition={{ ease: "linear", duration: 0.1 }} // Updates driven by state, keep smooth
                        />
                    </div>

                    {/* Meta Data */}
                    <div className="flex justify-between items-center text-xs font-mono uppercase text-zinc-500">
                        <span className="w-32 text-left">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={paramIndex}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {statuses[paramIndex]}
                                </motion.span>
                            </AnimatePresence>
                        </span>
                        <span>{Math.floor(count)}%</span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};
