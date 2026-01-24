import React from 'react';
import { Bot, Calendar, MessageSquare, ShieldCheck, ChevronRight, Star, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/50 transition-all duration-300 group">
        <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center mb-6 text-gold group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
    </div>
);

export default function Landing() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-navy text-white selection:bg-gold selection:text-navy overflow-x-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 glass border-b border-white/10 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center">
                            <Bot className="text-navy" size={24} />
                        </div>
                        <span className="text-2xl font-black tracking-tighter gold-text">LUNA IA</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <a href="#features" className="hover:text-gold transition-colors">{t('landing.menu.benefits')}</a>
                        <a href="#about" className="hover:text-gold transition-colors">{t('landing.menu.about')}</a>
                        <Link to="/auth" className="px-6 py-2.5 bg-gold text-navy rounded-full font-bold hover:bg-gold-light transition-all transform hover:scale-105 active:scale-95">
                            {t('landing.menu.login')}
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-gold transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <Bot size={28} className="rotate-180 transition-transform" /> : <Menu size={28} />}
                    </button>
                </div>

                {/* Mobile Menu Drawer */}
                <div className={`md:hidden absolute top-full left-0 w-full bg-navy/95 backdrop-blur-xl border-b border-white/10 transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-64 py-6 px-6' : 'max-h-0 py-0 px-6'}`}>
                    <div className="flex flex-col gap-6 font-medium">
                        <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-lg hover:text-gold text-center">{t('landing.menu.benefits')}</a>
                        <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-lg hover:text-gold text-center">{t('landing.menu.about')}</a>
                        <Link to="/auth" className="w-full py-4 bg-gold text-navy rounded-2xl font-bold text-center">
                            {t('landing.menu.login')}
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-screen flex items-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                    <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-gold/20 blur-[150px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-navy-light/30 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
                        <Star className="text-gold" size={16} />
                        <span className="text-sm font-semibold tracking-wide text-gold">{t('landing.hero.badge')}</span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black mb-6 leading-tight animate-slide-up">
                        {t('landing.hero.title_1')} <br />
                        <span className="gold-text">{t('landing.hero.title_2')}</span>
                    </h1>

                    <p className="text-lg md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        {t('landing.hero.subtitle')}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <Link to="/auth" className="w-full sm:w-auto px-10 py-5 bg-gold text-navy rounded-2xl font-bold text-lg hover:bg-gold-light transition-all flex items-center justify-center gap-2 group shadow-xl shadow-gold/20">
                            {t('landing.hero.cta_primary')}
                            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-sm focus:ring-2 focus:ring-gold/50 outline-none">
                            {t('landing.hero.cta_secondary')}
                        </button>
                    </div>

                    <div className="mt-20 relative px-4 animate-fade-in lg:px-20" style={{ animationDelay: '0.4s' }}>
                        <div className="absolute inset-0 bg-gold/10 blur-[120px] rounded-full animate-pulse" />
                        <div className="relative glass border border-white/10 rounded-3xl p-2 sm:p-4 shadow-2xl">
                            <div className="bg-navy-dark rounded-2xl overflow-hidden border border-white/5 aspect-video flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent pointer-events-none" />
                                <div className="flex flex-col items-center gap-4 text-gray-400 relative z-10">
                                    <div className="w-20 h-20 bg-gold/10 rounded-3xl flex items-center justify-center mb-2">
                                        <Bot size={48} className="text-gold animate-bounce" />
                                    </div>
                                    <p className="font-bold text-xl gold-text">Dashboard Interativo</p>
                                    <p className="text-sm italic opacity-60">Otimizando processos em tempo real...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-32 px-6 bg-navy-dark relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-black mb-6">{t('landing.features.title')}</h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">{t('landing.features.subtitle')}</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<MessageSquare size={28} />}
                            title={t('landing.features.whatsapp_title')}
                            description={t('landing.features.whatsapp_desc')}
                        />
                        <FeatureCard
                            icon={<Calendar size={28} />}
                            title={t('landing.features.calendar_title')}
                            description={t('landing.features.calendar_desc')}
                        />
                        <FeatureCard
                            icon={<ShieldCheck size={28} />}
                            title={t('landing.features.security_title')}
                            description={t('landing.features.security_desc')}
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-white/10 px-6 bg-navy">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center">
                                <Bot className="text-navy" size={24} />
                            </div>
                            <span className="text-2xl font-black tracking-tighter gold-text">LUNA IA</span>
                        </div>
                        <p className="text-gray-500 text-sm max-w-xs text-center md:text-left">{t('landing.footer.tagline')}</p>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-6">
                        <div className="flex gap-10 text-gray-400 font-medium whitespace-nowrap overflow-x-auto max-w-full pb-2 no-scrollbar">
                            <a href="#" className="hover:text-gold transition-colors">{t('landing.footer.terms')}</a>
                            <a href="#" className="hover:text-gold transition-colors">{t('landing.footer.privacy')}</a>
                            <a href="#" className="hover:text-gold transition-colors">{t('landing.footer.contact')}</a>
                        </div>
                        <p className="text-gray-600 text-xs">© 2026 Luna IA Hotel Solutions. Built for the future.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
