import { IAnalyticsEventRepository } from '../../../Domain/repositories/analytics-event.repository';
import { ICampaignRepository } from '../../../Domain/repositories/campaign.repository';
import { CampaignAnalyticsResult } from '../../../Domain/types';
import { NotFoundError, ForbiddenError } from '../../../Domain/errors';

export async function getCampaignAnalyticsUseCase(
  campaignId: string,
  clientId: string,
  campaignRepo: ICampaignRepository,
  eventRepo: IAnalyticsEventRepository,
  since?: Date,
  until?: Date,
): Promise<CampaignAnalyticsResult> {
  const campaign = await campaignRepo.findById(campaignId);
  if (!campaign) {
    throw new NotFoundError('Campaign not found');
  }
  if (campaign.clientId !== clientId) {
    throw new ForbiddenError('Access denied');
  }

  const events = await eventRepo.findByCampaignId(campaignId, since, until);

  const views = events.filter((e) => e.eventType === 'view').length;
  const ar_activations = events.filter((e) => e.eventType === 'ar_activation').length;
  const cta_clicks = events.filter((e) => e.eventType === 'cta_click').length;

  const arPct = views > 0 ? parseFloat(((ar_activations / views) * 100).toFixed(1)) : 0;
  const clickPct =
    ar_activations > 0 ? parseFloat(((cta_clicks / ar_activations) * 100).toFixed(1)) : 0;

  // Group by date
  const grouped: Record<string, { views: number; ar: number; clicks: number }> = {};
  for (const event of events) {
    const date = new Date(event.timestamp).toISOString().split('T')[0];
    if (!grouped[date]) {
      grouped[date] = { views: 0, ar: 0, clicks: 0 };
    }
    if (event.eventType === 'view') grouped[date].views++;
    if (event.eventType === 'ar_activation') grouped[date].ar++;
    if (event.eventType === 'cta_click') grouped[date].clicks++;
  }

  const timeline = Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, data]) => ({ date, ...data }));

  return {
    campaign: {
      id: campaign.id,
      title: campaign.title,
      sector: campaign.sector,
    },
    stats: { views, ar_activations, cta_clicks },
    breakdown: {
      views: { count: views, pct: 100 },
      ar_activations: { count: ar_activations, pct: arPct },
      cta_clicks: { count: cta_clicks, pct: clickPct },
    },
    timeline,
  };
}
