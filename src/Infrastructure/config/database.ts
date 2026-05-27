import { Sequelize } from 'sequelize';
import { env } from './env';

const uri = `postgres://${env.DB_USER}:${encodeURIComponent(env.DB_PASSWORD)}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`;

const sequelize = new Sequelize(uri, {
  dialect: 'postgres',
  logging: env.NODE_ENV === 'development' ? false : false,
});

export default sequelize;
