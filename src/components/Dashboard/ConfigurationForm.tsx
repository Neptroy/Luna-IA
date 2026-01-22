import { Save, Globe, Clock, Webhook, Building } from 'lucide-react';

export default function ConfigurationForm() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-2xl font-bold">Configuración del Hotel</h3>
                    <p className="text-sm text-gray-500">Administra los datos públicos y técnicos de tu propiedad.</p>
                </div>
                <button className="flex items-center gap-2 bg-gold text-navy px-8 py-3 rounded-xl font-bold hover:bg-gold-light transition-all shadow-lg shadow-gold/20">
                    <Save size={18} />
                    Guardar Cambios
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* General Info */}
                <div className="space-y-6 glass border border-white/10 p-8 rounded-3xl">
                    <div className="flex items-center gap-2 text-gold mb-2 font-bold">
                        <Building size={20} />
                        <h4>Información General</h4>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Nombre del Hotel</label>
                        <input type="text" defaultValue="Hotel Elegante" className="w-full bg-navy/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-gold outline-none transition-all" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Dirección Física</label>
                        <input type="text" defaultValue="Av. Central 123, Ciudad de México" className="w-full bg-navy/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-gold outline-none transition-all" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Check-in</label>
                            <input type="time" defaultValue="15:00" className="w-full bg-navy/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-gold outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Check-out</label>
                            <input type="time" defaultValue="11:00" className="w-full bg-navy/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-gold outline-none transition-all" />
                        </div>
                    </div>
                </div>

                {/* Technical Config */}
                <div className="space-y-6 glass border border-white/10 p-8 rounded-3xl">
                    <div className="flex items-center gap-2 text-gold mb-2 font-bold">
                        <Globe size={20} />
                        <h4>Configuración Técnica</h4>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Zona Horaria</label>
                        <select className="w-full bg-navy/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-gold outline-none transition-all appearance-none">
                            <option>America/Mexico_City (GMT-6)</option>
                            <option>UTC</option>
                            <option>Europe/Madrid (GMT+1)</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center justify-between">
                            Twilio Webhook URL
                            <Webhook size={14} className="text-gray-600" />
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                readOnly
                                value="https://prj-ref.supabase.co/functions/v1/twilio"
                                className="w-full bg-white/5 border border-dashed border-white/10 rounded-xl py-3 px-4 text-gray-500 text-sm select-all outline-none"
                            />
                        </div>
                        <p className="text-[10px] text-gray-500 italic">Copia esta URL en tu consola de Twilio para conectar Luna IA.</p>
                    </div>

                    <div className="p-4 bg-gold/5 border border-gold/10 rounded-2xl">
                        <div className="flex gap-3">
                            <Clock className="text-gold flex-shrink-0" size={18} />
                            <p className="text-xs text-gray-400 leading-relaxed">
                                <span className="text-gold font-bold">Automatización de Recordatorios:</span> Luna IA enviará mensajes automáticos de bienvenida 24 horas antes del check-in.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
