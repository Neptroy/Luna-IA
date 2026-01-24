import { useState, useEffect } from 'react';
import { BedDouble, Users, CheckCircle, XCircle, Info, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Room {
    id: string;
    name: string;
    type: string;
    capacity: number;
    price_per_night: number;
    is_available: boolean;
    amenities: string[];
}

import { useTranslation } from 'react-i18next';

export default function RoomsGrid() {
    const { t } = useTranslation();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [currency, setCurrency] = useState('R$');

    useEffect(() => {
        fetchRoomsAndConfig();
    }, []);

    async function fetchRoomsAndConfig() {
        try {
            setLoading(true);

            // Parallel fetch
            const [roomsResponse, configResponse] = await Promise.all([
                supabase.from('rooms').select('*').order('name', { ascending: true }),
                supabase.from('hotel_config').select('currency').limit(1).single()
            ]);

            if (roomsResponse.error) throw roomsResponse.error;
            setRooms(roomsResponse.data || []);

            if (configResponse.data) {
                setCurrency(configResponse.data.currency || 'R$');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="animate-spin text-gold" size={48} />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in pb-10 md:pb-0">
            {rooms.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center p-12 glass border border-white/10 rounded-3xl">
                    <p className="text-gray-500 text-lg">{t('rooms.empty')}</p>
                </div>
            ) : (
                rooms.map((room) => (
                    <div key={room.id} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-gold/30 transition-all group shadow-xl">
                        <div className="h-40 md:h-48 bg-navy-light flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <BedDouble size={48} className="text-gold/20 group-hover:scale-110 transition-transform relative z-10" />
                            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 z-20 ${room.is_available ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                }`}>
                                {room.is_available ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                {room.is_available ? t('rooms.available') : t('rooms.occupied')}
                            </div>
                        </div>
                        <div className="p-5 md:p-6">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-bold text-lg md:text-xl group-hover:text-gold transition-colors">{room.name}</h4>
                                    <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider">{room.type}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-gold font-black text-xl">{currency} {room.price_per_night}</span>
                                    <p className="text-[10px] text-gray-400">{t('rooms.night')}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-gray-400 text-xs my-4">
                                <div className="flex items-center gap-1">
                                    <Users size={14} className="text-gold/50" />
                                    <span>{room.capacity} {t('rooms.people')}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Info size={14} className="text-gold/50" />
                                    <span>{room.amenities.length} {t('rooms.services')}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-1.5 mb-6 min-h-[44px]">
                                {room.amenities.slice(0, 4).map((amenity, idx) => (
                                    <span key={idx} className="bg-white/5 text-[9px] px-2 py-0.5 rounded-md text-gray-400 border border-white/5">
                                        {amenity}
                                    </span>
                                ))}
                                {room.amenities.length > 4 && (
                                    <span className="text-[9px] text-gray-500">+{room.amenities.length - 4} mais</span>
                                )}
                            </div>

                            <button className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${room.is_available
                                ? 'bg-gold text-navy hover:bg-gold-light hover:scale-[1.02] active:scale-[0.98] shadow-gold/10'
                                : 'bg-white/5 text-gray-500 cursor-not-allowed'
                                }`}>
                                {room.is_available ? t('rooms.manage') : t('rooms.details')}
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
