import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
const TWILIO_FROM_NUMBER = Deno.env.get('TWILIO_FROM_NUMBER');

Deno.serve(async (req: Request) => {
    try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        // 1. Get reservations for tomorrow without reminder sent
        const { data: reservations } = await supabase
            .from('reservations')
            .select('*, guests(*), rooms(*)')
            .eq('check_in_date', tomorrowStr)
            .eq('reminder_sent', false)
            .eq('status', 'confirmed');

        if (!reservations || reservations.length === 0) {
            return new Response('No reminders to send', { status: 200 });
        }

        for (const res of reservations) {
            const message = `¡Hola ${res.guests.name}! Te recordamos tu check-in para mañana en la habitación ${res.rooms.name}. Te esperamos a partir de las 15:00.`;

            // Send via Twilio (Placeholder logic)
            console.log(`Sending reminder to ${res.guests.phone}: ${message}`);

            // Mark as sent
            await supabase
                .from('reservations')
                .update({ reminder_sent: true })
                .eq('id', res.id);
        }

        return new Response(`Sent ${reservations.length} reminders`, { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response('Error', { status: 500 });
    }
});
