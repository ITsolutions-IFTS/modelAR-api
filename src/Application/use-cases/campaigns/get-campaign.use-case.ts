import { ICampaignRepository } from '../../../Domain/repositories/campaign.repository';
import { CampaignEntity } from '../../../Domain/entities/campaign.entity';

export async function getCampaignUseCase(
  id: string,
  clientId: string,
  repo: ICampaignRepository,
): Promise<CampaignEntity | null> {
  const campaign = await repo.findById(id);
  if (!campaign || campaign.clientId !== clientId) {
    return null;
  }
  return campaign;
}
