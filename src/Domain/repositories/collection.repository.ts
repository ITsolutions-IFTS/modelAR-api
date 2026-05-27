import { CollectionEntity } from '../entities/collection.entity';

export interface ICollectionRepository {
  findByOrgSlug(orgSlug: string): Promise<CollectionEntity[]>;
  findById(id: string): Promise<CollectionEntity | null>;
  create(data: Omit<CollectionEntity, 'createdAt' | 'updatedAt'>): Promise<CollectionEntity>;
  update(id: string, orgSlug: string, data: Partial<Pick<CollectionEntity, 'name' | 'description'>>): Promise<CollectionEntity | null>;
  delete(id: string, orgSlug: string): Promise<boolean>;
}
