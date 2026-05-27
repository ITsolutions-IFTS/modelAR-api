import { ICollectionRepository } from '../../../Domain/repositories/collection.repository';
import { CollectionEntity } from '../../../Domain/entities/collection.entity';

export async function listCollectionsUseCase(
  orgSlug: string,
  repo: ICollectionRepository,
): Promise<CollectionEntity[]> {
  return repo.findByOrgSlug(orgSlug);
}
