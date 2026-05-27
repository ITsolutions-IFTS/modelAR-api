import { Request, Response } from 'express';
import { trackEventUseCase } from '../../Application/use-cases/analytics/track-event.use-case';
import { CampaignRepositoryPg } from '../repositories/campaign.repository.pg';
import { AnalyticsEventRepositoryPg } from '../repositories/analytics-event.repository.pg';

const VALID_EVENT_TYPES = ['view', 'ar_activation', 'cta_click'] as const;
type EventType = (typeof VALID_EVENT_TYPES)[number];

function isValidEventType(value: unknown): value is EventType {
  return VALID_EVENT_TYPES.includes(value as EventType);
}

export async function track(req: Request, res: Response): Promise<void> {
  const { campaign_id, event_type } = req.body as Record<string, unknown>;

  if (!campaign_id || typeof campaign_id !== 'string') {
    res.status(400).json({ error: 'campaign_id is required' });
    return;
  }

  if (!event_type) {
    res.status(400).json({ error: 'event_type is required' });
    return;
  }

  if (!isValidEventType(event_type)) {
    res
      .status(400)
      .json({ error: `Invalid event_type. Must be one of: ${VALID_EVENT_TYPES.join(', ')}` });
    return;
  }

  const userAgent = (req.headers['user-agent'] as string) ?? null;

  try {
    const campaignRepo = new CampaignRepositoryPg();
    const eventRepo = new AnalyticsEventRepositoryPg();

    const event = await trackEventUseCase(campaign_id, event_type, userAgent, campaignRepo, eventRepo);

    res.status(201).json({
      success: true,
      event: {
        id: event.id,
        campaign_id: event.campaignId,
        event_type: event.eventType,
        timestamp: event.timestamp,
      },
    });
  } catch (err) {
    if (err instanceof Error && err.message === 'Campaign not found') {
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}
