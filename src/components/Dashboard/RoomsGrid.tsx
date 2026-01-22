import { BedDouble, Users, CheckCircle, XCircle, Info } from 'lucide-react';

interface Room {
    id: string;
    name: string;
    type: string;
    capacity: number;
    price: number;
    available: boolean;
    amenities: string[];
}

const rooms: Room[] = [
    { id: '1', name: 'Suite Presidential 101', type: 'Suite', capacity: 2, price: 450, available: true, amenities: ['Vista al Mar', 'Jacuzzi', 'Mini Bar'] },
    { id: '2', name: 'Deluxe Queen 204', type: 'Deluxe', capacity: 2, price: 280, available: false, amenities: ['Smart TV', 'Escritorio', 'Caja Fuerte'] },
    { id: '3', name: 'Executive Family 305', type: 'Executive', capacity: 4, price: 350, available: true, amenities: ['Cocina', 'Balcón', 'Sofá Cama'] },
    { id: '4', name: 'Standard Twin 105', type: 'Standard', capacity: 2, price: 150, available: true, amenities: ['Wifi', 'Aire Acondicionado'] },
];

export default function RoomsGrid() {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
                <div key={room.id} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-gold/30 transition-all group shadow-xl">
                    <div className="h-48 bg-navy-light flex items-center justify-center relative">
                        <BedDouble size={48} className="text-gold/20 group-hover:scale-110 transition-transform" />
                        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${room.available ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                            }`}>
                            {room.available ? <CheckCircle size={12} /> : <XCircle size={12} />}
                            {room.available ? 'Disponible' : 'Ocupada'}
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-bold text-lg">{room.name}</h4>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">{room.type}</p>
                            </div>
                            <span className="text-gold font-black text-xl">${room.price}<span className="text-xs font-normal text-gray-400">/noche</span></span>
                        </div>

                        <div className="flex items-center gap-4 text-gray-400 text-xs my-4">
                            <div className="flex items-center gap-1">
                                <Users size={14} />
                                <span>{room.capacity} Personas</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Info size={14} />
                                <span>{room.amenities.length} Servicios</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {room.amenities.map((amenity, idx) => (
                                <span key={idx} className="bg-white/5 text-[10px] px-2 py-1 rounded-lg text-gray-400 border border-white/5">
                                    {amenity}
                                </span>
                            ))}
                        </div>

                        <button className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${room.available ? 'bg-gold text-navy hover:bg-gold-light' : 'bg-white/5 text-gray-500 cursor-not-allowed'
                            }`}>
                            {room.available ? 'Editar Habitación' : 'Ver Detalles'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
