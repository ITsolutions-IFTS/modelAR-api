import { CampaignEntity } from '../entities/campaign.entity';

export interface ICampaignRepository {
  findById(id: string): Promise<CampaignEntity | null>;
  findByClientId(clientId: string): Promise<CampaignEntity[]>;
  create(
    data: Omit<CampaignEntity, 'id' | 'createdAt' | 'updatedAt'> & { id?: string },
  ): Promise<CampaignEntity>;
  update(id: string, data: Partial<CampaignEntity>): Promise<CampaignEntity | null>;
  delete(id: string): Promise<boolean>;
}
