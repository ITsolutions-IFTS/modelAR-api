import { ICampaignRepository } from '../../../Domain/repositories/campaign.repository';
import { CampaignEntity } from '../../../Domain/entities/campaign.entity';
import { getCampaignUseCase } from './get-campaign.use-case';
import { CreateCampaignInput } from './create-campaign.use-case';

export async function updateCampaignUseCase(
  id: string,
  clientId: string,
  data: Partial<CreateCampaignInput>,
  repo: ICampaignRepository,
): Promise<CampaignEntity | null> {
  const existing = await getCampaignUseCase(id, clientId, repo);
  if (!existing) {
    return null;
  }

  return repo.update(id, {
    ...(data.title !== undefined && { title: data.title }),
    ...(data.description !== undefined && { description: data.description }),
    ...(data.sector !== undefined && { sector: data.sector }),
    ...(data.sketchfabUid !== undefined && { sketchfabUid: data.sketchfabUid }),
    ...(data.ctaUrl !== undefined && { ctaUrl: data.ctaUrl }),
    ...(data.collectionId !== undefined && { collectionId: data.collectionId }),
  });
}
