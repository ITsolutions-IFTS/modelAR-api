import { IClientRepository } from '../../Domain/repositories/client.repository';
import { ClientEntity } from '../../Domain/entities/client.entity';
import ClientModel from '../models/client.model';

export class ClientRepositoryPg implements IClientRepository {
  private toEntity(model: ClientModel): ClientEntity {
    return {
      id: model.id,
      email: model.email,
      passwordHash: model.password_hash,
      name: model.name,
      orgSlug: model.org_slug,
      role: model.role,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }

  async findByEmail(email: string): Promise<ClientEntity | null> {
    const record = await ClientModel.findOne({ where: { email } });
    return record ? this.toEntity(record) : null;
  }

  async findById(id: string): Promise<ClientEntity | null> {
    const record = await ClientModel.findByPk(id);
    return record ? this.toEntity(record) : null;
  }

  async create(
    data: Omit<ClientEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ClientEntity> {
    const record = await ClientModel.create({
      email: data.email,
      password_hash: data.passwordHash,
      name: data.name,
      org_slug: data.orgSlug,
      role: data.role,
    });
    return this.toEntity(record);
  }
}
