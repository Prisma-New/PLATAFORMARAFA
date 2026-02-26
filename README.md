Plataforma MVP (manual-first)

Documentación completa:
- Índice: [.github/README.md](file:///c:/Users/maria/OneDrive/Escritorio/AdFlow/plataforma/.github/README.md)
- Secciones: [.github/docs](file:///c:/Users/maria/OneDrive/Escritorio/AdFlow/plataforma/.github/docs)

Acceso rápido:
1. [Overview](file:///c:/Users/maria/OneDrive/Escritorio/AdFlow/plataforma/.github/docs/01-overview.md)
2. [Setup y ejecución](file:///c:/Users/maria/OneDrive/Escritorio/AdFlow/plataforma/.github/docs/02-setup.md)
3. [Base de datos y migraciones](file:///c:/Users/maria/OneDrive/Escritorio/AdFlow/plataforma/.github/docs/03-database.md)
4. [Auth y roles](file:///c:/Users/maria/OneDrive/Escritorio/AdFlow/plataforma/.github/docs/04-auth.md)
5. [Channels](file:///c:/Users/maria/OneDrive/Escritorio/AdFlow/plataforma/.github/docs/05-channels.md)
6. [Campaigns](file:///c:/Users/maria/OneDrive/Escritorio/AdFlow/plataforma/.github/docs/06-campaigns.md)
7. [Tracking y stats](file:///c:/Users/maria/OneDrive/Escritorio/AdFlow/plataforma/.github/docs/07-tracking.md)
8. [Troubleshooting](file:///c:/Users/maria/OneDrive/Escritorio/AdFlow/plataforma/.github/docs/08-troubleshooting.md)
9. [Análisis de unión](file:///c:/Users/maria/OneDrive/Escritorio/AdFlow/plataforma/.github/docs/09-union-me-repo.md)
10. [UI y dashboards](file:///c:/Users/maria/OneDrive/Escritorio/AdFlow/plataforma/.github/docs/10-ui-dashboards.md)

Inicio rápido

```bash
npm install
npm run doctor
npm run dev
```

URLs por defecto
- Web: http://localhost:3000
- API: http://localhost:4000
- Health: http://localhost:4000/health

Vista previa

```bash
npm run preview
```

**Estado del Proyecto**
- Objetivo: MVP manual-first con flujos de compra con garantía, campañas y monetización.
- Servicios activos: Web (Next.js) y API (Express) corriendo en local correctamente.
- Integración de pagos: modo mock en desarrollo; soporte Stripe en producción.<mccoremem id="01KH206QDNHYT1S3VMSRZTGJ69|03fjy82kk8ab03ofy5v29stsk" />
- Base de datos: pg-mem en dev, Pool de pg en prod; migraciones Prisma actualizadas.<mccoremem id="03fjy82kk8ab03ofy5v29stsk" />

**Arquitectura**
- Apps
  - API: Express + Prisma. Entrypoint [index.ts](file:///C:/Users/maria/OneDrive/Escritorio/AdFlow/plataforma/apps/api/src/index.ts). Rutas: auth, channels, campaigns, integration (pagos), tracking, chat, blog.
  - Web: Next.js (App Router). Entrypoint [apps/web/app/page.tsx](file:///C:/Users/maria/OneDrive/Escritorio/AdFlow/plataforma/apps/web/app/page.tsx). Dashboards para advertiser y creator.
- Scripts
  - Doctor y pruebas de integración: [scripts](file:///C:/Users/maria/OneDrive/Escritorio/AdFlow/plataforma/apps/api/scripts).
- Configuración
  - Next dev estable: [next.config.js](file:///C:/Users/maria/OneDrive/Escritorio/AdFlow/plataforma/apps/web/next.config.js).
  - Estilos compartidos: [globals.css](file:///C:/Users/maria/OneDrive/Escritorio/AdFlow/plataforma/apps/web/app/globals.css).

**API**
- Estado
  - Salud: /health OK.
  - Rutas principales: 
    - Auth: [routes.auth.ts](file:///C:/Users/maria/OneDrive/Escritorio/AdFlow/plataforma/apps/api/src/routes.auth.ts)
    - Channels: [routes.channels.ts](file:///C:/Users/maria/OneDrive/Escritorio/AdFlow/plataforma/apps/api/src/routes.channels.ts)
    - Campaigns: [routes.campaigns.ts](file:///C:/Users/maria/OneDrive/Escritorio/AdFlow/plataforma/apps/api/src/routes.campaigns.ts)
    - Pagos/Stripe: [routes.integration.ts](file:///C:/Users/maria/OneDrive/Escritorio/AdFlow/plataforma/apps/api/src/routes.integration.ts)
    - Tracking: [routes.tracking.ts](file:///C:/Users/maria/OneDrive/Escritorio/AdFlow/plataforma/apps/api/src/routes.tracking.ts)
    - Chat/Blog: [routes.chat.ts](file:///C:/Users/maria/OneDrive/Escritorio/AdFlow/plataforma/apps/api/src/routes.chat.ts), [routes.blog.ts](file:///C:/Users/maria/OneDrive/Escritorio/AdFlow/plataforma/apps/api/src/routes.blog.ts)
  - Publisher/seed demo: [campaigns.publisher.ts](file:///C:/Users/maria/OneDrive/Escritorio/AdFlow/plataforma/apps/api/src/campaigns.publisher.ts), [demo.seed.ts](file:///C:/Users/maria/OneDrive/Escritorio/AdFlow/plataforma/apps/api/src/demo.seed.ts)
- Datos
  - Prisma config: [prisma.ts](file:///C:/Users/maria/OneDrive/Escritorio/AdFlow/plataforma/apps/api/src/lib/prisma.ts). En dev se usa pg-mem; en prod Pool de pg.<mccoremem id="03fjy82kk8ab03ofy5v29stsk" />
  - Nota dev: inserciones de registro deben incluir id y createdAt en pg-mem.<mccoremem id="01KH9PQFTJQ9JD0ZWVZGWCX3G0" />
- Pagos
  - Webhook Stripe requiere cuerpo raw y verificación de firma; no usar express.json global en esa ruta.<mccoremem id="01KH206QDNHYT1S3VMSRZTGJ69" />
- Tests
  - Integración: [integration.test.mjs](file:///C:/Users/maria/OneDrive/Escritorio/AdFlow/plataforma/apps/api/scripts/integration.test.mjs) ejecuta flujo mock de intent y tracking.

**Web**
- Estado
  - App Router estable. Login corregido con Suspense para useSearchParams.
  - Dashboards
    - Advertiser: [DashboardExecutive.tsx](file:///C:/Users/maria/OneDrive/Escritorio/AdFlow/plataforma/apps/web/app/advertiser/DashboardExecutive.tsx)
    - Creator: [DashboardMonetization.tsx](file:///C:/Users/maria/OneDrive/Escritorio/AdFlow/plataforma/apps/web/app/app/creator/DashboardMonetization.tsx)
  - Consistencia visual: panel de métricas unificado y estilos alineados con sección “compra con garantía”.
- UI/UX
  - Tooltips accesibles por data-help en botones (hover y focus): [globals.css](file:///C:/Users/maria/OneDrive/Escritorio/AdFlow/plataforma/apps/web/app/globals.css)
  - Hero FX (seguimiento de ratón): [HeroFX.tsx](file:///C:/Users/maria/OneDrive/Escritorio/AdFlow/plataforma/apps/web/app/components/HeroFX.tsx)
- Cliente API
  - getApiUrl y fetch con token localStorage: [api.ts](file:///C:/Users/maria/OneDrive/Escritorio/AdFlow/plataforma/apps/web/app/lib/api.ts)

**Entorno y variables**
- Web
  - NEXT_PUBLIC_API_URL (opcional en local; fallback al host actual:4000)
- API
  - USE_PGMEM=1 (dev), DATABASE_URL (prod), STRIPE_SECRET_KEY (prod), PORT_API/ API_PORT (puerto), PUBLIC_API_URL.<mccoremem id="03fjy82kk8ab03ofy5v29stsk|01KH206QDNHYT1S3VMSRZTGJ69" />
  - WhatsApp Cloud API:
    - WHATSAPP_ACCESS_TOKEN (server)
    - WHATSAPP_PHONE_NUMBER_ID (server)
    - WHATSAPP_VERIFY_TOKEN (server)
    - APP_SECRET (Meta App Secret, requerido para verificar X-Hub-Signature-256)
    - Webhook: GET/POST [routes.whatsapp.ts](file:///C:/Users/maria/OneDrive/Escritorio/AdFlow/plataforma/apps/api/src/routes.whatsapp.ts)
    - Nota: /whatsapp/webhook POST usa cuerpo RAW y verificación HMAC; el parser JSON global se excluye para esa ruta.

**Build/Test**
- Scripts raíz: 
  - Dev concurrente: `npm run dev`
  - Build: `npm run build`
  - Typecheck: `npm run typecheck`
  - Lint: `npm run lint`
  - Test integración API: `npm run test`

**Estados y Calidad**
- API
  - Auth/roles: estable, validación con zod en entradas críticas.
  - Channels/Campaigns: estable; control de ownership y estados con auditoría.
  - Integration (pagos): estable en mock; Stripe en prod requiere secreto y raw body.
  - Tracking: estable; agregaciones básicas de métricas por canal/campaña.
  - Chat/Blog: funcionalidad base, pendiente moderación avanzada en producción.
- Web
  - Navegación y layouts: estable; App Router con páginas privadas en /app/*.
  - Dashboards: consistentes y responsivos; métricas y listas con accesibilidad básica.
  - Componentes: CTA/Trust/Escrow/Preview listos para marketing y demo.
  - Estilos globales: paleta y sombras coherentes; soporte dark mode básico.

**Backlog de mejoras**
- Seguridad
  - Rate limiting y protección básica en rutas sensibles de API.
  - Endurecer CORS por entorno y orígenes.
  - Gestión de secretos: no exponer claves en logs/cliente.
- Fiabilidad
  - Webhook Stripe: aislar body parser y logs de auditoría más detallados.<mccoremem id="01KH206QDNHYT1S3VMSRZTGJ69" />
  - Retries y circuit breakers en llamadas externas (Stripe).
- Datos
  - Índices adicionales sobre tablas de tracking y campañas.
  - Jobs asíncronos para agregaciones históricas.
- Tests
  - Unit tests Web (render, lógica de hooks).
  - Más casos de integración en API (errores y límites).
- UX/Accesibilidad
  - Tooltips en más pantallas y descripciones contextuales.
  - Mejoras de foco y ARIA en listas/tablas.
- Observabilidad
  - Métricas de rendimiento en Web (LCP/INP).
  - Logging estructurado en API (request id, latencia).

**Notas de desarrollo**
- En pg-mem, inserts de registro deben incluir id (uuid) y createdAt para evitar fallos en dev.<mccoremem id="01KH9PQFTJQ9JD0ZWVZGWCX3G0" />
- En Web, si NEXT_PUBLIC_API_URL apunta a localhost y el host actual no es local, se fuerza fallback al host actual:4000 para evitar CORS y mismatches: [api.ts](file:///C:/Users/maria/OneDrive/Escritorio/AdFlow/plataforma/apps/web/app/lib/api.ts)
