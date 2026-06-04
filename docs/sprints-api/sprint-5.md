# Sprint 5 — Auth + Base de datos + Arquitectura API

**Semana:** 1-2 de Stage 3
**Objetivo:** Sentar la base técnica — autenticación JWT, schema de DB, primeros endpoints de CRUD
**Tech:** Node.js + Express, PostgreSQL, JWT, Bcrypt

> **Nota:** Los tickets de este sprint describen la implementación inicial de `modelAR-api` como backend con Express + Sequelize. A partir del Sprint 6, esta lógica fue migrada a `modelar-core` (NestJS) y `modelAR-api` pasó a funcionar como gateway/proxy fino. Ver sprint 6 para el detalle del cambio arquitectónico.

---

## Código

### ITS-S3-API-001 — Setup del proyecto Node + Express + Sequelize

**Estado: ✅ Implementado** — 2026-05-24

**Responsable:** Betania

Configuración inicial del proyecto backend con Node.js, Express y Sequelize como ORM. El proyecto sigue el patrón de capas Domain → Application → Infrastructure: los use cases dependen solo de interfaces del dominio y la capa de infraestructura inyecta las implementaciones concretas (repositorios PostgreSQL, handlers externos).

**Checklist:**
- [x] Carpeta backend creada con estructura inicial
- [x] package.json con dependencias
- [x] .env.example con variables necesarias
- [x] Script `dev`: nodemon para desarrollo
- [x] Script `build`: tsc para TypeScript
- [x] TypeScript config (tsconfig.json)
- [x] Git ignorar node_modules, .env

---

### ITS-S3-API-002 — Conexión a PostgreSQL + Sequelize Models

**Estado: ✅ Implementado** — 2026-05-24

**Responsable:** Betania

Conexión a PostgreSQL y definición de los tres modelos iniciales con Sequelize: `Client` (usuario con email único, password hasheado y rol), `Campaign` (campaña multi-tenant con FK a cliente) y `AnalyticsEvent` (registro de eventos sin updatedAt). Las relaciones se definen explícitamente con `belongsTo` / `hasMany`.

**Checklist:**
- [x] PostgreSQL corriendo localmente
- [x] .env con credenciales DB
- [x] Sequelize instalado
- [x] 3 models creados (Client, Campaign, AnalyticsEvent)
- [x] `npm run db:sync` o migrations ejecutadas
- [x] Tablas creadas en DB
- [x] Relaciones definidas

---

### ITS-S3-API-003 — Autenticación JWT

**Estado: ✅ Implementado** — 2026-05-24

**Responsable:** Betania

Implementación de los endpoints de autenticación con JWT. `POST /api/auth/register` valida email único, hashea la contraseña con bcrypt y devuelve token. `POST /api/auth/login` verifica credenciales. `GET /api/auth/me` requiere Bearer token. `POST /api/auth/logout` solo limpia el token en el frontend. El middleware de auth inyecta el `clientId` en el request para uso posterior.

**Checklist:**
- [x] POST /auth/register funciona
- [x] POST /auth/login funciona
- [x] JWT generado y verificado
- [x] Middleware auth protege endpoints privados
- [x] POST /auth/logout (solo limpia frontend)
- [x] GET /auth/me devuelve cliente autenticado
- [x] Errores manejan casos edge (email ya existe, etc)

---

### ITS-S3-API-004 — Endpoints CRUD de Campaigns (sin lógica de Sketchfab)

**Estado: ✅ Implementado** — 2026-05-24

**Responsable:** Betania

CRUD completo de campañas con aislamiento por cliente: `GET /api/campaigns` devuelve solo las campañas del cliente autenticado. `POST` valida title, sector, sketchfab_uid y cta_url. `GET /:id`, `PATCH /:id` y `DELETE /:id` verifican que la campaña pertenezca al cliente. Los errores siguen la forma canónica (401 sin auth, 403 si no es del cliente, 400 si dato inválido).

**Checklist:**
- [x] GET /campaigns devuelve solo mis campañas
- [x] POST /campaigns crea nueva
- [x] GET /campaigns/:id valida pertenencia
- [x] PATCH /campaigns/:id edita
- [x] DELETE /campaigns/:id elimina
- [x] Error handling: 401 si no auth, 403 si no es mi campaña, 400 si dato inválido

---

### ITS-S3-API-005 — Generación de QR automático

**Estado: ✅ Implementado** — 2026-05-24

**Responsable:** Betania

Al crear una campaña (`POST /api/campaigns`), se genera automáticamente un QR con la librería `qrcode` npm que apunta a la URL pública del viewer (`{FRONTEND_URL}/#/ar/{campaignId}`). El QR se guarda como data URL (Base64 PNG) en el campo `qr_value` de la campaña.

**Checklist:**
- [x] Librería qrcode instalada
- [x] QR generado automáticamente al crear campaña
- [x] QR apunta al viewer público con el UID del modelo

---

## Informe / Documentación

### ITS-S3-DOC-001 — README backend

**Archivo:** `modelAR-api/README.md`

**Checklist:**
- [ ] README creado y completo
- [ ] Instrucciones de setup claras
- [ ] Variables de entorno documentadas
- [ ] Endpoints listados

---

## Checklist de Sprint 5

### Código
- [x] Proyecto Node + Express configurado
- [x] PostgreSQL conectado
- [x] 3 tablas creadas (clients, campaigns, analytics_events)
- [x] Auth funciona (register, login, JWT)
- [x] CRUD campaigns funciona
- [x] QR generado automáticamente
- [x] Error handling en todos los endpoints
- [x] CORS configurado
- [x] Helmet headers

---
