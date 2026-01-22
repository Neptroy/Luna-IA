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

Deno.serve(async (req: Request) => {
    try {
        const formData = await req.formData();
        const from = formData.get('From')?.toString() ?? '';
        const body = formData.get('Body')?.toString() ?? '';

        if (!from || !body) {
            return new Response('Missing From or Body', { status: 400 });
        }

        // 1. Get Guest or Create
        let { data: guest } = await supabase
            .from('guests')
            .select('id')
            .eq('phone', from)
            .single();

        if (!guest) {
            const { data: newGuest } = await supabase
                .from('guests')
                .insert({ name: 'Huésped Nuevo', phone: from })
                .select()
                .single();
            guest = newGuest;
        }

        // 2. Save Inbound Message
        await supabase.from('messages').insert({
            guest_id: guest!.id,
            phone_number: from,
            direction: 'inbound',
            content: body
        });

        // 3. Get History
        const { data: history } = await supabase
            .from('messages')
            .select('direction, content')
            .eq('guest_id', guest!.id)
            .order('created_at', { ascending: false })
            .limit(15);

        // 4. Get Hotel Config
        const { data: config } = await supabase
            .from('hotel_config')
            .select('*')
            .limit(1)
            .single();

        const timezone = config?.timezone ?? 'UTC';
        const hotelName = config?.hotel_name ?? 'Luna Hotel';
        const localTime = new Date().toLocaleString("en-US", { timeZone: timezone });

        // 5. Prepare OpenAI
        const messages = [
            {
                role: "system",
                content: `Eres Luna, la asistente virtual de ${hotelName}. 
        Usa un tono elegante, profesional y cálido.
        Hora local del hotel: ${localTime}.
        Gestiona reservas, check-ins y dudas. Usa fechas en formato ISO 8601.`
            },
            ...(history?.reverse().map(m => ({
                role: m.direction === 'inbound' ? 'user' : 'assistant',
                content: m.content
            })) ?? []),
            { role: "user", content: body }
        ];

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages as any,
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
                                check_out: { type: "string" },
                                type: { type: "string" }
                            },
                            required: ["check_in", "check_out"]
                        }
                    }
                }
            ]
        });

        const reply = response.choices[0].message.content || 'Lo siento, no pude procesar tu solicitud.';

        // 6. Save Outbound Message
        await supabase.from('messages').insert({
            guest_id: guest!.id,
            phone_number: from,
            direction: 'outbound',
            content: reply
        });

        // 7. Twilio Response (TwiML)
        const twiml = `<Response><Message>${reply}</Message></Response>`;

        return new Response(twiml, {
            headers: { 'Content-Type': 'text/xml' }
        });

    } catch (err) {
        console.error(err);
        return new Response('Error', { status: 500 });
    }
});
