import { useState, useEffect, useRef } from 'react';
import { Search, Send, Phone, Video, MoreVertical, CheckCheck, Bot, Loader2, ChevronLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Message {
    id: string;
    content: string;
    direction: 'inbound' | 'outbound';
    created_at: string;
}

interface Guest {
    id: string;
    name: string;
    phone: string;
    last_message?: string;
    last_message_time?: string;
}

import { useTranslation } from 'react-i18next';

export default function ChatInterface() {
    const { t } = useTranslation();
    const [guests, setGuests] = useState<Guest[]>([]);
    const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchGuests();

        const channel = supabase
            .channel('chat_updates')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
                fetchGuests();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    useEffect(() => {
        if (selectedGuest) {
            fetchMessages(selectedGuest.id);

            const channel = supabase
                .channel(`guest_${selectedGuest.id}`)
                .on('postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'messages', filter: `guest_id=eq.${selectedGuest.id}` },
                    (payload) => {
                        setMessages(prev => [...prev, payload.new as Message]);
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [selectedGuest]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    async function fetchGuests() {
        try {
            const { data, error } = await supabase
                .from('guests')
                .select(`
                    id, 
                    name, 
                    phone,
                    messages (content, created_at)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const formattedGuests = data.map((g) => ({
                id: g.id,
                name: g.name,
                phone: g.phone,
                last_message: g.messages?.[g.messages.length - 1]?.content || '',
                last_message_time: g.messages?.[g.messages.length - 1]?.created_at || ''
            }));

            setGuests(formattedGuests);
        } catch (error) {
            console.error('Error fetching guests:', error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchMessages(guestId: string) {
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('guest_id', guestId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            setMessages(data || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }

    async function handleSendMessage() {
        if (!newMessage.trim() || !selectedGuest || sending) return;

        try {
            setSending(true);
            const { error } = await supabase.from('messages').insert({
                guest_id: selectedGuest.id,
                phone_number: selectedGuest.phone,
                direction: 'outbound',
                content: newMessage
            });

            if (error) throw error;
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            alert(t('common.error') + ': ' + error);
        } finally {
            setSending(false);
        }
    }

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="animate-spin text-gold" size={48} />
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-22rem)] md:h-[75vh] glass rounded-3xl overflow-hidden border border-white/10 animate-fade-in shadow-2xl">
            {/* Chat List - Hide on mobile if a guest is selected */}
            <div className={`${selectedGuest ? 'hidden md:flex' : 'flex'} w-full md:w-80 border-r border-white/10 flex-col bg-navy/20`}>
                <div className="p-4 border-b border-white/10">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder={t('common.search')}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs focus:border-gold outline-none"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {guests.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-xs">{t('guests.empty')}</div>
                    ) : guests.map((guest) => (
                        <button
                            key={guest.id}
                            onClick={() => setSelectedGuest(guest)}
                            className={`w-full p-4 flex gap-3 hover:bg-white/5 transition-all text-left ${selectedGuest?.id === guest.id ? 'bg-white/10' : ''
                                }`}
                        >
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold border border-gold/30">
                                    {(guest.name || 'H').split(' ').map(n => n[0]).join('')}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-sm truncate">{guest.name || t('guests.columns.guest')}</span>
                                    <span className="text-[10px] text-gray-500">
                                        {guest.last_message_time ? new Date(guest.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 truncate">{guest.last_message || t('common.loading')}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Conversation - Show on mobile if a guest is selected */}
            <div className={`${selectedGuest ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-navy/30`}>
                {selectedGuest ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-navy/40">
                            <div className="flex items-center gap-3">
                                <button
                                    className="md:hidden p-2 -ml-2 text-gray-400 hover:text-gold"
                                    onClick={() => setSelectedGuest(null)}
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold border border-gold/30">
                                    {(selectedGuest.name || 'G').split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">{selectedGuest.name}</h3>
                                    <p className="text-[10px] text-green-500">{t('common.active_now')}</p>
                                </div>
                            </div>
                            <div className="hidden sm:flex items-center gap-4 text-gray-400">
                                <Phone size={18} className="hover:text-gold cursor-pointer" />
                                <Video size={18} className="hover:text-gold cursor-pointer" />
                                <MoreVertical size={18} className="hover:text-gold cursor-pointer" />
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar">
                            {messages.map((m) => (
                                <div key={m.id} className={`flex ${m.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] md:max-w-[70%] p-3 md:p-4 shadow-xl rounded-2xl ${m.direction === 'outbound'
                                        ? 'bg-gold/10 border border-gold/20 rounded-tr-none'
                                        : 'bg-white/5 border border-white/10 rounded-tl-none'
                                        }`}>
                                        {m.direction === 'outbound' && (
                                            <div className="flex items-center gap-1 mb-1">
                                                <Bot size={12} className="text-gold" />
                                                <span className="text-[10px] font-bold text-gold uppercase">Luna IA</span>
                                            </div>
                                        )}
                                        <p className="text-sm">{m.content}</p>
                                        <div className="flex justify-end items-center gap-1 mt-2">
                                            <span className="text-[10px] text-gray-500">
                                                {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {m.direction === 'outbound' && <CheckCheck size={14} className="text-gold" />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/10 flex gap-3 md:gap-4 items-center bg-navy/40">
                            <button className="text-gray-400 hover:text-gold transition-colors text-xl">+</button>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder={t('dashboard.sidebar.messages') + "..."}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:border-gold outline-none"
                                />
                            </div>
                            <button
                                onClick={handleSendMessage}
                                disabled={sending}
                                className="bg-gold text-navy p-2.5 rounded-xl hover:bg-gold-light transition-all disabled:opacity-50"
                            >
                                {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-gray-500">
                        <Bot size={64} className="text-gold/20 mb-4" />
                        <p>{t('guests.empty')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
