import { Op, WhereOptions } from 'sequelize';
import { IAnalyticsEventRepository } from '../../Domain/repositories/analytics-event.repository';
import { AnalyticsEventEntity } from '../../Domain/entities/analytics-event.entity';
import AnalyticsEventModel from '../models/analytics-event.model';
import { InferAttributes } from 'sequelize';

export class AnalyticsEventRepositoryPg implements IAnalyticsEventRepository {
  private toEntity(model: AnalyticsEventModel): AnalyticsEventEntity {
    return {
      id: model.id,
      campaignId: model.campaign_id as string,
      eventType: model.event_type,
      userAgent: model.user_agent ?? null,
      timestamp: model.timestamp,
    };
  }

  async create(data: Omit<AnalyticsEventEntity, 'id'>): Promise<AnalyticsEventEntity> {
    const record = await AnalyticsEventModel.create({
      campaign_id: data.campaignId,
      event_type: data.eventType,
      user_agent: data.userAgent,
      timestamp: data.timestamp,
    });
    return this.toEntity(record);
  }

  async findByCampaignId(
    campaignId: string,
    since?: Date,
    until?: Date,
  ): Promise<AnalyticsEventEntity[]> {
    const where: WhereOptions<InferAttributes<AnalyticsEventModel>> = {
      campaign_id: campaignId,
    };

    if (since && until) {
      where.timestamp = { [Op.between]: [since, until] };
    } else if (since) {
      where.timestamp = { [Op.gte]: since };
    } else if (until) {
      where.timestamp = { [Op.lte]: until };
    }

    const records = await AnalyticsEventModel.findAll({ where });
    return records.map((r) => this.toEntity(r));
  }
}
