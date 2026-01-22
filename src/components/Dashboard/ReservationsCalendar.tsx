import { Calendar as CalendarIcon, Filter, ChevronLeft, ChevronRight, User } from 'lucide-react';

interface Reservation {
    id: string;
    guest: string;
    room: string;
    checkIn: string;
    checkOut: string;
    status: 'confirmed' | 'pending' | 'checked_in';
}

const reservations: Reservation[] = [
    { id: '101', guest: 'Juan Perez', room: 'Suite 101', checkIn: '2026-01-22', checkOut: '2026-01-25', status: 'confirmed' },
    { id: '102', guest: 'Maria Garcia', room: 'Deluxe 204', checkIn: '2026-01-23', checkOut: '2026-01-24', status: 'checked_in' },
    { id: '103', guest: 'Carlos Rodriguez', room: 'Exec 305', checkIn: '2026-01-21', checkOut: '2026-01-22', status: 'pending' },
];

export default function ReservationsCalendar() {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const currentMonth = "Enero 2026";

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/10">
                <div className="flex items-center gap-4">
                    <CalendarIcon className="text-gold" size={24} />
                    <h3 className="text-xl font-bold">{currentMonth}</h3>
                    <div className="flex gap-2 ml-4">
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-all"><ChevronLeft size={16} /></button>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-all"><ChevronRight size={16} /></button>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-xl hover:bg-white/5 transition-all text-sm">
                        <Filter size={16} />
                        Filtrar
                    </button>
                    <button className="bg-gold text-navy px-6 py-2 rounded-xl font-bold hover:bg-gold-light transition-all text-sm">
                        Nueva Reserva
                    </button>
                </div>
            </div>

            <div className="glass border border-white/10 rounded-3xl overflow-hidden">
                <div className="grid grid-cols-7 border-b border-white/10 bg-navy/50">
                    {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                        <div key={day} className="py-4 text-center text-xs font-bold text-gray-500 uppercase">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7">
                    {days.map(day => {
                        const hasRes = day === 22 || day === 23 || day === 21;
                        return (
                            <div key={day} className="h-32 border-r border-b border-white/5 p-2 relative group hover:bg-white/5 transition-all cursor-pointer">
                                <span className="text-xs text-gray-500 font-medium">{day}</span>
                                {hasRes && (
                                    <div className="mt-2 space-y-1">
                                        <div className={`text-[10px] p-1.5 rounded-lg border flex flex-col gap-0.5 ${day === 21 ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                day === 22 ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                    'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                            }`}>
                                            <span className="font-bold truncate">Juan Perez</span>
                                            <span className="opacity-70">Suite 101</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Mini List */}
            <div className="grid md:grid-cols-3 gap-6">
                {reservations.map(res => (
                    <div key={res.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                            <User size={20} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm">{res.guest}</h4>
                            <p className="text-[10px] text-gray-500">{res.room} • {res.checkIn}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-1 rounded-full ${res.status === 'confirmed' ? 'bg-green-500/20 text-green-500' :
                                res.status === 'checked_in' ? 'bg-blue-500/20 text-blue-500' :
                                    'bg-yellow-500/20 text-yellow-500'
                            }`}>
                            {res.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
