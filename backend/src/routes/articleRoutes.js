const { Router } = require('express');
const { functionMiddleware, logMiddleware } = require('../middleware');

const router = new Router();

const articleRoutes = (app) => {
  const { articleController } = app.locals.controller;
  router.get('/', logMiddleware, functionMiddleware(articleController.getArticles));
  router.get('/:id', logMiddleware, functionMiddleware(articleController.getArticleById));

  return router;
};

module.exports = articleRoutes;
