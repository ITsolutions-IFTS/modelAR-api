function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  PORT: parseInt(process.env.PORT ?? '5000', 10),
  NODE_ENV: process.env.NODE_ENV ?? 'development',

  DB_HOST: process.env.DB_HOST ?? 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT ?? '5432', 10),
  DB_NAME: process.env.DB_NAME ?? 'modelar_db',
  DB_USER: process.env.DB_USER ?? 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD ?? 'postgres',

  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '7d',

  CORS_ORIGINS: process.env.CORS_ORIGINS ?? 'http://localhost:5173',

  FRONTEND_URL: process.env.FRONTEND_URL ?? 'http://localhost:5173',

  SKETCHFAB_API_KEY: process.env.SKETCHFAB_API_KEY ?? '',
};
