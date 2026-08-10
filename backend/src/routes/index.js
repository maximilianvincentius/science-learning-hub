const { Router } = require('express');
const userRoutes = require('./userRoutes');
const simulationRoutes = require('./simulationRoutes');
const courseRoutes = require('./courseRoutes');
const articleRoutes = require('./articleRoutes');
const searchRoutes = require('./searchRoutes');

const router = new Router();

const routes = (app) => {
  router.use('/users', userRoutes(app));
  router.use('/simulations', simulationRoutes(app));
  router.use('/courses', courseRoutes(app));
  router.use('/articles', articleRoutes(app));
  router.use('/search', searchRoutes(app));

  app.use(router);
};

module.exports = routes;
