import { ICampaignRepository } from '../../Domain/repositories/campaign.repository';
import { CampaignEntity } from '../../Domain/entities/campaign.entity';
import CampaignModel from '../models/campaign.model';

export class CampaignRepositoryPg implements ICampaignRepository {
  private toEntity(model: CampaignModel): CampaignEntity {
    return {
      id: model.id,
      clientId: model.client_id as string,
      orgSlug: model.org_slug,
      title: model.title,
      description: model.description,
      sector: model.sector,
      sketchfabUid: model.sketchfab_uid,
      ctaUrl: model.cta_url,
      qrValue: model.qr_value ?? '',
      collectionId: model.collection_id ?? null,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }

  async findById(id: string): Promise<CampaignEntity | null> {
    const record = await CampaignModel.findByPk(id);
    return record ? this.toEntity(record) : null;
  }

  async findByClientId(clientId: string): Promise<CampaignEntity[]> {
    const records = await CampaignModel.findAll({ where: { client_id: clientId } });
    return records.map((r) => this.toEntity(r));
  }

  async create(
    data: Omit<CampaignEntity, 'id' | 'createdAt' | 'updatedAt'> & { id?: string },
  ): Promise<CampaignEntity> {
    const record = await CampaignModel.create({
      ...(data.id !== undefined && { id: data.id }),
      client_id: data.clientId,
      org_slug: data.orgSlug,
      title: data.title,
      description: data.description,
      sector: data.sector,
      sketchfab_uid: data.sketchfabUid,
      cta_url: data.ctaUrl,
      qr_value: data.qrValue,
      collection_id: data.collectionId,
    });
    return this.toEntity(record);
  }

  async update(id: string, data: Partial<CampaignEntity>): Promise<CampaignEntity | null> {
    const record = await CampaignModel.findByPk(id);
    if (!record) return null;

    await record.update({
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.sector !== undefined && { sector: data.sector }),
      ...(data.sketchfabUid !== undefined && { sketchfab_uid: data.sketchfabUid }),
      ...(data.ctaUrl !== undefined && { cta_url: data.ctaUrl }),
      ...(data.qrValue !== undefined && { qr_value: data.qrValue }),
      ...(data.collectionId !== undefined && { collection_id: data.collectionId }),
    });

    return this.toEntity(record);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await CampaignModel.destroy({ where: { id } });
    return deleted > 0;
  }
}
