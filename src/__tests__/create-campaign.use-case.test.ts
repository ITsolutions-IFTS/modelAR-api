import { createCampaignUseCase, CreateCampaignInput } from '../Application/use-cases/campaigns/create-campaign.use-case';
import type { ICampaignRepository } from '../Domain/repositories/campaign.repository';
import type { CampaignEntity } from '../Domain/entities/campaign.entity';

function makeRepo(overrides: Partial<ICampaignRepository> = {}): ICampaignRepository {
  return {
    create: jest.fn(),
    findByClientId: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    ...overrides,
  };
}

const input: CreateCampaignInput = {
  title: 'Campaña educativa',
  sector: 'educacion',
  sketchfabUid: 'abc-uid-123',
};

describe('createCampaignUseCase', () => {
  it('construye qrValue como URL con el sketchfabUid', async () => {
    const repo = makeRepo({
      create: jest.fn().mockImplementation((e: CampaignEntity) => Promise.resolve(e)),
    });

    const result = await createCampaignUseCase(input, 'client-1', 'santillana', repo, 'https://app.modelar.ar');

    expect(result.qrValue).toBe('https://app.modelar.ar/#/ar/abc-uid-123');
  });

  it('asigna un UUID como id de la campaña', async () => {
    const repo = makeRepo({
      create: jest.fn().mockImplementation((e: CampaignEntity) => Promise.resolve(e)),
    });

    const result = await createCampaignUseCase(input, 'client-1', 'santillana', repo, 'https://app.modelar.ar');

    expect(result.id).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('ctaUrl es null cuando no se provee', async () => {
    const repo = makeRepo({
      create: jest.fn().mockImplementation((e: CampaignEntity) => Promise.resolve(e)),
    });

    const result = await createCampaignUseCase(input, 'client-1', 'santillana', repo, 'https://app.modelar.ar');

    expect(result.ctaUrl).toBeNull();
  });

  it('ctaUrl se asigna cuando se provee', async () => {
    const repo = makeRepo({
      create: jest.fn().mockImplementation((e: CampaignEntity) => Promise.resolve(e)),
    });
    const withCta = { ...input, ctaUrl: 'https://santillana.com' };

    const result = await createCampaignUseCase(withCta, 'client-1', 'santillana', repo, 'https://app.modelar.ar');

    expect(result.ctaUrl).toBe('https://santillana.com');
  });

  it('pasa clientId y orgSlug al repositorio', async () => {
    const createFn = jest.fn().mockImplementation((e: CampaignEntity) => Promise.resolve(e));
    const repo = makeRepo({ create: createFn });

    await createCampaignUseCase(input, 'client-42', 'garbarino', repo, 'https://app.modelar.ar');

    const created: CampaignEntity = createFn.mock.calls[0][0];
    expect(created.clientId).toBe('client-42');
    expect(created.orgSlug).toBe('garbarino');
  });
});
