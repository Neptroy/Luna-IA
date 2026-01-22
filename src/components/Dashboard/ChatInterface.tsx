import { useState } from 'react';
import { Search, Send, Phone, Video, MoreVertical, CheckCheck, Bot } from 'lucide-react';

interface Chat {
    id: string;
    name: string;
    lastMessage: string;
    time: string;
    unread: number;
    online: boolean;
}

const chats: Chat[] = [
    { id: '1', name: 'Juan Perez', lastMessage: '¿Tienen disponibilidad para mañana?', time: '10:20', unread: 2, online: true },
    { id: '2', name: 'Maria Garcia', lastMessage: 'Gracias por la información.', time: '09:15', unread: 0, online: false },
    { id: '3', name: 'Carlos Rodriguez', lastMessage: 'Confirmado el check-in.', time: 'Ayer', unread: 0, online: false },
];

export default function ChatInterface() {
    const [selectedChat, setSelectedChat] = useState(chats[0]);
    const [message, setMessage] = useState('');

    return (
        <div className="flex h-[75vh] glass rounded-3xl overflow-hidden border border-white/10">
            {/* Chat List */}
            <div className="w-80 border-r border-white/10 flex flex-col bg-navy/20">
                <div className="p-4 border-b border-white/10">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar chats..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs focus:border-gold outline-none"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {chats.map((chat) => (
                        <button
                            key={chat.id}
                            onClick={() => setSelectedChat(chat)}
                            className={`w-full p-4 flex gap-3 hover:bg-white/5 transition-all text-left ${selectedChat.id === chat.id ? 'bg-white/10' : ''
                                }`}
                        >
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold border border-gold/30">
                                    {chat.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                {chat.online && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-navy" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-sm truncate">{chat.name}</span>
                                    <span className="text-[10px] text-gray-500">{chat.time}</span>
                                </div>
                                <p className="text-xs text-gray-400 truncate">{chat.lastMessage}</p>
                            </div>
                            {chat.unread > 0 && (
                                <div className="bg-gold text-navy font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center mt-1">
                                    {chat.unread}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Conversation */}
            <div className="flex-1 flex flex-col bg-navy/30">
                {/* Chat Header */}
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-navy/40">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold border border-gold/30">
                            {selectedChat.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">{selectedChat.name}</h3>
                            <p className="text-[10px] text-green-500">{selectedChat.online ? 'En línea' : 'Desconectado'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-gray-400">
                        <Phone size={18} className="hover:text-gold cursor-pointer" />
                        <Video size={18} className="hover:text-gold cursor-pointer" />
                        <MoreVertical size={18} className="hover:text-gold cursor-pointer" />
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div className="flex flex-col items-center mb-8">
                        <span className="bg-white/5 text-[10px] text-gray-500 px-3 py-1 rounded-full border border-white/10">HOY</span>
                    </div>

                    {/* Inbound */}
                    <div className="flex justify-start">
                        <div className="max-w-[70%] bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-4 shadow-xl">
                            <p className="text-sm">Hola, estoy interesado en reservar una habitación suite para este fin de semana. ¿Tienen disponibilidad?</p>
                            <span className="text-[10px] text-gray-500 mt-2 block text-right">10:15</span>
                        </div>
                    </div>

                    {/* Outbound (Luna IA) */}
                    <div className="flex justify-end">
                        <div className="max-w-[70%] bg-gold/10 border border-gold/20 rounded-2xl rounded-tr-none p-4 shadow-xl">
                            <div className="flex items-center gap-1 mb-1">
                                <Bot size={12} className="text-gold" />
                                <span className="text-[10px] font-bold text-gold">Luna IA</span>
                            </div>
                            <p className="text-sm">¡Hola! Es un placer saludarte. Sí, contamos con disponibilidad en nuestra Suite Executive. El precio por noche es de $250 e incluye desayuno premium. ¿Te gustaría proceder con la reserva?</p>
                            <div className="flex justify-end items-center gap-1 mt-2">
                                <span className="text-[10px] text-gray-500">10:16</span>
                                <CheckCheck size={14} className="text-gold" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/10 flex gap-4 items-center bg-navy/40">
                    <button className="text-gray-400 hover:text-gold transition-colors">+</button>
                    <div className="flex-1">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Escribe un mensaje..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-gold outline-none"
                        />
                    </div>
                    <button className="bg-gold text-navy p-3 rounded-xl hover:bg-gold-light transition-all">
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
