import React, { useState } from 'react';
import {
    Bot,
    MessageSquare,
    Calendar,
    BedDouble,
    Users,
    Settings,
    LogOut,
    Bell,
    Search,
    ChevronLeft,
    Menu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
    collapsed: boolean;
}

const NavItem = ({ icon, label, isActive, onClick, collapsed }: NavItemProps) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
            ? 'bg-gold text-navy font-bold'
            : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
    >
        <div className={`${isActive ? 'text-navy' : 'text-gold group-hover:scale-110 transition-transform'}`}>
            {icon}
        </div>
        {!collapsed && <span className="text-sm truncate">{label}</span>}
    </button>
);

import ChatInterface from '../components/Dashboard/ChatInterface';
import RoomsGrid from '../components/Dashboard/RoomsGrid';
import ReservationsCalendar from '../components/Dashboard/ReservationsCalendar';
import ConfigurationForm from '../components/Dashboard/ConfigurationForm';
import GuestsTable from '../components/Dashboard/GuestsTable';

export default function Dashboard() {
    const { user, signOut } = useAuth();
    const [activeTab, setActiveTab] = useState('mensagens');
    const [collapsed, setCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    const tabs = [
        { id: 'mensagens', label: t('dashboard.sidebar.messages'), icon: <MessageSquare size={20} /> },
        { id: 'reservas', label: t('dashboard.sidebar.reservations'), icon: <Calendar size={20} /> },
        { id: 'quartos', label: t('dashboard.sidebar.rooms'), icon: <BedDouble size={20} /> },
        { id: 'hóspedes', label: t('dashboard.sidebar.guests'), icon: <Users size={20} /> },
        { id: 'config', label: t('dashboard.sidebar.config'), icon: <Settings size={20} /> },
    ];

    return (
        <div className="flex h-screen bg-navy text-white overflow-hidden">
            {/* Sidebar Overlay for Mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed md:relative bg-navy-dark border-r border-white/10 flex flex-col transition-all duration-300 z-50 h-full ${collapsed ? 'w-20' : 'w-64'
                    } ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
            >
                <div className="p-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg shadow-gold/20">
                        <Bot className="text-navy" size={24} />
                    </div>
                    {!collapsed && <span className="text-xl font-black gold-text tracking-tighter">LUNA IA</span>}
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                    {tabs.map((tab) => (
                        <NavItem
                            key={tab.id}
                            {...tab}
                            isActive={activeTab === tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setIsMobileMenuOpen(false);
                            }}
                            collapsed={collapsed}
                        />
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <NavItem
                        icon={<LogOut size={20} />}
                        label={t('dashboard.sidebar.logout')}
                        isActive={false}
                        onClick={handleLogout}
                        collapsed={collapsed}
                    />
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-full mt-4 flex justify-center p-2 text-gray-500 hover:text-gold transition-colors"
                    >
                        {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-20 border-b border-white/10 flex items-center justify-between px-4 md:px-8 bg-navy/50 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden p-2 text-gold hover:bg-white/5 rounded-lg transition-all"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu size={20} />
                        </button>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold capitalize">{activeTab}</h2>
                            <p className="text-[10px] md:text-xs text-gray-500">{t('dashboard.header.subtitle')}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:border-gold outline-none transition-all w-64"
                            />
                        </div>
                        <button className="relative p-2 text-gray-400 hover:text-gold transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-gold rounded-full" />
                        </button>
                        <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/50 flex items-center justify-center text-gold font-bold uppercase overflow-hidden text-xs">
                            {user?.email?.substring(0, 2) || '??'}
                        </div>
                    </div>
                </header>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    {activeTab === 'mensagens' && <ChatInterface />}
                    {activeTab === 'quartos' && <RoomsGrid />}
                    {activeTab === 'reservas' && <ReservationsCalendar />}
                    {activeTab === 'config' && <ConfigurationForm />}
                    {activeTab === 'hóspedes' && <GuestsTable />}
                </div>
            </main>
        </div>
    );
}
