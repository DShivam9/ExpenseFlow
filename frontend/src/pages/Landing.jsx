import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import ShinyText from '../components/common/ShinyText'
import SpotlightCard from '../components/common/SpotlightCard'
import TiltedCard, { TiltedContent } from '../components/common/TiltedCard'
import Navbar from '../components/layout/Navbar'
import ScrollFloat from '../components/common/ScrollFloat'
import ScrollVelocity from '../components/common/ScrollVelocity'
import VariableProximity from '../components/common/VariableProximity'
import DashboardPreview from '../components/common/DashboardPreview'


import {
    Wallet,
    PieChart,
    TrendingUp,
    Shield,
    Smartphone,
    Zap,
    ArrowRight,
    Check,
    Sparkles,
    Star,
    Users,
    CreditCard
} from 'lucide-react'

// ============ ANIMATION VARIANTS ============
const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
}

const fadeInScale = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
}

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
}

// ============ SUB-COMPONENTS ============

const AnimatedCounter = ({ target, duration = 2, suffix = '' }) => {
    const [count, setCount] = useState(0)
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

    useEffect(() => {
        if (!isInView) return
        let start = 0
        const end = parseInt(target)
        const stepTime = Math.max(Math.floor(duration * 1000 / end), 10)

        const timer = setInterval(() => {
            start += 1
            setCount(start)
            if (start >= end) clearInterval(timer)
        }, stepTime)

        return () => clearInterval(timer)
    }, [isInView, target, duration])

    return <span ref={ref}>{count}{suffix}</span>
}

const GlowOrb = ({ className, delay = 0, color = 'white' }) => (
    <motion.div
        className={`absolute rounded-full blur-3xl ${className}`}
        style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)'
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, delay, ease: "easeInOut" }}
    />
)

