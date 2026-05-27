import { ClientEntity } from '../entities/client.entity';

export interface IClientRepository {
  findByEmail(email: string): Promise<ClientEntity | null>;
  findById(id: string): Promise<ClientEntity | null>;
  create(data: Omit<ClientEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ClientEntity>;
}
