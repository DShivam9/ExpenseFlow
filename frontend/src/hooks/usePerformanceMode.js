import { useState, useEffect } from 'react';
import { scheduler } from '../utils/performance/AnimationScheduler';

/**
 * usePerformanceMode
 * 
 * Hook to access the current performance tier and reduced motion preference.
 * Use this to adapt animation intensity (e.g., disable particles on 'low' tier).
 * 
 * @returns {Object} { tier: 'high'|'medium'|'low', reducedMotion: boolean }
 */
export const usePerformanceMode = () => {
    const [tier, setTier] = useState(scheduler.qualityTier);
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        // Initial check
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReducedMotion(mediaQuery.matches);

        // Listen for Tier changes from Scheduler
        const handleTierChange = (e) => {
            setTier(e.detail.tier);
        }

        // Listen for System Preference changes
        const handleMotionChange = (e) => {
            setReducedMotion(e.matches);
        }

        window.addEventListener('performance-tier-change', handleTierChange);
        mediaQuery.addEventListener('change', handleMotionChange);

        return () => {
            window.removeEventListener('performance-tier-change', handleTierChange);
            mediaQuery.removeEventListener('change', handleMotionChange);
        };
    }, []);

    return { tier, reducedMotion };
};
