import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import sequelize from '../config/database';
import CampaignModel from './campaign.model';

export class AnalyticsEventModel extends Model<
  InferAttributes<AnalyticsEventModel>,
  InferCreationAttributes<AnalyticsEventModel>
> {
  declare id: CreationOptional<string>;
  declare campaign_id: ForeignKey<CampaignModel['id']>;
  declare event_type: 'view' | 'ar_activation' | 'cta_click';
  declare user_agent: CreationOptional<string | null>;
  declare timestamp: CreationOptional<Date>;
}

AnalyticsEventModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    campaign_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'campaigns', key: 'id' },
      onDelete: 'CASCADE',
    },
    event_type: {
      type: DataTypes.ENUM('view', 'ar_activation', 'cta_click'),
      allowNull: false,
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'AnalyticsEvent',
    tableName: 'analytics_events',
    timestamps: false,
  },
);

AnalyticsEventModel.belongsTo(CampaignModel, { foreignKey: 'campaign_id' });
CampaignModel.hasMany(AnalyticsEventModel, { foreignKey: 'campaign_id' });

export default AnalyticsEventModel;
