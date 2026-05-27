import { AnalyticsEventEntity } from '../entities/analytics-event.entity';

export interface IAnalyticsEventRepository {
  create(data: Omit<AnalyticsEventEntity, 'id'>): Promise<AnalyticsEventEntity>;
  findByCampaignId(campaignId: string, since?: Date, until?: Date): Promise<AnalyticsEventEntity[]>;
}
