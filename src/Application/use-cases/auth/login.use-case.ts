import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IClientRepository } from '../../../Domain/repositories/client.repository';
import { ClientPublic, JwtPayload } from '../../../Domain/types';
import { ForbiddenError } from '../../../Domain/errors';

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginOutput = {
  token: string;
  client: ClientPublic;
};

export async function loginUseCase(
  input: LoginInput,
  clientRepository: IClientRepository,
  jwtSecret: string,
  jwtExpiresIn: string,
): Promise<LoginOutput> {
  const client = await clientRepository.findByEmail(input.email);
  if (!client) {
    throw new ForbiddenError('Invalid credentials');
  }

  const passwordValid = bcrypt.compareSync(input.password, client.passwordHash);
  if (!passwordValid) {
    throw new ForbiddenError('Invalid credentials');
  }

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
