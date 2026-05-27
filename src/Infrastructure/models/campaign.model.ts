import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import sequelize from '../config/database';
import ClientModel from './client.model';

export class CampaignModel extends Model<
  InferAttributes<CampaignModel>,
  InferCreationAttributes<CampaignModel>
> {
  declare id: CreationOptional<string>;
  declare client_id: ForeignKey<ClientModel['id']>;
  declare org_slug: string;
  declare title: string;
  declare description: string | null;
  declare sector: 'ecommerce' | 'turismo' | 'educacion' | 'inmobiliario' | 'museo';
  declare sketchfab_uid: string;
  declare cta_url: string | null;
  declare qr_value: CreationOptional<string | null>;
  declare collection_id: CreationOptional<string | null>;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

CampaignModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    client_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'clients', key: 'id' },
      onDelete: 'CASCADE',
    },
    org_slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    sector: {
      type: DataTypes.ENUM('ecommerce', 'turismo', 'educacion', 'inmobiliario', 'museo'),
      allowNull: false,
    },
    sketchfab_uid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cta_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    qr_value: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    collection_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Campaign',
    tableName: 'campaigns',
    timestamps: true,
    underscored: true,
  },
);

CampaignModel.belongsTo(ClientModel, { foreignKey: 'client_id' });
ClientModel.hasMany(CampaignModel, { foreignKey: 'client_id' });

export default CampaignModel;
