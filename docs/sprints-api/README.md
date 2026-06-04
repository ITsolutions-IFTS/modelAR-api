# Sprints API — modelAR-api

Documentación de sprints del backend para Stage 3.

---

## Índice de Sprints

| Sprint | Semana | Objetivo | Estado |
|---|---|---|---|
| [Sprint 5](./sprint-5.md) | 1-2 | Setup + Auth + CRUD campaigns | ✅ Completo |
| [Sprint 6](./sprint-6.md) | 3 | Analytics + Sketchfab + Gateway | ✅ Completo |

---

## Arquitectura actual

`modelAR-api` funciona como **gateway/proxy fino** sin estado ni DB. Recibe requests del frontend y las reenvía a `modelar-core` (NestJS), que contiene toda la lógica de negocio, la base de datos y la integración con Sketchfab.

```
modelAR-web (React)
    ↓
modelAR-api (Express — gateway, puerto 3000)
    ↓
modelar-core (NestJS — lógica + DB, puerto 4000)
    ↓
PostgreSQL + Sketchfab API
```

> Esta arquitectura fue adoptada en Sprint 6. Los sprints anteriores describen la implementación inicial directa con Express + Sequelize, que luego fue migrada a modelar-core.

---

## Setup local

```
1. Clonar el repo
2. cp .env.example .env
3. Completar CORE_URL con la URL del core (local o producción)
4. pnpm install
5. pnpm dev
```

El gateway corre en el puerto definido por `PORT` (default 3000) y proxya a `CORE_URL`.

---

## Convenciones

| Ícono | Significado |
|---|---|
| ✅ | Completado |
| ⏳ | Pendiente |
| 🔴 | Bloqueante |

---

**Ver [../README.md](../README.md) para documentación general del proyecto.**
