# Sprint 6 — Analytics API + Búsqueda Sketchfab + Gateway

**Semana:** 3 de Stage 3
**Objetivo:** Endpoints de analytics, proxy de Sketchfab y migración de `modelAR-api` a gateway/proxy fino
**Tech:** Node.js + Express · NestJS (modelar-core)

---

## Código

### ITS-S3-API-006 — Endpoints de Analytics

**Estado: ✅ Implementado** — 2026-05-24 · **Resuelto en modelar-core**

**Responsable:** Betania

`GET /api/campaigns/:id/analytics` devuelve las estadísticas agregadas de una campaña: vistas, activaciones AR, clicks al CTA y breakdown en porcentaje. Solo accesible para el cliente dueño de la campaña. Acepta filtros opcionales `?since=` y `?until=` para acotar el rango de fechas. El timeline agrupa los eventos por día.

**Checklist:**
- [x] GET /campaigns/:id/analytics funciona
- [x] Calcula vistas, AR activations, clicks
- [x] Breakdown en porcentaje
- [x] Timeline por día
- [x] Validación: solo datos del cliente autenticado

---

### ITS-S3-API-007 — Endpoint para registrar eventos (POST /events)

**Estado: ✅ Implementado** — 2026-05-24 · **Resuelto en modelar-core**

**Responsable:** Betania

`POST /api/events` es público (sin auth) y recibe eventos del viewer AR: `view` (usuario abrió la página), `ar_activation` (activó AR) y `cta_click` (click en el botón de destino). Valida que `campaign_id` exista y que `event_type` sea uno de los tres tipos válidos. Los eventos se insertan en la tabla `analytics_events` con timestamp e `user_agent`.

**Checklist:**
- [x] POST /events funciona
- [x] Registra eventos sin autenticación
- [x] Valida campaign_id existe
- [x] Valida event_type válido

---

### ITS-S3-API-008 — Proxy de Sketchfab desde backend

**Estado: ✅ Implementado** — 2026-05-24 · **Resuelto en modelar-core**

**Responsable:** Betania

`GET /api/sketchfab/models` y `GET /api/sketchfab/models/:uid` hacen proxy a la API de Sketchfab manteniendo la API key en el servidor. El core mapea el parámetro `sector` a categorías de Sketchfab y opcionalmente hace merge con los `curated-models` guardados en DB. La API key nunca se expone al cliente.

**Checklist:**
- [x] GET /sketchfab/models funciona
- [x] GET /sketchfab/models/:uid funciona
- [x] API key no está expuesta en frontend

---

### ITS-S3-API-009 — Endpoint público de campaña

**Estado: ✅ Implementado** — 2026-05-24 · **Resuelto en modelar-core**

**Responsable:** Betania

`GET /api/campaigns/:id/public` permite al viewer público (ARPage) obtener los datos de una campaña sin autenticación. Devuelve `id`, `title`, `description`, `sector`, `sketchfab_uid`, `cta_url`, `qr_value` y `org_slug`, sin exponer `client_id` ni datos de analytics.

---

### ITS-S3-API-010 — Endpoint CRUD de Collections

**Estado: ✅ Implementado** — 2026-05-26 · **Resuelto en modelar-core**

**Responsable:** Betania

CRUD completo de colecciones con aislamiento multi-tenant por `orgSlug`. Concepto genérico de agrupación (Serie, Categoría, Sala, Proyecto según el cliente). `cta_url` en campaigns pasó a ser opcional (nullable) en esta misma iteración.

**Endpoints:** `GET /api/collections`, `POST /api/collections`, `PATCH /api/collections/:id`, `DELETE /api/collections/:id`.

**Checklist:**
- [x] GET /api/collections devuelve solo colecciones de la org del cliente
- [x] POST /api/collections crea con UUID
- [x] PATCH /api/collections/:id valida orgSlug
- [x] DELETE /api/collections/:id valida orgSlug
- [x] `cta_url` en campaigns es ahora opcional (nullable)

---

### ITS-S3-API-011 — Suite de tests unitarios (jest)

**Estado: ✅ Implementado** — 2026-05-26 · **Resuelto en modelar-core**

**Responsable:** Betania

112 tests con jest + ts-jest cubriendo use cases de auth, campaigns, collections, analytics, curated models, organizations y sketchfab. UUID ESM mapeado a mock CJS local.

