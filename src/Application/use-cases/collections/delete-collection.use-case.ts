import { ICollectionRepository } from '../../../Domain/repositories/collection.repository';

export async function deleteCollectionUseCase(
  id: string,
  orgSlug: string,
  repo: ICollectionRepository,
): Promise<boolean> {
  return repo.delete(id, orgSlug);
}
