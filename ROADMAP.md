# 🗺️ Luna IA - Project Roadmap

## 📍 Fase 1: Cimientos (Completado)
- ✅ Estructura base con Vite + React + TS.
- ✅ Diseño UI/UX con paleta Azure/Dorado (Hotel Elegante).
- ✅ Esquema de base de datos PostgreSQL.
- ✅ Implementación de Landing Page y Auth UI.
- ✅ Dashboard con 5 pestañas funcionales (Mensajes, Reservas, Habitaciones, Huéspedes, Config).

## 🛠 Fase 2: Conectividad (En Progreso)
- ✅ Creación y vinculación del proyecto Supabase real.
- ✅ Aplicación de esquema de base de datos y políticas RLS.
- ✅ Configuración de variables de entorno locales (`.env`).
- ✅ Despliegue de Edge Functions (`twilio-webhook-whatsapp` y `send-reminders`).
- [ ] Integración real de Supabase Auth en el Frontend.
- [ ] Conexión de los componentes del Dashboard a la data real de las tablas.
- [ ] Configuración del Webhook de WhatsApp en la consola de Twilio.

## 🧠 Fase 3: Inteligencia
- [ ] Refinamiento del System Prompt de Luna (Personalidad y Reglas).
- [ ] Implementación de Tool Calling activo (CRUD de reservas desde el chat).
- [ ] Activación del Cron Job para recordatorios automáticos.
- [ ] Manejo de errores y "gotchas" de Twilio/OpenAI.

## 🚀 Fase 4: Optimización y Lanzamiento
- [ ] Pulido final de UI/UX y soporte móvil.
- [ ] Pruebas de integración extremo a extremo (E2E).
- [ ] Documentación final de usuario.
- [ ] Lanzamiento oficial.

## 🔮 Futuro (Backlog)
- [ ] Integración con pasarelas de pago (Stripe/Pix).
- [ ] Soporte multi-idioma automático.
- [ ] Dashboard de analíticas de rendimiento.
