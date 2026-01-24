import { useState, useEffect } from 'react';
import { Save, Globe, Clock, Webhook, Building, Loader2, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface HotelConfig {
    id?: string;
    hotel_name: string;
    address: string;
    timezone: string;
    check_in_time: string;
    check_out_time: string;
    webhook_url: string;
    currency: string;
}

import { useTranslation } from 'react-i18next';

export default function ConfigurationForm() {
    const { t } = useTranslation();
    const [config, setConfig] = useState<HotelConfig>({
        hotel_name: '',
        address: '',
        timezone: 'UTC',
        check_in_time: '15:00',
        check_out_time: '11:00',
        webhook_url: '',
        currency: 'R$'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetchConfig();
    }, []);

    async function fetchConfig() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('hotel_config')
                .select('*')
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') throw error; // PGRST116 is empty result
            if (data) setConfig(data);
        } catch (error) {
            console.error('Error fetching config:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        try {
            setSaving(true);
            const { error } = await supabase
                .from('hotel_config')
                .upsert({ ...config, updated_at: new Date().toISOString() });

            if (error) throw error;
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error('Error saving config:', error);
            alert(t('common.error') + ': ' + error);
        } finally {
            setSaving(false);
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
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-2xl font-bold">{t('config.title')}</h3>
                    <p className="text-sm text-gray-500">{t('config.subtitle')}</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${saved ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-gold text-navy hover:bg-gold-light shadow-gold/20'
                        } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : saved ? <Check size={18} /> : <Save size={18} />}
                    {saved ? t('common.saved') : t('common.save_changes')}
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* General Info */}
                <div className="space-y-6 glass border border-white/10 p-8 rounded-3xl">
                    <div className="flex items-center gap-2 text-gold mb-2 font-bold">
                        <Building size={20} />
                        <h4>{t('config.general_info')}</h4>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">{t('auth.hotel_name')}</label>
                        <input
                            type="text"
                            value={config.hotel_name}
                            onChange={(e) => setConfig({ ...config, hotel_name: e.target.value })}
                            className="w-full bg-navy/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-gold outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">{t('config.address')}</label>
                        <input
                            type="text"
                            value={config.address}
                            onChange={(e) => setConfig({ ...config, address: e.target.value })}
                            className="w-full bg-navy/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-gold outline-none transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">{t('config.currency')}</label>
                            <select
                                value={config.currency || 'R$'}
                                onChange={(e) => setConfig({ ...config, currency: e.target.value })}
                                className="w-full bg-navy/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-gold outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value="R$">Real Brasileiro (R$)</option>
                                <option value="USD">Dólar Americano ($)</option>
                                <option value="EUR">Euro (€)</option>
                                <option value="MXN">Peso Mexicano ($)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">{t('config.timezone')}</label>
                            <select
                                value={config.timezone}
                                onChange={(e) => setConfig({ ...config, timezone: e.target.value })}
                                className="w-full bg-navy/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-gold outline-none transition-all appearance-none cursor-pointer"
                            >
                                <optgroup label="América" className="bg-navy-dark text-white">
                                    <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                                    <option value="America/Argentina/Buenos_Aires">Buenos Aires (GMT-3)</option>
                                    <option value="America/Bogota">Bogotá (GMT-5)</option>
                                    <option value="America/Lima">Lima (GMT-5)</option>
                                    <option value="America/Mexico_City">Cidade do México (GMT-6)</option>
                                    <option value="America/New_York">Nova York (GMT-5)</option>
                                </optgroup>
                                <optgroup label="Europa" className="bg-navy-dark text-white">
                                    <option value="Europe/Lisbon">Lisboa (GMT+0)</option>
                                    <option value="Europe/Madrid">Madri (GMT+1)</option>
                                    <option value="Europe/Paris">Paris (GMT+1)</option>
                                </optgroup>
                                <optgroup label="Outros" className="bg-navy-dark text-white">
                                    <option value="UTC">UTC (Tempo Universal Coordenado)</option>
                                </optgroup>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Check-in</label>
                            <input
                                type="time"
                                value={config.check_in_time}
                                onChange={(e) => setConfig({ ...config, check_in_time: e.target.value })}
                                className="w-full bg-navy/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-gold outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Check-out</label>
                            <input
                                type="time"
                                value={config.check_out_time}
                                onChange={(e) => setConfig({ ...config, check_out_time: e.target.value })}
                                className="w-full bg-navy/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-gold outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Technical Config */}
                <div className="space-y-6 glass border border-white/10 p-8 rounded-3xl">
                    <div className="flex items-center gap-2 text-gold mb-2 font-bold">
                        <Globe size={20} />
                        <h4>{t('config.technical_config')}</h4>
                    </div>

                    {/* Timezone selector was moved to General Info to allow Currency next to it. Removed from here. */}

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center justify-between">
                            Twilio Webhook URL
                            <Webhook size={14} className="text-gray-600" />
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                readOnly
                                value={`https://elzkjqyjdphznfzqxjtk.supabase.co/functions/v1/twilio-webhook-whatsapp`}
                                className="w-full bg-white/5 border border-dashed border-white/10 rounded-xl py-3 px-4 text-gray-500 text-xs select-all outline-none"
                            />
                        </div>
                        <p className="text-[10px] text-gray-500 italic uppercase">Copie esta URL no seu console Twilio para conectar Luna IA.</p>
                    </div>

                    <div className="p-4 bg-gold/5 border border-gold/10 rounded-2xl">
                        <div className="flex gap-3">
                            <Clock className="text-gold flex-shrink-0" size={18} />
                            <p className="text-xs text-gray-400 leading-relaxed">
                                <span className="text-gold font-bold">Automação de Lembretes:</span> {t('config.automation_note')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
