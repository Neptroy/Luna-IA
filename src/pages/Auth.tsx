import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Bot, Mail, Lock, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

import { useTranslation } from 'react-i18next';

export default function Auth() {
    const { t } = useTranslation();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hotelName, setHotelName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            hotel_name: hotelName
                        }
                    }
                });
                if (error) throw error;
                alert(t('auth.alert_created'));
            }
            navigate('/dashboard');
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro inesperado';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
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
                        {isLogin ? t('auth.welcome_back') : t('auth.create_account')}
                    </h2>
                    <p className="text-gray-400 text-center mb-8 text-sm">
                        {isLogin ? t('auth.login_subtitle') : t('auth.register_subtitle')}
                    </p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">{t('auth.hotel_name')}</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="text"
                                        required
                                        value={hotelName}
                                        onChange={(e) => setHotelName(e.target.value)}
                                        placeholder={t('auth.hotel_name')}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-gold outline-none transition-all"
                                    />
                                </div>
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">{t('auth.email')}</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t('auth.email')}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-gold outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">{t('auth.password')}</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-gold outline-none transition-all"
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-gold text-navy py-4 rounded-xl font-bold text-lg hover:bg-gold-light transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <>
                                    {isLogin ? t('auth.login_btn') : t('auth.register_btn')}
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-gray-400 text-sm hover:text-gold transition-colors"
                        >
                            {isLogin ? t('auth.toggle_register') : t('auth.toggle_login')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
