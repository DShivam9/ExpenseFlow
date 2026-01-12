import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Menu, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const navItems = [
    { id: 'features', label: 'Features' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'pricing', label: 'Pricing' }
];

const NavBar = () => {
    const [activeTab, setActiveTab] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'py-4' : 'py-6'}`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`
          relative flex items-center justify-between px-6 py-3 rounded-2xl
          transition-all duration-300
          ${isScrolled ? 'bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/20' : 'bg-transparent border-transparent'}
        `}>

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 z-10 group">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-white/10 group-hover:scale-105 transition-transform">
                            <Wallet className="w-5 h-5 text-black" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">ExpenseFlow</span>
                    </Link>

                    {/* Pill Nav - Desktop */}
                    <div className="hidden md:flex items-center gap-1 bg-white/5 p-1.5 rounded-full border border-white/10 backdrop-blur-md absolute left-1/2 -translate-x-1/2">
                        {navItems.map((item) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                onClick={() => setActiveTab(item.id)}
                                className={`
                  relative px-5 py-2 rounded-full text-sm font-medium transition-colors
                  ${activeTab === item.id ? 'text-black' : 'text-gray-400 hover:text-white'}
                `}
                            >
                                {activeTab === item.id && (
                                    <motion.div
                                        layoutId="pill-nav"
                                        className="absolute inset-0 bg-white rounded-full shadow-lg"
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10">{item.label}</span>
                            </a>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4 z-10">
                        <Link to="/login" className="hidden md:block text-sm font-medium text-gray-400 hover:text-white transition-colors">
                            Sign In
                        </Link>

                        <Link to="/register" className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-zinc-200 transition-colors">
                            Get Started <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                </div>
            </div>
        </motion.nav>
    );
};

export default NavBar;