**Checklist:**
- [x] jest + ts-jest instalados
- [x] 112/112 tests pasan
- [x] Script `pnpm test` configurado

---

## Cambios técnicos del gateway

A partir de este sprint `modelAR-api` dejó de implementar lógica de negocio y pasó a funcionar como **gateway/proxy fino**, delegando todo a `modelar-core` (NestJS).

**Rol del gateway:** Express puro, sin estado, sin DB. Recibe requests del frontend en el puerto 3000, aplica middleware transversal (helmet, cors, body-parser, x-request-id), reenvía a `${CORE_URL}` preservando headers de auth y tracing, y devuelve la respuesta del core tal cual. Si el core no responde (timeout 10 s) devuelve `503 SERVICE_UNAVAILABLE` con shape canónica.

**Headers que se reenvían:** `Authorization` (el core valida el JWT), `x-request-id` (distributed tracing con pino), `x-forwarded-for` y `x-real-ip` (rate limiting por IP en el core para endpoints públicos).

**Por qué core es repo separado:** `modelar-api` y `modelar-web` se comparten con el equipo y la cátedra. `modelar-core` contiene la lógica de negocio y los secretos de plataforma, queda restringido al owner. Cualquiera puede levantar el gateway local apuntándolo a la instancia productiva del core sin necesidad de acceso al código ni a credenciales de DB.

**Recursos disponibles vía core:**

| Recurso | Endpoints (prefijo `/api`) | Auth |
|---------|----------------------------|------|
| Auth | `register`, `login`, `refresh`, `logout`, `me` | Mixto |
| Organizations | `GET`, `GET /:slug`, `POST`, `PATCH /:slug`, `DELETE /:slug` | Lectura cualquier auth · escritura SUPERADMIN |
| Campaigns | CRUD por id · `/:id/public` sin auth | Cliente dueño |
| Collections | CRUD por id | Multi-tenant por orgSlug |
| Analytics | `POST /events` (público, rate-limited), `GET /campaigns/:id/analytics` | Mixto |
| Sketchfab | `GET /sketchfab/models`, `GET /sketchfab/models/:uid` | Auth · merge curated models |
| Curated Models | CRUD por id | SUPERADMIN |

**Shape canónica de errores del core:**

El gateway no formatea errores. Si el core falla con 4xx/5xx, devuelve el body tal cual (`code`, `message`, `statusCode`, `timestamp`, `path`, `requestId`, `details`). Si el core está caído o el timeout vence, el gateway responde con `503 SERVICE_UNAVAILABLE`.

**`GET /health`:** además de reportar `ok` propio, consulta `${CORE_URL}/health` y devuelve el estado del upstream (`core: ok | unavailable`).

---

## Informe

### ITS-S3-API-DOC-002 — Proxy OpenAPI spec | ⏳ Betania

El spec describe la superficie HTTP que el gateway proxya. El gateway no transforma payloads — devuelve la respuesta del core tal cual. El spec documenta el contrato del proxy y referencia al core como fuente de verdad de cada response.

**Archivo:** `openapi.yaml` en la raíz de `modelar-api`.

**Checklist:**
- [ ] `openapi.yaml` creado en la raíz de `modelar-api`
- [ ] Cubre las 24 rutas que el gateway expone
- [ ] Documenta shape canónica de error y paginada
- [ ] Anota explícitamente que las responses concretas las define `modelar-core`
- [ ] Validado con Swagger UI o Redoc local

---

## Checklist de Sprint 6 API

- [x] GET /api/campaigns/:id/analytics funciona
- [x] Calcula stats y breakdown
- [x] POST /api/events funciona (público, sin auth)
- [x] GET /api/sketchfab/models funciona (proxy, API key no expuesta)
- [x] GET /api/sketchfab/models/:uid funciona
- [x] GET/POST/PATCH/DELETE /api/collections — CRUD completo con aislamiento por org
- [x] cta_url nullable en campaigns
- [x] 112 tests unitarios (jest) en modelar-core
- [x] modelar-api convertido en gateway/proxy fino
- [x] 5 rutas de Organizations agregadas al gateway
- [x] CORE_URL configurable por env, timeout 10s con 503 canónico
- [x] /health reporta el estado del core
- [ ] OpenAPI spec creada

---
