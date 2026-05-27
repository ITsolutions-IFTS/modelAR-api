import { Request, Response } from 'express';
import { loginUseCase } from '../../Application/use-cases/auth/login.use-case';
import { registerUseCase } from '../../Application/use-cases/auth/register.use-case';
import { ClientRepositoryPg } from '../repositories/client.repository.pg';
import { env } from '../config/env';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const clientRepository = new ClientRepositoryPg();

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const result = await loginUseCase(
      { email, password },
      clientRepository,
      env.JWT_SECRET,
      env.JWT_EXPIRES_IN,
    );

    if (!result) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    res.json(result);
  } catch (err) {
    console.error('[auth/login]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, name, orgSlug } = req.body as {
      email?: string;
      password?: string;
      name?: string;
      orgSlug?: string;
    };

    if (!email || !password || !name || !orgSlug) {
      res.status(400).json({ error: 'email, password, name and orgSlug are required' });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters' });
      return;
    }

    const result = await registerUseCase(
      { email, password, name, orgSlug },
      clientRepository,
      env.JWT_SECRET,
      env.JWT_EXPIRES_IN,
    );

    res.status(201).json(result);
  } catch (err) {
    if (err instanceof Error && err.message === 'Email already registered') {
      res.status(409).json({ error: err.message });
      return;
    }
    console.error('[auth/register]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export function me(req: Request, res: Response): void {
  const authReq = req as AuthenticatedRequest;
  res.json({ client: authReq.client });
}

export function logout(_req: Request, res: Response): void {
  res.json({ success: true });
}
