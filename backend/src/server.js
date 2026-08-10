import app from './app';
import logger from './config/logger';
import config from './config/index';
import startDB from './config/db';
import seeder from './seeders';

startDB()
  .then(() => {
    const isSeederActive = JSON.parse(config.seederActive);
    if (isSeederActive) {
      seeder();
    }
    app.listen(config.port);
    logger.info(`Server started on ${config.protocol}://${config.host}:${config.port}`);
  })
  .catch(() => {
    logger.error('Failed to start server due to database connection issue');
  });
