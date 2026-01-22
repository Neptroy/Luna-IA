import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate login for now
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-navy flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gold/10 blur-[150px] rounded-full" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-navy-light/20 blur-[150px] rounded-full" />

            <div className="w-full max-w-md relative z-10">
                <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center shadow-xl shadow-gold/20">
                        <Bot className="text-navy" size={32} />
                    </div>
                    <h1 className="text-3xl font-black gold-text tracking-tighter">LUNA IA</h1>
                </div>

                <div className="glass border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-2 text-center">
                        {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
                    </h2>
                    <p className="text-gray-400 text-center mb-8 text-sm">
                        {isLogin ? 'Accede a tu panel de control hotelero.' : 'Comienza a automatizar tu hotel hoy mismo.'}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Nombre del Hotel</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Hotel Elegante"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-gold outline-none transition-all"
                                    />
                                </div>
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Correo Electrónico</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="email"
                                    placeholder="tu@email.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-gold outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-gold outline-none transition-all"
                                />
                            </div>
                        </div>

                        <button className="w-full bg-gold text-navy py-4 rounded-xl font-bold text-lg hover:bg-gold-light transition-all flex items-center justify-center gap-2 mt-4">
                            {isLogin ? 'Entrar' : 'Registrarse'}
                            <ArrowRight size={20} />
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-gray-400 text-sm hover:text-gold transition-colors"
                        >
                            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
