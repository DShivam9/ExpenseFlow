import { motion } from 'framer-motion';
import {
    MoreVertical,
    TrendingUp,
    TrendingDown,
    DollarSign,
    CreditCard,
    Activity,
    ArrowUpRight,
    Search,
    Bell
} from 'lucide-react';

const Card = ({ children, className = "" }) => (
    <div className={`bg-[#0A0A0B] border border-white/5 rounded-2xl p-5 ${className}`}>
        {children}
    </div>
);

const ChartBar = ({ height, delay }) => (
    <motion.div
        className="w-full bg-white/5 rounded-t-sm hover:bg-white/10 transition-colors relative group"
        initial={{ height: 0 }}
        animate={{ height: `${height}%` }}
        transition={{ duration: 1.5, delay, ease: "easeOut" }}
    >
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black text-[10px] font-bold px-2 py-1 rounded">
            ${height * 100}
        </div>
    </motion.div>
);

const TransactionItem = ({ icon: Icon, title, date, amount, type, delay }) => (
    <motion.div
        className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.5 }}
    >
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${type === 'income' ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-white'}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-white text-sm font-medium">{title}</p>
                <p className="text-gray-500 text-xs">{date}</p>
            </div>
        </div>
        <span className={`font-semibold ${type === 'income' ? 'text-green-400' : 'text-white'}`}>
            {type === 'income' ? '+' : '-'}${amount}
        </span>
    </motion.div>
);

const DashboardPreview = () => {
    return (
        <div className="relative w-full max-w-5xl mx-auto aspect-[16/10] md:aspect-[16/9] bg-[#030303] rounded-3xl border border-white/10 shadow-2xl overflow-hidden select-none">
            {/* Window Controls */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-white/[0.02] border-b border-white/5 flex items-center px-4 gap-2">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <div className="mx-auto w-1/3 h-6 bg-white/5 rounded-full flex items-center px-3 opacity-50">
                    <Search className="w-3 h-3 text-gray-400 mr-2" />
                    <div className="w-20 h-2 bg-white/10 rounded-full" />
                </div>
                <Bell className="w-4 h-4 text-gray-500" />
            </div>

            {/* Sidebar Mock */}
            <div className="absolute top-12 left-0 bottom-0 w-16 md:w-64 border-r border-white/5 hidden md:flex flex-col p-4 bg-[#050505]">
                <div className="flex items-center gap-3 mb-8 px-2">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-black" />
                    </div>
                    <div className="h-4 w-24 bg-white/10 rounded" />
                </div>
                <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={`h-10 rounded-lg w-full flex items-center px-3 gap-3 ${i === 1 ? 'bg-white/10' : 'opacity-40'}`}>
                            <div className="w-5 h-5 bg-white/20 rounded" />
                            <div className="h-3 w-20 bg-white/10 rounded" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="absolute top-12 left-0 md:left-64 right-0 bottom-0 p-6 md:p-8 overflow-hidden bg-gradient-to-br from-[#050505] to-black">
                {/* Header Mock */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <div className="h-6 w-48 bg-white/10 rounded mb-2" />
                        <div className="h-4 w-32 bg-white/5 rounded" />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500" />
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-3 gap-6 h-full">
                    {/* Main Chart Area */}
                    <Card className="col-span-3 lg:col-span-2 h-[300px] flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-gray-400 text-sm">Total Balance</p>
                                <h3 className="text-3xl font-bold text-white mt-1">$24,562.00</h3>
                                <div className="flex items-center gap-1 text-green-400 text-sm mt-1">
                                    <TrendingUp className="w-3 h-3" />
                                    <span>+12.5% this month</span>
                                </div>
                            </div>
                            <div className="p-2 bg-white/5 rounded-lg text-gray-400">
                                <MoreVertical className="w-4 h-4" />
                            </div>
                        </div>

                        {/* Animated Bars */}
                        <div className="flex-1 flex items-end gap-3 px-2 pb-2">
                            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                                <ChartBar key={i} height={h} delay={0.5 + (i * 0.1)} />
                            ))}
                        </div>
                    </Card>

                    {/* Right Column Cards */}
                    <div className="col-span-3 lg:col-span-1 space-y-6">
                        {/* Quick Transfer Mock */}
                        <Card className="h-[140px] relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-white font-medium">My Cards</p>
                                <ArrowUpRight className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-black rounded-xl border border-white/10 p-4 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-50">
                                    <div className="w-8 h-8 rounded-full bg-white/20" />
                                </div>
                                <div className="mt-8">
                                    <p className="text-xs text-gray-400">Balance</p>
                                    <p className="text-lg font-bold text-white">**** 4289</p>
                                </div>
                            </div>
                        </Card>

                        {/* Recent Transactions */}
                        <Card className="flex-1">
                            <p className="text-gray-400 text-sm mb-4">Recent Activity</p>
                            <div className="space-y-1">
                                <TransactionItem
                                    icon={Activity}
                                    title="Netflix Subscription"
                                    date="Today, 10:00 AM"
                                    amount="15.00"
                                    type="expense"
                                    delay={1.2}
                                />
                                <TransactionItem
                                    icon={TrendingUp}
                                    title="Freelance Payment"
                                    date="Yesterday, 4:30 PM"
                                    amount="1,250.00"
                                    type="income"
                                    delay={1.4}
                                />
                                <TransactionItem
                                    icon={CreditCard}
                                    title="Grocery Store"
                                    date="Oct 24, 7:00 PM"
                                    amount="82.40"
                                    type="expense"
                                    delay={1.6}
                                />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Overlaid Floating Elements */}
            <motion.div
                className="absolute bottom-10 left-10 md:left-72 bg-white rounded-2xl p-4 shadow-xl z-20 flex gap-4 items-center"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2, duration: 1, type: "spring" }}
            >
                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                    <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Savings Goal</p>
                    <p className="text-lg font-bold text-black">82% Reached</p>
                </div>
            </motion.div>
        </div>
    );
};

export default DashboardPreview;
