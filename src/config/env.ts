export const env = {
  PORT: parseInt(process.env.PORT ?? '3000', 10),
  CORE_URL: process.env.CORE_URL ?? 'http://localhost:4000',
};
