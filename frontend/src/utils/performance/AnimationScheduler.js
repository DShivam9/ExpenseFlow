/**
 * AnimationScheduler
 * 
 * A centralized controller for managing the application's animation loop.
 * Features:
 * - Single requestAnimationFrame loop
 * - Page Visibility detection (pauses when tab hidden)
 * - FPS Monitoring & Adaptive Quality
 * - Low Power Mode detection
 */

class AnimationScheduler {
    constructor() {
        this.subscribers = new Map();
        this.isRunning = false;
        this.lastFrameTime = 0;
        this.frameId = null;

        // Performance metrics
        this.fps = 60;
        this.frameHistory = [];
        this.qualityTier = 'high'; // 'high' | 'medium' | 'low'
        this.isLowPower = false;

        // Bind methods
        this.loop = this.loop.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);

        this.init();
    }

    init() {
        if (typeof window !== 'undefined') {
            document.addEventListener('visibilitychange', this.handleVisibilityChange);
            this.detectHardware();
            this.start();
        }
    }

    detectHardware() {
        // Simple heuristic for low-power devices
        const concurrency = navigator.hardwareConcurrency || 4;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

        if (concurrency <= 4 || isMobile) {
            this.qualityTier = 'medium';
        }
        if (concurrency <= 2) {
            this.qualityTier = 'low';
            this.isLowPower = true;
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.stop();
        } else {
            this.start();
        }
    }

    /**
     * Subscribe a callback to the animation loop.
     * @param {string} id - Unique identifier
     * @param {Function} callback - Function(deltaTime)
     * @returns {Function} cleanup function
     */
    subscribe(id, callback) {
        this.subscribers.set(id, callback);
        if (!this.isRunning && !document.hidden) {
            this.start();
        }
        return () => this.unsubscribe(id);
    }

    unsubscribe(id) {
        this.subscribers.delete(id);
        if (this.subscribers.size === 0) {
            this.stop();
        }
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastFrameTime = performance.now();
            this.frameId = requestAnimationFrame(this.loop);
        }
    }

    stop() {
        this.isRunning = false;
        if (this.frameId) {
            cancelAnimationFrame(this.frameId);
        }
    }

    loop(timestamp) {
        if (!this.isRunning) return;

        // Calculate delta
        const delta = timestamp - this.lastFrameTime;

        // FPS Monitoring (every 60 frames)
        if (delta > 0) {
            const currentFps = 1000 / delta;
            this.monitorPerformance(currentFps);
        }

        // Run subscribers
        // We catch errors so one bad subscriber doesn't kill the loop
        this.subscribers.forEach((callback, id) => {
            try {
                callback(delta, timestamp);
            } catch (e) {
                console.error(`Animation Error [${id}]:`, e);
                this.unsubscribe(id);
            }
        });

        this.lastFrameTime = timestamp;
        this.frameId = requestAnimationFrame(this.loop);
    }

    monitorPerformance(currentFps) {
        this.frameHistory.push(currentFps);
        if (this.frameHistory.length > 60) {
            const avgFps = this.frameHistory.reduce((a, b) => a + b, 0) / this.frameHistory.length;
            this.frameHistory = [];

            // Downgrade quality if struggling
            if (avgFps < 45 && this.qualityTier === 'high') {
                console.log('Performance Drop Detected: Downgrading to Medium Tier');
                this.qualityTier = 'medium';
                this.notifyQualityChange();
            } else if (avgFps < 30 && this.qualityTier === 'medium') {
                console.log('Performance Drop Detected: Downgrading to Low Tier');
                this.qualityTier = 'low';
                this.notifyQualityChange();
            }
        }
    }

    notifyQualityChange() {
        // Simple event for React components to pick up
        window.dispatchEvent(new CustomEvent('performance-tier-change', {
            detail: { tier: this.qualityTier }
        }));
    }
}

// Singleton export
export const scheduler = new AnimationScheduler();
