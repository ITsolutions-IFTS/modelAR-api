import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { getCampaignAnalyticsUseCase } from '../../Application/use-cases/analytics/get-campaign-analytics.use-case';
import { CampaignRepositoryPg } from '../repositories/campaign.repository.pg';
import { AnalyticsEventRepositoryPg } from '../repositories/analytics-event.repository.pg';

export async function getCampaignAnalytics(req: Request, res: Response): Promise<void> {
  const { id: clientId } = (req as AuthenticatedRequest).client;
  const { id: campaignId } = req.params;
  const { since: sinceQuery, until: untilQuery } = req.query as Record<string, string | undefined>;

  const since = sinceQuery ? new Date(sinceQuery) : undefined;
  const until = untilQuery ? new Date(untilQuery) : undefined;

  try {
    const campaignRepo = new CampaignRepositoryPg();
    const eventRepo = new AnalyticsEventRepositoryPg();

    const result = await getCampaignAnalyticsUseCase(
      campaignId,
      clientId,
      campaignRepo,
      eventRepo,
      since,
      until,
    );

    res.json(result);
  } catch (err) {
    if (err instanceof Error && err.message === 'Campaign not found') {
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}
