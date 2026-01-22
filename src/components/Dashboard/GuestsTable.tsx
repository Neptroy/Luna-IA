import { Search, MoreHorizontal, Mail, Phone, Calendar } from 'lucide-react';

interface Guest {
    id: string;
    name: string;
    email: string;
    phone: string;
    totalReservations: number;
    lastVisit: string;
}

const guests: Guest[] = [
    { id: '1', name: 'Juan Perez', email: 'juan@example.com', phone: '+52 555 123 4567', totalReservations: 4, lastVisit: '2026-01-10' },
    { id: '2', name: 'Maria Garcia', email: 'maria@example.com', phone: '+52 555 987 6543', totalReservations: 2, lastVisit: '2025-12-20' },
    { id: '3', name: 'Carlos Rodriguez', email: 'carlos@example.com', phone: '+52 555 444 3333', totalReservations: 1, lastVisit: '2026-01-15' },
    { id: '4', name: 'Ana Lopez', email: 'ana@example.com', phone: '+52 555 222 1111', totalReservations: 7, lastVisit: '2026-01-05' },
];

export default function GuestsTable() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">Base de Datos de Huéspedes</h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o teléfono..."
                        className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:border-gold outline-none w-80"
                    />
                </div>
            </div>

            <div className="glass border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-navy/50 border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider font-bold">
                            <th className="px-6 py-5">Huésped</th>
                            <th className="px-6 py-5">Contacto</th>
                            <th className="px-6 py-5 text-center">Reservas Totales</th>
                            <th className="px-6 py-5">Última Visita</th>
                            <th className="px-6 py-5">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {guests.map((guest) => (
                            <tr key={guest.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold border border-gold/20">
                                            {guest.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-white group-hover:text-gold transition-colors">{guest.name}</p>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-tighter">ID: {guest.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <Mail size={12} className="text-gold/50" />
                                            {guest.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <Phone size={12} className="text-gold/50" />
                                            {guest.phone}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs font-bold text-gold">
                                        {guest.totalReservations}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-xs text-gray-300 font-medium">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-gray-600" />
                                        {guest.lastVisit}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-gray-500 hover:text-gold transition-colors">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
