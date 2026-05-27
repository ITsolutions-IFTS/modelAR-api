export interface CampaignEntity {
  id: string;
  clientId: string;
  orgSlug: string;
  title: string;
  description: string | null;
  sector: 'ecommerce' | 'turismo' | 'educacion' | 'inmobiliario' | 'museo';
  sketchfabUid: string;
  ctaUrl: string | null;
  qrValue: string;
  collectionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
