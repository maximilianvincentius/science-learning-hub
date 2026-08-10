import mongoose from 'mongoose';
import logger from './logger';
import config from './index';

const {
  resources: { host, username, password, collection, cluster },
} = config;

const startDB = async () => {
  const connection = `${host}://${username}:${password}@${cluster}/${collection}`;

  try {
    await mongoose.connect(connection);

    logger.info(`Connected to database: ${cluster}`);
  } catch (err) {
    logger.error(`Failed to connect ${cluster} due ${err}`);

    throw Error();
  }
};

export default startDB;
