import { Menu, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardHeader = ({ onMenuClick }) => {
    return (
        <header className="fixed top-0 left-0 right-0 z-40 py-4 px-4 lg:hidden">
            <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg">
                {/* Logo */}
                <Link to="/app/dashboard" className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-lg shadow-white/10">
                        <Wallet className="w-4 h-4 text-black" />
                    </div>
                    <span className="text-lg font-bold text-white tracking-tight">ExpenseFlow</span>
                </Link>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={onMenuClick}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                    <Menu className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
};

export default DashboardHeader;