const FeatureCard = ({ feature, index }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })

    return (
        <motion.div
            ref={ref}
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="h-full"
        >
            <TiltedCard
                containerHeight="100%"
                containerWidth="100%"
                rotateAmplitude={8}
                scaleOnHover={1.02}
                className="h-full"
            >
                {/* Card Background & Border */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl group-hover:border-white/20 transition-colors" />

                {/* Content */}
                <div className="relative p-8 h-full flex flex-col justify-between">
                    <div>
                        <TiltedContent translateZ={40}>
                            <div className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center 
                                      bg-white/5 border border-white/10 group-hover:bg-white/10 
                                      group-hover:text-white text-white/70 transition-all duration-300">
                                <feature.icon className="w-7 h-7" />
                            </div>
                        </TiltedContent>

                        <TiltedContent translateZ={20}>
                            <h3 className="text-xl font-semibold text-white mb-3">
                                {feature.title}
                            </h3>
                        </TiltedContent>

                        <TiltedContent translateZ={15}>
                            <p className="text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                                {feature.description}
                            </p>
                        </TiltedContent>
                    </div>

                    {/* Decorative Gradient Blob */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[60px] rounded-full pointer-events-none -z-10 group-hover:bg-purple-500/20 transition-colors duration-500" />
                </div>
            </TiltedCard>
        </motion.div>
    )
}

const PricingCard = ({ plan, index }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

    return (
        <motion.div
            ref={ref}
            variants={fadeInScale}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            whileHover={{ y: -10 }}
            className={`relative p-8 rounded-2xl border backdrop-blur-xl overflow-hidden
                ${plan.popular
                    ? 'bg-white/5 border-white/20 shadow-2xl shadow-white/5'
                    : 'bg-transparent border-white/10 hover:border-white/20'
                }`}
        >
            {plan.popular && (
                <motion.div
                    className="absolute -top-1 left-1/2 -translate-x-1/2"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="px-4 py-1.5 rounded-full bg-white text-black text-sm font-bold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        Most Popular
                    </div>
                </motion.div>
            )}

            <div className={plan.popular ? 'mt-4' : ''}>
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

                <div className="mb-8">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400">{plan.period}</span>
                </div>

                <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, j) => (
                        <motion.li
                            key={j}
                            className="flex items-center gap-3 text-gray-300"
                            initial={{ opacity: 0, x: -20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 0.3 + j * 0.1 }}
                        >
                            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                <Check className="w-3 h-3 text-white" />
                            </div>
                            {feature}
                        </motion.li>
                    ))}
                </ul>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                        to="/register"
                        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium transition-all duration-300 ${plan.popular
                            ? 'bg-white text-black hover:bg-gray-100'
                            : 'bg-white/10 text-white border border-white/10 hover:bg-white/20'
                            }`}
                    >
                        {plan.cta}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        </motion.div>
    )
}

// ============ DATA ============
const features = [
    { icon: PieChart, title: 'Visual Analytics', description: 'Beautiful interactive charts to understand your spending at a glance.' },
    { icon: TrendingUp, title: 'Smart Budgeting', description: 'Set intelligent budgets and receive proactive alerts before overspending.' },
    { icon: Shield, title: 'Bank-Level Security', description: 'Your data is encrypted with 256-bit SSL and never shared.' },
    { icon: Smartphone, title: 'Mobile First', description: 'Access your finances anywhere with our responsive design.' },
    { icon: Zap, title: 'Real-time Sync', description: 'See spending updates instantly with live dashboard.' },
    { icon: Wallet, title: 'Smart Categories', description: '12+ intelligent expense categories with custom tagging.' }
]

const pricingPlans = [
    { name: 'Free', price: '$0', period: ' forever', description: 'Perfect for personal use', features: ['Unlimited expense tracking', 'Basic analytics', '5 categories', 'Mobile access', '30-day history'], cta: 'Start Free', popular: false },
    { name: 'Pro', price: '$9', period: '/month', description: 'For power users & families', features: ['Everything in Free', 'Advanced AI analytics', 'Unlimited budgets', 'Export to CSV/PDF', 'Priority support'], cta: 'Start 14-Day Trial', popular: true }
]

const testimonials = [
    { name: 'Sarah K.', role: 'Freelancer', text: 'Finally an expense tracker that doesn\'t feel like a spreadsheet!' },
    { name: 'Mike R.', role: 'Startup Founder', text: 'The budgeting alerts saved me from overspending multiple times.' },
    { name: 'Lisa M.', role: 'Designer', text: 'Beautiful UI and incredibly intuitive. Love the dark mode!' },
    { name: 'John D.', role: 'Developer', text: 'Clean design and powerful features. Exactly what I needed.' },
    { name: 'Emma W.', role: 'Consultant', text: 'The analytics helped me understand where every dollar goes.' },
]

const marqueeLogos = [
    'TechCrunch', 'Forbes', 'Wired', 'Bloomberg', 'FastCompany', 'Inc.', 'Mashable', 'TheVerge'
]

// ============ MAIN LANDING COMPONENT ============
const Landing = () => {
    const { scrollYProgress } = useScroll()
    const heroRef = useRef(null)
    const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

    return (
        <div className="min-h-screen bg-transparent overflow-hidden">

            {/* Background Glow Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <GlowOrb className="w-[800px] h-[800px] -top-60 -right-60" color="white" delay={0} />
                <GlowOrb className="w-[600px] h-[600px] top-1/3 -left-60" color="white" delay={2} />
                <GlowOrb className="w-[500px] h-[500px] bottom-20 right-1/4" color="white" delay={4} />

                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px'
                    }} />
            </div>

            {/* Navigation (New Components) */}
            <Navbar />

            {/* Hero Section */}
            <section ref={heroRef} className="relative pt-24 md:pt-32 pb-32 px-4 overflow-hidden">
                <motion.div className="max-w-5xl mx-auto text-center" style={{ opacity }}>
                    {/* Badge */}


                    {/* Hero Title (Split Scroll Animation) */}
                    <div className="mb-8">
                        <ScrollFloat
                            animationDuration={1.2}
                            ease='back.out(2)'
                            className="text-4xl sm:text-5xl font-medium tracking-tight text-white/50 mb-4 justify-center"
                        >
                            Take Control of Your
                        </ScrollFloat>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight mt-2">
                            <ShinyText
                                text="Financial Future"
                                speed={3}
                                className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-white"
                            />
                        </h1>
                    </div>

                    <motion.p
                        className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        Track expenses, set smart budgets, and gain powerful insights into your spending habits. Start your journey to financial freedom today.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                to="/register"
                                className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-lg bg-white text-black hover:bg-zinc-200 transition-colors shadow-lg shadow-white/10"
                            >
                                Start Free Today
                                <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                    <ArrowRight className="w-5 h-5" />
                                </motion.span>
                            </Link>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                to="/login"
                                className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-lg text-white border border-white/20 hover:bg-white/5 transition-colors"
                            >
                                <Users className="w-5 h-5" />
                                See Dashboard
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Dashboard Preview (Replaces Static Images) */}
                    <motion.div
                        className="relative w-full max-w-6xl mx-auto px-4"
                        initial={{ opacity: 0, y: 50, rotateX: 20, scale: 0.9 }}
                        whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        viewport={{ once: true, margin: "-100px" }}
                        style={{ perspective: "1000px" }}
                    >
                        <DashboardPreview />

                        {/* Glow effect under dashboard */}
                        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[90%] h-20 bg-white/20 blur-[100px] -z-10 rounded-full" />
                    </motion.div>

                </motion.div>
            </section>

            {/* Scroll Velocity Marquee */}
            <section className="py-16 overflow-hidden border-y border-white/5 bg-white/[0.02]">
                <div className="mb-10 text-center">
                    <p className="text-gray-500 text-xs uppercase tracking-[0.2em]">Trusted by finance teams at</p>
                </div>
                <ScrollVelocity baseVelocity={-2} className="py-4">
                    {marqueeLogos.map((logo, i) => (
                        <div key={i} className="flex-shrink-0 px-8">
                            <span className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white/40 to-white/10 select-none">
                                {logo}
                            </span>
                        </div>
                    ))}
                </ScrollVelocity>
            </section>

            {/* Stats Section */}
            <section className="py-20 px-4">
                <motion.div
                    className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {[
                        { value: 10, suffix: 'K+', label: 'Active Users', icon: Users },
                        { value: 5, suffix: 'M+', label: 'Tracked', icon: CreditCard },
                        { value: 99, suffix: '.9%', label: 'Uptime', icon: Zap },
                        { value: 4, suffix: '.9★', label: 'Rating', icon: Star }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            variants={fadeInUp}
                            className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all group"
                            whileHover={{ scale: 1.05, y: -5 }}
                        >
                            <stat.icon className="w-8 h-8 mx-auto mb-4 text-white group-hover:text-zinc-300 transition-colors" />
                            <p className="text-4xl md:text-5xl font-bold text-white">
                                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                            </p>
                            <p className="text-gray-400 mt-2">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-sm font-medium mb-4">
                            Powerful Features
                        </span>
                        <div className="flex justify-center">
                            <ScrollFloat
                                animationDuration={1}
                                ease='back.out(2)'
                                scrollStart={0.2}
                                scrollEnd={0.6}
                                className="text-4xl sm:text-5xl font-bold text-white justify-center"
                            >
                                Everything You Need
                            </ScrollFloat>
                        </div>
                        <h2 className="text-xl text-gray-400 mt-4 max-w-2xl mx-auto">
                            Powerful features designed to help you understand and optimize your spending habits.
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <FeatureCard key={i} feature={feature} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Marquee */}
            <section id="testimonials" className="py-24 px-4 overflow-hidden">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="flex justify-center">
                        <ScrollFloat
                            animationDuration={1}
                            ease='back.out(2)'
                            scrollStart={0.2}
                            scrollEnd={0.6}
                            className="text-4xl sm:text-5xl font-bold text-white justify-center"
                        >
                            Loved by Thousands
                        </ScrollFloat>
                    </div>
                    <p className="text-gray-400 mt-4">See what our users are saying</p>
                </motion.div>

                {/* Reusing ScrollVelocity for Testimonials too, but slower */}
                <ScrollVelocity baseVelocity={1} className="py-4">
                    {testimonials.map((t, i) => (
                        <div key={i} className="flex-shrink-0 w-80 p-6 rounded-2xl bg-white/5 border border-white/10 mx-4">
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, j) => (
                                    <Star key={j} className="w-4 h-4 fill-white text-white" />
                                ))}
                            </div>
                            <p className="text-gray-300 mb-4 italic truncate">"{t.text}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-semibold">
                                    {t.name[0]}
                                </div>
                                <div>
                                    <p className="text-white font-medium text-sm">{t.name}</p>
                                    <p className="text-gray-500 text-xs">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </ScrollVelocity>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 px-4">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/30 text-white text-sm font-medium mb-4">
                            Simple Pricing
                        </span>
                        <div className="flex justify-center">
                            <ScrollFloat
                                animationDuration={1}
                                ease='back.out(2)'
                                scrollStart={0.2}
                                scrollEnd={0.6}
                                className="text-4xl sm:text-5xl font-bold text-white justify-center"
                            >
                                Start Free, Upgrade Anytime
                            </ScrollFloat>
                        </div>
                        <p className="text-gray-400 text-lg mt-4">No hidden fees. No surprises. Cancel anytime.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {pricingPlans.map((plan, i) => (
                            <PricingCard key={i} plan={plan} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4">
                <motion.div
                    className="max-w-4xl mx-auto"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    <div className="relative overflow-hidden rounded-3xl p-12 md:p-16 text-center border border-white/20">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-zinc-500/10 to-white/10" />
                        <div className="absolute inset-0 bg-black/60" />

                        <div className="relative z-10">
                            {/* Variable Proximity Animation on Heading */}
                            <div className="flex justify-center mb-4">
                                <VariableProximity
                                    label="Ready to Transform Your Finances?"
                                    className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center"
                                />
                            </div>

                            <p className="text-gray-300 mb-10 max-w-xl mx-auto text-lg">
                                Join thousands building better financial habits today.
                            </p>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    to="/register"
                                    className="inline-flex items-center gap-2 px-10 py-4 bg-white text-black rounded-2xl font-bold text-lg shadow-2xl hover:bg-gray-100 transition-colors"
                                >
                                    Get Started for Free
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </section>


            {/* Footer */}
            <footer className="border-t border-white/10 py-12 px-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.02 }}>
                        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-black" />
                        </div>
                        <span className="text-lg font-bold text-white">ExpenseFlow</span>
                    </motion.div>

                    <p className="text-gray-500 text-sm">© 2025 ExpenseFlow. All rights reserved.</p>

                    <div className="flex items-center gap-8">
                        {['Privacy', 'Terms', 'Contact'].map((item) => (
                            <motion.a key={item} href="#" className="text-gray-500 hover:text-white transition-colors text-sm" whileHover={{ y: -2 }}>
                                {item}
                            </motion.a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Landing
