import { v4 as uuidv4 } from 'uuid';
import { ICampaignRepository } from '../../../Domain/repositories/campaign.repository';
import { CampaignEntity } from '../../../Domain/entities/campaign.entity';

export interface CreateCampaignInput {
  title: string;
  description?: string;
  sector: 'ecommerce' | 'turismo' | 'educacion' | 'inmobiliario' | 'museo';
  sketchfabUid: string;
  ctaUrl?: string;
  collectionId?: string;
}

export async function createCampaignUseCase(
  data: CreateCampaignInput,
  clientId: string,
  orgSlug: string,
  repo: ICampaignRepository,
  frontendUrl: string,
): Promise<CampaignEntity> {
  const id = uuidv4();
  const qrValue = `${frontendUrl}/#/ar/${data.sketchfabUid}`;

  return repo.create({
    id,
    clientId,
    orgSlug,
    title: data.title,
    description: data.description ?? null,
    sector: data.sector,
    sketchfabUid: data.sketchfabUid,
    ctaUrl: data.ctaUrl ?? null,
    qrValue,
    collectionId: data.collectionId ?? null,
  });
}
