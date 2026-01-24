-- Habiltar extensiones si no lo están
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Eliminar tarea anterior si existe
SELECT cron.unschedule('enviar-recordatorios-checkin');

-- Programar nueva tarea: ejecutar todos los días a las 08:00 AM (UTC)
SELECT cron.schedule(
  'enviar-recordatorios-checkin',
  '0 8 * * *',
  $$
  SELECT net.http_post(
    url:='https://elzkjqyjdphznfzqxjtk.supabase.co/functions/v1/send-reminders',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer [TU_SERVICE_ROLE_KEY]"}'::jsonb
  ) as request_id;
  $$
);
