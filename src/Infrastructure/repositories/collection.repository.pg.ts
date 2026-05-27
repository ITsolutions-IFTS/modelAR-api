import { ICollectionRepository } from '../../Domain/repositories/collection.repository';
import { CollectionEntity } from '../../Domain/entities/collection.entity';
import CollectionModel from '../models/collection.model';

export class CollectionRepositoryPg implements ICollectionRepository {
  private toEntity(m: CollectionModel): CollectionEntity {
    return {
      id: m.id,
      orgSlug: m.org_slug,
      name: m.name,
      description: m.description,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
    };
  }

  async findByOrgSlug(orgSlug: string): Promise<CollectionEntity[]> {
    const rows = await CollectionModel.findAll({ where: { org_slug: orgSlug } });
    return rows.map((r) => this.toEntity(r));
  }

  async findById(id: string): Promise<CollectionEntity | null> {
    const row = await CollectionModel.findByPk(id);
    return row ? this.toEntity(row) : null;
  }

  async create(data: Omit<CollectionEntity, 'createdAt' | 'updatedAt'>): Promise<CollectionEntity> {
    const row = await CollectionModel.create({
      id: data.id,
      org_slug: data.orgSlug,
      name: data.name,
      description: data.description,
    });
    return this.toEntity(row);
  }

  async update(
    id: string,
    orgSlug: string,
    data: Partial<Pick<CollectionEntity, 'name' | 'description'>>,
  ): Promise<CollectionEntity | null> {
    const row = await CollectionModel.findOne({ where: { id, org_slug: orgSlug } });
    if (!row) return null;
    await row.update({
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
    });
    return this.toEntity(row);
  }

  async delete(id: string, orgSlug: string): Promise<boolean> {
    const deleted = await CollectionModel.destroy({ where: { id, org_slug: orgSlug } });
    return deleted > 0;
  }
}
