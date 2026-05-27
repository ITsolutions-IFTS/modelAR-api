import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env';
import sequelize from './config/database';
import authRoutes from './routes/auth.routes';
import campaignsRoutes from './routes/campaigns.routes';
import sketchfabRoutes from './routes/sketchfab.routes';
import eventsRoutes from './routes/events.routes';
import collectionsRoutes from './routes/collections.routes';
import { errorHandler } from './middleware/error-handler.middleware';

// Import models to register them with Sequelize
import './models/client.model';
import './models/campaign.model';
import './models/analytics-event.model';
import './models/collection.model';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGINS.split(',').map((o) => o.trim()),
    credentials: true,
  }),
);
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignsRoutes);
app.use('/api/sketchfab', sketchfabRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/collections', collectionsRoutes);

app.use(errorHandler);

async function bootstrap(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('[DB] Connected to PostgreSQL');
  } catch (err) {
    console.error('[DB] Connection failed:', err);
  }

  app.listen(env.PORT, () => {
    console.log(`[Server] modelAR API running on port ${env.PORT} (${env.NODE_ENV})`);
  });
}

bootstrap();

export default app;
