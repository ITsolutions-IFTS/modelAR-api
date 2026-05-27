import { ICampaignRepository } from '../../../Domain/repositories/campaign.repository';
import { CampaignEntity } from '../../../Domain/entities/campaign.entity';

export async function getPublicCampaignUseCase(
  id: string,
  repo: ICampaignRepository,
): Promise<CampaignEntity | null> {
  return repo.findById(id);
}
