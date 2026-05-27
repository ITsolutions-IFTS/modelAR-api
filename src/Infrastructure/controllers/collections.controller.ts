import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { CollectionRepositoryPg } from '../repositories/collection.repository.pg';
import { asyncHandler } from '../lib/async-handler';
import { listCollectionsUseCase } from '../../Application/use-cases/collections/list-collections.use-case';
import { createCollectionUseCase } from '../../Application/use-cases/collections/create-collection.use-case';
import { updateCollectionUseCase } from '../../Application/use-cases/collections/update-collection.use-case';
import { deleteCollectionUseCase } from '../../Application/use-cases/collections/delete-collection.use-case';

const repo = new CollectionRepositoryPg();

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { orgSlug } = (req as AuthenticatedRequest).client;
  const collections = await listCollectionsUseCase(orgSlug, repo);
  res.json(collections);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const { orgSlug } = (req as AuthenticatedRequest).client;
  const { name, description } = req.body as Record<string, unknown>;

  if (!name || typeof name !== 'string') {
    res.status(400).json({ error: 'name is required' });
    return;
  }

  const collection = await createCollectionUseCase(
    { name, description: typeof description === 'string' ? description : undefined },
    orgSlug,
    repo,
  );
  res.status(201).json(collection);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { orgSlug } = (req as AuthenticatedRequest).client;
  const { id } = req.params;
  const { name, description } = req.body as Record<string, unknown>;

  const collection = await updateCollectionUseCase(
    id,
    orgSlug,
    {
      ...(typeof name === 'string' && { name }),
      ...(typeof description === 'string' && { description }),
    },
    repo,
  );

  if (!collection) {
    res.status(404).json({ error: 'Collection not found' });
    return;
  }
  res.json(collection);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { orgSlug } = (req as AuthenticatedRequest).client;
  const { id } = req.params;
  const deleted = await deleteCollectionUseCase(id, orgSlug, repo);
  if (!deleted) {
    res.status(404).json({ error: 'Collection not found' });
    return;
  }
  res.json({ success: true });
});
