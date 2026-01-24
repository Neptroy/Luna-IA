import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { OpenAI } from "https://esm.sh/openai@4.24.1";

const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const openai = new OpenAI({
    apiKey: Deno.env.get('OPENAI_API_KEY') ?? '',
});

function normalizePhone(phone: string): string {
    return phone.replace('whatsapp:', '').trim();
}

Deno.serve(async (req: Request) => {
    try {
        console.log("=== Incoming Webhook Request ===");

        let from = '';
        let body = '';

        // Handle both JSON and Form Data
        const contentType = req.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            const data = await req.json();
            from = data.From || '';
            body = data.Body || '';
        } else {
            const formData = await req.formData();
            from = formData.get('From')?.toString() ?? '';
            body = formData.get('Body')?.toString() ?? '';
        }

        if (!from || !body) {
            console.error("Missing From or Body");
            return new Response('Missing From or Body', { status: 400 });
        }

        const cleanPhone = normalizePhone(from);
        console.log(`From: ${cleanPhone}, Body: ${body}`);

        // 1. Get Guest or Create
        let { data: guest } = await supabase
            .from('guests')
            .select('id, name')
            .eq('phone', cleanPhone)
            .single();

        if (!guest) {
            console.log("Creating new guest profile...");
            const { data: newGuest } = await supabase
                .from('guests')
                .insert({ name: 'Huésped Nuevo', phone: cleanPhone })
                .select()
                .single();
            guest = newGuest;
        }

        // 2. Save Inbound Message
        await supabase.from('messages').insert({
            guest_id: guest!.id,
            phone_number: cleanPhone,
            direction: 'inbound',
            content: body
        });

        // 3. Get History
        const { data: history } = await supabase
            .from('messages')
            .select('direction, content')
            .eq('guest_id', guest!.id)
            .order('created_at', { ascending: false })
            .limit(10);

        // 4. Get Hotel Config
        const { data: config } = await supabase
            .from('hotel_config')
            .select('*')
            .limit(1)
            .single();

        const timezone = config?.timezone ?? 'America/Mexico_City';
        const hotelName = config?.hotel_name ?? 'Hotel Elegante';
        const localTime = new Date().toLocaleString("es-MX", { timeZone: timezone });
        const formattedDate = new Date().toLocaleDateString("es-MX", { timeZone: timezone });

        // 5. Prepare OpenAI
        const systemPrompt = `Eres Luna, la conserje virtual de ${hotelName}. 
Tu personalidad es sofisticada, cálida y eficiente.
Contexto: Huésped ${guest?.name || 'Nuevo'}. Teléfono: ${cleanPhone}.
Hora local: ${localTime}. Fecha: ${formattedDate}.
Reglas:
1. Si el nombre es genérico (Huésped Nuevo), pregúntalo amablemante.
2. Usa YYYY-MM-DD para fechas.
3. No menciones IDs técnicos ni "ejecutando función".
4. Confirma detalles de reserva antes de crearla.`;

        let chatMessages = [
            { role: "system", content: systemPrompt },
            ...(history?.reverse().map(m => ({
                role: m.direction === 'inbound' ? 'user' : 'assistant',
                content: m.content
            })) ?? []),
            { role: "user", content: body }
        ];

        let finalReply = '';

        // OpenAI Loop for Function Calling
        for (let i = 0; i < 3; i++) {
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: chatMessages as any,
                tools: [
                    {
                        type: "function",
                        function: {
                            name: "check_availability",
                            description: "Consulta disponibilidad de habitaciones",
                            parameters: {
                                type: "object",
                                properties: {
                                    check_in: { type: "string" },
                                    check_out: { type: "string" }
                                },
                                required: ["check_in", "check_out"]
                            }
                        }
                    },
                    {
                        type: "function",
                        function: {
                            name: "create_reservation",
                            description: "Crea una reservación real",
                            parameters: {
                                type: "object",
                                properties: {
                                    room_id: { type: "string", description: "UUID de la habitación" },
                                    check_in: { type: "string" },
                                    check_out: { type: "string" }
                                },
                                required: ["room_id", "check_in", "check_out"]
                            }
                        }
                    },
                    {
                        type: "function",
                        function: {
                            name: "update_guest_info",
                            description: "Actualiza perfil del huésped",
                            parameters: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                    email: { type: "string" }
                                },
                                required: ["name"]
                            }
                        }
                    }
                ]
            });

            const message = response.choices[0].message;
            if (message.tool_calls) {
                chatMessages.push(message as any);
                for (const toolCall of message.tool_calls) {
                    const args = JSON.parse(toolCall.function.arguments);
                    let result = '';

                    console.log(`Calling tool: ${toolCall.function.name}`, args);

                    if (toolCall.function.name === 'check_availability') {
                        const { data } = await supabase.from('rooms').select('*').eq('is_available', true);
                        result = JSON.stringify(data || []);
                    } else if (toolCall.function.name === 'create_reservation') {
                        // Basic overlap check or room fetch
                        const { data: room } = await supabase.from('rooms').select('price_per_night').eq('id', args.room_id).single();
                        const { data: res, error } = await supabase.from('reservations').insert({
                            room_id: args.room_id,
                            guest_id: guest!.id,
                            check_in_date: args.check_in,
                            check_out_date: args.check_out,
                            total_price: room?.price_per_night || 0, // Simplified
                            status: 'confirmed'
                        }).select().single();
                        result = error ? `Error: ${error.message}` : `Reserva creada: ${res.id}`;
                    } else if (toolCall.function.name === 'update_guest_info') {
                        await supabase.from('guests').update({ name: args.name, email: args.email }).eq('id', guest!.id);
                        result = "Perfil actualizado.";
                    }

                    chatMessages.push({
                        role: "tool",
                        tool_call_id: toolCall.id,
                        content: result
                    } as any);
                }
            } else {
                finalReply = message.content || '';
                break;
            }
        }

        const reply = finalReply || 'Entendido. ✨ ¿Cómo puedo asistirte ahora?';

        // 6. Save Outbound Message
        await supabase.from('messages').insert({
            guest_id: guest!.id,
            phone_number: cleanPhone,
            direction: 'outbound',
            content: reply
        });

        // 7. Twilio Response (TwiML)
        const twiml = `<Response><Message>${reply}</Message></Response>`;

        return new Response(twiml, {
            headers: { 'Content-Type': 'text/xml' }
        });

    } catch (err: any) {
        console.error("WEBHOOK ERROR:", err);
        const errorTwiml = `<Response><Message>Lo siento, tuve un pequeño inconveniente técnico. ¿Podrías repetirme eso? ✨</Message></Response>`;
        return new Response(errorTwiml, {
            headers: { 'Content-Type': 'text/xml' }
        });
    }
});
