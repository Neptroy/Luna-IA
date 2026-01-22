import React from 'react';
import { Bot, Calendar, MessageSquare, ShieldCheck, ChevronRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

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
        <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
);

export default function Landing() {
    return (
        <div className="min-h-screen bg-navy text-white selection:bg-gold selection:text-navy">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 glass border-b border-white/10 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center">
                            <Bot className="text-navy" size={24} />
                        </div>
                        <span className="text-2xl font-black tracking-tighter gold-text">LUNA IA</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <a href="#features" className="hover:text-gold transition-colors">Beneficios</a>
                        <a href="#about" className="hover:text-gold transition-colors">Sobre Nosotros</a>
                        <Link to="/auth" className="px-6 py-2.5 bg-gold text-navy rounded-full font-bold hover:bg-gold-light transition-all transform hover:scale-105 active:scale-95">
                            Iniciar Sesión
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-20">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/30 blur-[120px] rounded-full" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-navy-light/30 blur-[120px] rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
                        <Star className="text-gold" size={16} />
                        <span className="text-sm font-semibold tracking-wide text-gold">EL FUTURO DE LA HOSPITALIDAD</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight animate-slide-up">
                        Tu Hotel en <br />
                        <span className="gold-text">Piloto Automático</span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        Luna IA gestiona reservas, responde dudas y coordina el check-in de tus huéspedes a través de WhatsApp, 24/7.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <Link to="/auth" className="w-full sm:w-auto px-8 py-4 bg-gold text-navy rounded-2xl font-bold text-lg hover:bg-gold-light transition-all flex items-center justify-center gap-2 group shadow-lg shadow-gold/20">
                            Empezar Ahora
                            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all">
                            Ver Demo
                        </button>
                    </div>

                    <div className="mt-20 relative px-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        <div className="absolute inset-0 bg-gold/5 blur-[100px] rounded-full" />
                        <div className="relative glass border border-white/10 rounded-3xl p-4 shadow-2xl">
                            <div className="bg-navy rounded-2xl overflow-hidden border border-white/5 aspect-video flex items-center justify-center">
                                <div className="flex flex-col items-center gap-4 text-gray-500">
                                    <Bot size={64} className="opacity-20" />
                                    <p className="font-medium italic">Simulación del Dashboard Luna IA...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 px-6 bg-navy-dark">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Potencia tu Operación</h2>
                        <p className="text-gray-400 max-w-xl mx-auto">Tecnología de vanguardia diseñada para maximizar la satisfacción del huésped.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<MessageSquare size={24} />}
                            title="Reservas por WhatsApp"
                            description="Convierte chats en reservas confirmadas instantáneamente sin intervención humana."
                        />
                        <FeatureCard
                            icon={<Calendar size={24} />}
                            title="Gestión Inteligente"
                            description="Calendario unificado que sincroniza disponibilidad y precios en tiempo real."
                        />
                        <FeatureCard
                            icon={<ShieldCheck size={24} />}
                            title="Seguridad Total"
                            description="Tus datos y los de tus huéspedes están protegidos con los más altos estándares."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/10 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
                            <Bot className="text-navy" size={18} />
                        </div>
                        <span className="text-xl font-black tracking-tighter gold-text">LUNA IA</span>
                    </div>
                    <p className="text-gray-500 text-sm">© 2026 Luna IA Hotel Solutions. Todos los derechos reservados.</p>
                    <div className="flex gap-6 text-gray-400 text-sm">
                        <a href="#" className="hover:text-gold transition-colors">Términos</a>
                        <a href="#" className="hover:text-gold transition-colors">Privacidad</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
