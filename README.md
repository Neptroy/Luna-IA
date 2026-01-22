# 🌙 Luna IA - Asistente Virtual para Hoteles

Luna IA es una solución fullstack diseñada para modernizar la gestión hotelera mediante inteligencia artificial y automatización por WhatsApp. Permite a los hoteles gestionar reservas, responder preguntas frecuentes y coordinar check-ins de manera totalmente automática.

![Luna IA Dashboard](https://raw.githubusercontent.com/Neptroy/Luna-IA/main/src/assets/preview.png)

## ✨ Características Principales

### 🏨 Gestión Hotelera
- **Landing Page Premium**: Diseño elegante "Hotel de Lujo" optimizado para conversión.
- **Dashboard Multitarea**: Panel de control con Sidebar responsive para una gestión eficiente.
- **Calendario de Reservas**: Visualización mensual de ocupación y detalles de estancias.
- **Control de Habitaciones**: Gestión de inventario, amenidades y estados de limpieza/disponibilidad.
- **Base de Datos de Huéspedes**: Historial de estancias y perfiles de contacto.

### 🤖 Inteligencia Artificial (Luna)
- **Cerebro OpenAI**: Integración con GPT-4o-mini para respuestas naturales y contextuales.
- **Memoria de Conversación**: Luna recuerda los últimos 10-15 mensajes para dar continuidad al chat.
- **Sincronización Horaria**: Respuestas basadas en la hora local del hotel.
- **Function Calling**: La IA puede consultar disponibilidad y crear reservas directamente en la base de datos.

### 📱 Automatización WhatsApp (Twilio)
- **Webhook en Tiempo Real**: Procesamiento instantáneo de mensajes entrantes.
- **Recordatorios Automáticos**: Envío de notificaciones de check-in 24h antes de la llegada.

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, TanStack Query, React Router.
- **Iconografía**: Lucide React.
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions).
- **Integraciones**: OpenAI SDK, Twilio REST API.

## 🚀 Instalación y Setup

### Requisitos Previos
- Node.js 18+
- Una cuenta en [Supabase](https://supabase.com/)
- Una cuenta en [Twilio](https://www.twilio.com/)
- Una API Key de [OpenAI](https://platform.openai.com/)

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Neptroy/Luna-IA.git
   cd Luna-IA
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Base de Datos**
   - Ejecuta el contenido de `src/lib/schema.ts` en el Editor SQL de tu proyecto Supabase.

4. **Variables de Entorno**
   - Configura las variables de entorno en tu proyecto de Supabase para las Edge Functions:
   - `OPENAI_API_KEY`
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_FROM_NUMBER`

5. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

## ⏰ Automatización de Recordatorios (Cron Job)

Para habilitar los recordatorios automáticos de check-in, ejecuta el siguiente comando SQL en Supabase:

```sql
SELECT cron.schedule(
  'enviar-recordatorios-checkin',
  '0 8 * * *',
  $$
  SELECT net.http_post(
    url:='https://[TU-PROJECT-REF].supabase.co/functions/v1/send-reminders',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer [SERVICE_ROLE_KEY]"}'::jsonb
  ) as request_id;
  $$
);
```

## 📄 Licencia
Este proyecto es de código abierto bajo la licencia MIT.
