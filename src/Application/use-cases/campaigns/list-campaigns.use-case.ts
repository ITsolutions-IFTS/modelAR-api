import { ICampaignRepository } from '../../../Domain/repositories/campaign.repository';
import { CampaignEntity } from '../../../Domain/entities/campaign.entity';

export async function listCampaignsUseCase(
  clientId: string,
  repo: ICampaignRepository,
): Promise<CampaignEntity[]> {
  return repo.findByClientId(clientId);
}
