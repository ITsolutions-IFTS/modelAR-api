import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IClientRepository } from '../../../Domain/repositories/client.repository';
import { ClientPublic, JwtPayload } from '../../../Domain/types';
import { ConflictError } from '../../../Domain/errors';

export type RegisterInput = {
  email: string;
  password: string;
  name: string;
  orgSlug: string;
};

export type RegisterOutput = {
  token: string;
  client: ClientPublic;
};

export async function registerUseCase(
  input: RegisterInput,
  clientRepository: IClientRepository,
  jwtSecret: string,
  jwtExpiresIn: string,
): Promise<RegisterOutput> {
  const existing = await clientRepository.findByEmail(input.email);
  if (existing) {
    throw new ConflictError('Email already registered');
  }

  const passwordHash = bcrypt.hashSync(input.password, 10);

  const client = await clientRepository.create({
    email: input.email,
    passwordHash,
    name: input.name,
    orgSlug: input.orgSlug,
    role: 'client',
  });

  const payload: JwtPayload = {
    id: client.id,
    email: client.email,
    orgSlug: client.orgSlug,
    role: client.role,
  };

  const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn } as jwt.SignOptions);

  const clientPublic: ClientPublic = {
    id: client.id,
    email: client.email,
    name: client.name,
    orgSlug: client.orgSlug,
    role: client.role,
  };

  return { token, client: clientPublic };
}
