import jwt from 'jsonwebtoken';

import config from '../config';

import { errors } from '../constants';
const { ServerError } = require('../errors');

const { ERROR_CODES, ERROR_MESSAGES, ERROR_STATUS_CODE } = errors;

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      throw new ServerError(
        ERROR_MESSAGES.AUTHOIZATION_TOKEN_REQUIRED,
        ERROR_CODES.UNAUTHORIZED,
        ERROR_STATUS_CODE.UNAUTHORIZED,
      );
    }

    const decoded = jwt.verify(token, config.publicKey);
    req['x-user-id'] = decoded['x-user-id'];
    next();
  } catch (error) {
    return res.status(error.statusCode).json({
      message: error.message,
      code: error.code,
    });
  }
};

export default authMiddleware;
