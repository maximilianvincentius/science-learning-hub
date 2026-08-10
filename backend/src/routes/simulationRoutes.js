import { Router } from 'express';
import { functionMiddleware, logMiddleware, authMiddleware } from '../middleware';

const router = new Router();

const simulationRoutes = (app) => {
  const { simulationController } = app.locals.controller;
  router.get(
    '/',
    authMiddleware,
    logMiddleware,
    functionMiddleware(simulationController.getSimulationList),
  );
  router.get('/public', logMiddleware, functionMiddleware(simulationController.getSimulationList));
  router.get(
    '/:id/public',
    logMiddleware,
    functionMiddleware(simulationController.getSimulationById),
  );
  router.get(
    '/:id',
    authMiddleware,
    logMiddleware,
    functionMiddleware(simulationController.getSimulationById),
  );
  router.post(
    '/:id/enroll',
    authMiddleware,
    logMiddleware,
    functionMiddleware(simulationController.enrollSimulation),
  );

  return router;
};

module.exports = simulationRoutes;
