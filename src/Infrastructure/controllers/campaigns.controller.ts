import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { CampaignRepositoryPg } from '../repositories/campaign.repository.pg';
import { env } from '../config/env';
import { asyncHandler } from '../lib/async-handler';

import { listCampaignsUseCase } from '../../Application/use-cases/campaigns/list-campaigns.use-case';
import { getCampaignUseCase } from '../../Application/use-cases/campaigns/get-campaign.use-case';
import { getPublicCampaignUseCase } from '../../Application/use-cases/campaigns/get-public-campaign.use-case';
import {
  createCampaignUseCase,
  CreateCampaignInput,
} from '../../Application/use-cases/campaigns/create-campaign.use-case';
import { updateCampaignUseCase } from '../../Application/use-cases/campaigns/update-campaign.use-case';
import { deleteCampaignUseCase } from '../../Application/use-cases/campaigns/delete-campaign.use-case';

const VALID_SECTORS = ['ecommerce', 'turismo', 'educacion', 'inmobiliario', 'museo'] as const;
type Sector = (typeof VALID_SECTORS)[number];

function isValidSector(value: unknown): value is Sector {
  return VALID_SECTORS.includes(value as Sector);
}

const campaignRepo = new CampaignRepositoryPg();

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { id: clientId } = (req as AuthenticatedRequest).client;
  const campaigns = await listCampaignsUseCase(clientId, campaignRepo);
  res.json(campaigns);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const { id: clientId } = (req as AuthenticatedRequest).client;
  const { id } = req.params;
  const campaign = await getCampaignUseCase(id, clientId, campaignRepo);
  if (!campaign) {
    res.status(404).json({ error: 'Campaign not found' });
    return;
  }
  res.json(campaign);
});

export const getPublic = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const campaign = await getPublicCampaignUseCase(id, campaignRepo);
  if (!campaign) {
    res.status(404).json({ error: 'Campaign not found' });
    return;
  }
  res.json(campaign);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const { id: clientId, orgSlug } = (req as AuthenticatedRequest).client;
  const { title, description, sector, sketchfabUid, ctaUrl, collectionId } = req.body as Record<
    string,
    unknown
  >;

  if (!title || typeof title !== 'string') {
    res.status(400).json({ error: 'title is required' });
    return;
  }
  if (!isValidSector(sector)) {
    res.status(400).json({
      error: `sector is required and must be one of: ${VALID_SECTORS.join(', ')}`,
    });
    return;
  }
  if (!sketchfabUid || typeof sketchfabUid !== 'string') {
    res.status(400).json({ error: 'sketchfabUid is required' });
    return;
  }

  const input: CreateCampaignInput = {
    title,
    description: description as string | undefined,
    sector,
    sketchfabUid,
    ctaUrl: typeof ctaUrl === 'string' ? ctaUrl : undefined,
    collectionId: collectionId as string | undefined,
  };

  const campaign = await createCampaignUseCase(
    input,
    clientId,
    orgSlug,
    campaignRepo,
    env.FRONTEND_URL,
  );

  res.status(201).json(campaign);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id: clientId } = (req as AuthenticatedRequest).client;
  const { id } = req.params;
  const { title, description, sector, sketchfabUid, ctaUrl, collectionId } = req.body as Record<
    string,
    unknown
  >;

  if (sector !== undefined && !isValidSector(sector)) {
    res.status(400).json({
      error: `sector must be one of: ${VALID_SECTORS.join(', ')}`,
    });
    return;
  }

  const data: Partial<CreateCampaignInput> = {
    ...(title !== undefined && { title: title as string }),
    ...(description !== undefined && { description: description as string }),
    ...(sector !== undefined && { sector: sector as Sector }),
    ...(sketchfabUid !== undefined && { sketchfabUid: sketchfabUid as string }),
    ...(ctaUrl !== undefined && { ctaUrl: ctaUrl as string }),
    ...(collectionId !== undefined && { collectionId: collectionId as string }),
  };

  const campaign = await updateCampaignUseCase(id, clientId, data, campaignRepo);
  if (!campaign) {
    res.status(404).json({ error: 'Campaign not found' });
    return;
  }
  res.json(campaign);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id: clientId } = (req as AuthenticatedRequest).client;
  const { id } = req.params;
  const deleted = await deleteCampaignUseCase(id, clientId, campaignRepo);
  if (!deleted) {
    res.status(404).json({ error: 'Campaign not found' });
    return;
  }
  res.json({ success: true });
});
