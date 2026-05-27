export type ClientPublic = {
  id: string;
  email: string;
  name: string;
  orgSlug: string;
  role: 'superadmin' | 'client';
};

export type JwtPayload = {
  id: string;
  email: string;
  orgSlug: string;
  role: 'superadmin' | 'client';
};

export interface CampaignAnalyticsResult {
  campaign: { id: string; title: string; sector: string };
  stats: { views: number; ar_activations: number; cta_clicks: number };
  breakdown: {
    views: { count: number; pct: number };
    ar_activations: { count: number; pct: number };
    cta_clicks: { count: number; pct: number };
  };
  timeline: Array<{ date: string; views: number; ar: number; clicks: number }>;
}
