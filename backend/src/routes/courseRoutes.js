import { Router } from 'express';
import { functionMiddleware, logMiddleware, authMiddleware } from '../middleware';

const router = new Router();

const courseRoutes = (app) => {
  const { courseController } = app.locals.controller;
  router.get(
    '/:courseId/:subCourseId',
    authMiddleware,
    logMiddleware,
    functionMiddleware(courseController.getCourseById),
  );
  router.patch(
    '/:courseId/:subCourseId',
    authMiddleware,
    logMiddleware,
    functionMiddleware(courseController.computeCourseProgress),
  );
  router.post(
    '/quiz/result',
    authMiddleware,
    logMiddleware,
    functionMiddleware(courseController.computeQuizResult),
  );

  return router;
};

module.exports = courseRoutes;
