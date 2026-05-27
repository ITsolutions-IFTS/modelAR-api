import { ICollectionRepository } from '../../../Domain/repositories/collection.repository';
import { CollectionEntity } from '../../../Domain/entities/collection.entity';

export async function updateCollectionUseCase(
  id: string,
  orgSlug: string,
  data: Partial<Pick<CollectionEntity, 'name' | 'description'>>,
  repo: ICollectionRepository,
): Promise<CollectionEntity | null> {
  return repo.update(id, orgSlug, data);
}
