import { useState, useEffect } from 'react';
import { Search, MoreHorizontal, Mail, Phone, Calendar, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Guest {
    id: string;
    name: string;
    email: string;
    phone: string;
    created_at: string;
}

import { useTranslation } from 'react-i18next';

export default function GuestsTable() {
    const { t } = useTranslation();
    const [guests, setGuests] = useState<Guest[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        async function fetchGuests() {
            try {
                setLoading(true);
                let query = supabase
                    .from('guests')
                    .select('*')
                    .order('name', { ascending: true });

                if (search) {
                    query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`);
                }

                const { data, error } = await query;

                if (error) throw error;
                setGuests(data || []);
            } catch (error) {
                console.error('Error fetching guests:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchGuests();
    }, [search]);

    return (
        <div className="space-y-6 animate-fade-in pb-10 md:pb-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h3 className="text-xl md:text-2xl font-bold">{t('guests.title')}</h3>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t('guests.placeholder')}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 md:py-2 pl-10 pr-4 text-sm focus:border-gold outline-none transition-all"
                    />
                </div>
            </div>

            <div className="glass border border-white/10 rounded-3xl overflow-hidden shadow-2xl min-h-[400px] overflow-x-auto custom-scrollbar">
                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="animate-spin text-gold" size={48} />
                    </div>
                ) : (
                    <div className="min-w-[800px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-navy/50 border-b border-white/10 text-gray-400 text-[10px] md:text-xs uppercase tracking-wider font-bold">
                                    <th className="px-6 py-5">{t('guests.columns.guest')}</th>
                                    <th className="px-6 py-5">{t('guests.columns.contact')}</th>
                                    <th className="px-6 py-5">{t('guests.columns.member_since')}</th>
                                    <th className="px-6 py-5">{t('guests.columns.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {guests.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                            <tr>
                                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                                    {t('guests.empty')}
                                                </td>
                                            </tr>
                                        </td>
                                    </tr>
                                ) : (
                                    guests.map((guest) => (
                                        <tr key={guest.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold border border-gold/20">
                                                        {(guest.name || 'G').split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-white group-hover:text-gold transition-colors">{guest.name}</p>
                                                        <p className="text-[10px] text-gray-500 uppercase tracking-tighter">ID: {guest.id.substring(0, 8)}...</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                                        <Mail size={12} className="text-gold/50" />
                                                        {guest.email || 'Não informado'}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                                        <Phone size={12} className="text-gold/50" />
                                                        {guest.phone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-300 font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} className="text-gray-600" />
                                                    {new Date(guest.created_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="text-gray-500 hover:text-gold transition-colors p-2 hover:bg-white/5 rounded-lg">
                                                    <MoreHorizontal size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
