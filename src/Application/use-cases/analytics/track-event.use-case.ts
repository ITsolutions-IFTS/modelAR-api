import { AnalyticsEventEntity } from '../../../Domain/entities/analytics-event.entity';
import { IAnalyticsEventRepository } from '../../../Domain/repositories/analytics-event.repository';
import { ICampaignRepository } from '../../../Domain/repositories/campaign.repository';
import { NotFoundError } from '../../../Domain/errors';

export async function trackEventUseCase(
  campaignId: string,
  eventType: 'view' | 'ar_activation' | 'cta_click',
  userAgent: string | null,
  campaignRepo: ICampaignRepository,
  eventRepo: IAnalyticsEventRepository,
): Promise<AnalyticsEventEntity> {
  const campaign = await campaignRepo.findById(campaignId);
  if (!campaign) {
    throw new NotFoundError('Campaign not found');
  }

  const event = await eventRepo.create({
    campaignId,
    eventType,
    userAgent,
    timestamp: new Date(),
  });

  return event;
}
