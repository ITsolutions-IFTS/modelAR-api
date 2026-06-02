import { Request, Response } from 'express';
import { env } from '../config/env';

/**
 * Headers que el gateway preserva al reenviar al core.
 * - Authorization: el core valida el JWT.
 * - X-Request-Id: tracing distribuido (el core lo loguea con pino).
 * - X-Forwarded-For + X-Real-Ip: el core los usa para rate limit por IP
 *   en endpoints publicos (POST /api/events).
 */
const FORWARDED_HEADERS = ['authorization', 'x-request-id', 'x-forwarded-for', 'x-real-ip'];

const TIMEOUT_MS = 10_000;

export async function forward(req: Request, res: Response): Promise<void> {
  const url = new URL(req.originalUrl, env.CORE_URL);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  for (const name of FORWARDED_HEADERS) {
    const value = req.headers[name];
    if (typeof value === 'string') {
      headers[name] = value;
    }
  }

  // Agregar la IP del cliente si no viene ya x-forwarded-for.
  if (!headers['x-forwarded-for'] && req.ip) {
    headers['x-forwarded-for'] = req.ip;
  }

  const hasBody = ['POST', 'PATCH', 'PUT'].includes(req.method);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const upstream = await fetch(url.toString(), {
      method: req.method,
      headers,
      body: hasBody ? JSON.stringify(req.body) : undefined,
      signal: controller.signal,
    });

    const text = await upstream.text();

    res.status(upstream.status);
    upstream.headers.forEach((value, key) => {
      if (['content-type', 'content-length'].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    res.send(text);
  } catch (err) {
    if ((err as Error).name === 'AbortError') {
      res.status(503).json({
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Core service timeout',
          statusCode: 503,
        },
      });
    } else {
      res.status(503).json({
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Core service unavailable',
          statusCode: 503,
        },
      });
    }
  } finally {
    clearTimeout(timeout);
  }
}
