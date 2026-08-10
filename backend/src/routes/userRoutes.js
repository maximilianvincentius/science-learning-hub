import { Router } from 'express';
import { functionMiddleware, schemaMiddleware, logMiddleware, authMiddleware } from '../middleware';
import { registerUserSchema, authenticateUserSchema } from '../schema';

const router = new Router();

const userRoutes = (app) => {
  const { userController } = app.locals.controller;

  router.post(
    '/register',
    schemaMiddleware(registerUserSchema),
    logMiddleware,
    functionMiddleware(userController.createUser),
  );
  router.post(
    '/login',
    schemaMiddleware(authenticateUserSchema),
    logMiddleware,
    functionMiddleware(userController.login),
  );
  router.get(
    '/profile',
    authMiddleware,
    logMiddleware,
    functionMiddleware(userController.getProfile),
  );
  router.patch(
    '/password-reset',
    authMiddleware,
    logMiddleware,
    functionMiddleware(userController.passwordReset),
  );

  return router;
};

module.exports = userRoutes;
