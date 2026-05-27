import { createCollectionUseCase } from '../Application/use-cases/collections/create-collection.use-case';
import { listCollectionsUseCase } from '../Application/use-cases/collections/list-collections.use-case';
import { updateCollectionUseCase } from '../Application/use-cases/collections/update-collection.use-case';
import { deleteCollectionUseCase } from '../Application/use-cases/collections/delete-collection.use-case';
import type { ICollectionRepository } from '../Domain/repositories/collection.repository';
import type { CollectionEntity } from '../Domain/entities/collection.entity';

const NOW = new Date();

function makeRepo(overrides: Partial<ICollectionRepository> = {}): ICollectionRepository {
  return {
    findByOrgSlug: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    ...overrides,
  };
}

function makeCollection(o: Partial<CollectionEntity> = {}): CollectionEntity {
  return {
    id: 'col-1',
    orgSlug: 'santillana',
    name: 'Serie A',
    description: null,
    createdAt: NOW,
    updatedAt: NOW,
    ...o,
  };
}

describe('createCollectionUseCase', () => {
  it('llama repo.create con id UUID, orgSlug y nombre', async () => {
    const createFn = jest.fn().mockImplementation((e: CollectionEntity) => Promise.resolve(e));
    const repo = makeRepo({ create: createFn });

    const result = await createCollectionUseCase({ name: 'Serie A' }, 'santillana', repo);

    expect(createFn).toHaveBeenCalledTimes(1);
    const arg: CollectionEntity = createFn.mock.calls[0][0];
    expect(arg.name).toBe('Serie A');
    expect(arg.orgSlug).toBe('santillana');
    expect(arg.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(result.name).toBe('Serie A');
  });

  it('description es null cuando no se provee', async () => {
    const createFn = jest.fn().mockImplementation((e: CollectionEntity) => Promise.resolve(e));
    const repo = makeRepo({ create: createFn });

    await createCollectionUseCase({ name: 'Serie B' }, 'santillana', repo);

    const arg: CollectionEntity = createFn.mock.calls[0][0];
    expect(arg.description).toBeNull();
  });
});

describe('listCollectionsUseCase', () => {
  it('delega al repo filtrando por orgSlug', async () => {
    const cols = [makeCollection()];
    const repo = makeRepo({ findByOrgSlug: jest.fn().mockResolvedValue(cols) });

    const result = await listCollectionsUseCase('santillana', repo);

    expect(repo.findByOrgSlug).toHaveBeenCalledWith('santillana');
    expect(result).toEqual(cols);
  });

  it('retorna arreglo vacío si no hay colecciones', async () => {
    const repo = makeRepo({ findByOrgSlug: jest.fn().mockResolvedValue([]) });

    const result = await listCollectionsUseCase('garbarino', repo);

    expect(result).toHaveLength(0);
  });
});

describe('updateCollectionUseCase', () => {
  it('retorna la colección actualizada', async () => {
    const updated = makeCollection({ name: 'Serie Editada' });
    const repo = makeRepo({ update: jest.fn().mockResolvedValue(updated) });

    const result = await updateCollectionUseCase('col-1', 'santillana', { name: 'Serie Editada' }, repo);

    expect(result?.name).toBe('Serie Editada');
  });

  it('retorna null si la colección no existe', async () => {
    const repo = makeRepo({ update: jest.fn().mockResolvedValue(null) });

    const result = await updateCollectionUseCase('missing', 'santillana', { name: 'X' }, repo);

    expect(result).toBeNull();
  });
});

describe('deleteCollectionUseCase', () => {
  it('retorna true cuando borra exitosamente', async () => {
    const repo = makeRepo({ delete: jest.fn().mockResolvedValue(true) });

    const result = await deleteCollectionUseCase('col-1', 'santillana', repo);

    expect(result).toBe(true);
    expect(repo.delete).toHaveBeenCalledWith('col-1', 'santillana');
  });

  it('retorna false si la colección no existe', async () => {
    const repo = makeRepo({ delete: jest.fn().mockResolvedValue(false) });

    const result = await deleteCollectionUseCase('missing', 'santillana', repo);

    expect(result).toBe(false);
  });
});
