export interface AnalyticsEventEntity {
  id: string;
  campaignId: string;
  eventType: 'view' | 'ar_activation' | 'cta_click';
  userAgent: string | null;
  timestamp: Date;
}
