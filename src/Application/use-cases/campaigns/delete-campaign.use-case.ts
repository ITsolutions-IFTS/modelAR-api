import { ICampaignRepository } from '../../../Domain/repositories/campaign.repository';
import { getCampaignUseCase } from './get-campaign.use-case';

export async function deleteCampaignUseCase(
  id: string,
  clientId: string,
  repo: ICampaignRepository,
): Promise<boolean> {
  const existing = await getCampaignUseCase(id, clientId, repo);
  if (!existing) {
    return false;
  }

  return repo.delete(id);
}
