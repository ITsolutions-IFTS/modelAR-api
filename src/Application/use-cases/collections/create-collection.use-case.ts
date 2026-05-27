import { v4 as uuidv4 } from 'uuid';
import { ICollectionRepository } from '../../../Domain/repositories/collection.repository';
import { CollectionEntity } from '../../../Domain/entities/collection.entity';

export interface CreateCollectionInput {
  name: string;
  description?: string;
}

export async function createCollectionUseCase(
  data: CreateCollectionInput,
  orgSlug: string,
  repo: ICollectionRepository,
): Promise<CollectionEntity> {
  return repo.create({
    id: uuidv4(),
    orgSlug,
    name: data.name,
    description: data.description ?? null,
  });
}
