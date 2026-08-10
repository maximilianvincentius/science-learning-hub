import { Router } from 'express';
import { functionMiddleware, logMiddleware } from '../middleware';

const router = new Router();

const searchRoutes = (app) => {
  const { searchController } = app.locals.controller;
  router.get('/', logMiddleware, functionMiddleware(searchController.searchArticlesAndCourses));

  return router;
};

module.exports = searchRoutes;
