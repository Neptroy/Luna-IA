import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Filter, ChevronLeft, ChevronRight, User, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Reservation {
    id: string;
    status: string;
    check_in_date: string;
    check_out_date: string;
    guests: { name: string };
    rooms: { name: string };
}

import { useTranslation } from 'react-i18next';

export default function ReservationsCalendar() {
    const { t, i18n } = useTranslation();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate] = useState(new Date());

    useEffect(() => {
        fetchReservations();
    }, []);

    async function fetchReservations() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('reservations')
                .select(`
                    id,
                    status,
                    check_in_date,
                    check_out_date,
                    guests (name),
                    rooms (name)
                `)
                .order('check_in_date', { ascending: true });

            if (error) throw error;
            setReservations(data as unknown as Reservation[] || []);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        } finally {
            setLoading(false);
        }
    }

    const currentMonthLabel = currentDate.toLocaleDateString(i18n.language, { month: 'long', year: 'numeric' });
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Generate weekday names based on current locale starting from first day of month
    // Actually the current grid is hardcoded cols-7 starting Sunday. I should dynamically generate them relative to Sunday?
    // The current code hardcodes ['Dom', 'Seg'...] which matches the grid visually.
    // To be proper, let's just use short weekday names in a loop for a reference week.
    // A reference week starting Sunday: 2024-01-07 (Sun) to 2024-01-13 (Sat)
    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(2024, 0, 7 + i); // Jan 7 2024 is Sunday
        return d.toLocaleDateString(i18n.language, { weekday: 'short' });
    });

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="animate-spin text-gold" size={48} />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in pb-10 md:pb-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/5 p-4 md:p-6 rounded-3xl border border-white/10 gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <CalendarIcon className="text-gold" size={24} />
                    <h3 className="text-lg md:text-xl font-bold">{currentMonthLabel}</h3>
                    <div className="flex gap-2 ml-auto md:ml-4">
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-all"><ChevronLeft size={16} /></button>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-all"><ChevronRight size={16} /></button>
                    </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-white/10 rounded-xl hover:bg-white/5 transition-all text-sm">
                        <Filter size={16} />
                        {t('calendar.filter')}
                    </button>
                    <button className="flex-1 md:flex-none bg-gold text-navy px-4 md:px-6 py-2 rounded-xl font-bold hover:bg-gold-light transition-all text-sm">
                        {t('calendar.new')}
                    </button>
                </div>
            </div>

            <div className="glass border border-white/10 rounded-3xl overflow-hidden overflow-x-auto custom-scrollbar">
                <div className="min-w-[700px]">
                    <div className="grid grid-cols-7 border-b border-white/10 bg-navy/50">
                        {weekDays.map(day => (
                            <div key={day} className="py-4 text-center text-xs font-bold text-gray-500 uppercase">{day}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7">
                        {days.map(day => {
                            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const dayReservations = reservations.filter(r => r.check_in_date === dateStr);

                            return (
                                <div key={day} className="h-24 md:h-32 border-r border-b border-white/5 p-2 relative group hover:bg-white/5 transition-all cursor-pointer overflow-y-auto custom-scrollbar">
                                    <span className="text-xs text-gray-500 font-medium">{day}</span>
                                    <div className="mt-2 space-y-1">
                                        {dayReservations.map(res => (
                                            <div key={res.id} className={`text-[8px] md:text-[9px] p-1 md:p-1.5 rounded-lg border flex flex-col gap-0.5 ${res.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                res.status === 'confirmed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                    'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                                }`}>
                                                <span className="font-bold truncate">{res.guests?.name || t('guests.columns.guest')}</span>
                                                <span className="opacity-70 truncate">{res.rooms?.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* List View - Upcoming */}
            <h4 className="font-bold text-gray-400 text-sm pl-2">{t('calendar.upcoming')}</h4>
            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                {reservations.length === 0 ? (
                    <div className="col-span-full p-8 text-center text-gray-500 glass rounded-3xl border border-white/10">
                        {t('calendar.empty_upcoming')}
                    </div>
                ) : (
                    reservations.slice(0, 3).map(res => (
                        <div key={res.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 transition-transform hover:scale-[1.02]">
                            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                                <User size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm truncate">{res.guests?.name || t('guests.columns.guest')}</h4>
                                <p className="text-[10px] text-gray-500 truncate">{res.rooms?.name} • {new Date(res.check_in_date).toLocaleDateString()}</p>
                            </div>
                            <span className={`text-[9px] md:text-[10px] px-2 py-1 rounded-full capitalize ${res.status === 'confirmed' ? 'bg-green-500/20 text-green-500' :
                                res.status === 'checked_in' ? 'bg-blue-500/20 text-blue-500' :
                                    'bg-yellow-500/20 text-yellow-500'
                                }`}>
                                {t(`calendar.status.${res.status}`)}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
