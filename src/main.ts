import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { randomUUID } from 'crypto';
import { env } from './config/env';
import { forward } from './proxy/forward';

const app = express();

app.set('trust proxy', true);

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Asegura que TODA request tenga x-request-id (lo reenvia forward() al core).
app.use((req, _res, next) => {
  if (!req.headers['x-request-id']) {
    req.headers['x-request-id'] = randomUUID();
  }
  next();
});

app.get('/health', async (_req, res) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5_000);
    const upstream = await fetch(`${env.CORE_URL}/health`, { signal: controller.signal });
    clearTimeout(timeout);
    res.json({ status: 'ok', core: upstream.ok ? 'ok' : 'unavailable' });
  } catch {
    res.json({ status: 'ok', core: 'unavailable' });
  }
});

// Auth
app.post('/api/auth/register', forward);
app.post('/api/auth/login', forward);
app.post('/api/auth/refresh', forward);
app.post('/api/auth/logout', forward);
app.get('/api/auth/me', forward);

// Campaigns
app.get('/api/campaigns', forward);
app.post('/api/campaigns', forward);
app.get('/api/campaigns/:id', forward);
app.patch('/api/campaigns/:id', forward);
app.delete('/api/campaigns/:id', forward);
app.get('/api/campaigns/:id/public', forward);
app.get('/api/campaigns/:id/analytics', forward);

// Collections
app.get('/api/collections', forward);
app.post('/api/collections', forward);
app.get('/api/collections/:id', forward);
app.patch('/api/collections/:id', forward);
app.delete('/api/collections/:id', forward);

// Analytics events (publico, rate-limited en el core por IP via x-forwarded-for)
app.post('/api/events', forward);

// Sketchfab (con merge de curated-models en el core)
app.get('/api/sketchfab/models', forward);
app.get('/api/sketchfab/models/:uid', forward);

// Curated models (admin only — el core valida @Roles(SUPERADMIN))
app.get('/api/curated-models', forward);
app.post('/api/curated-models', forward);
app.patch('/api/curated-models/:id', forward);
app.delete('/api/curated-models/:id', forward);

// Organizations (lectura para cualquier auth user; escritura solo SUPERADMIN)
app.get('/api/organizations', forward);
app.get('/api/organizations/:slug', forward);
app.post('/api/organizations', forward);
app.patch('/api/organizations/:slug', forward);
app.delete('/api/organizations/:slug', forward);

app.use((_req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found in gateway',
      statusCode: 404,
    },
  });
});

app.listen(env.PORT, () => {
  console.log(`[gateway] modelAR API gateway running on port ${env.PORT} → ${env.CORE_URL}`);
});

export default app;
