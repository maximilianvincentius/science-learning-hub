import logger from '../config/logger';

const logMiddleware = (req, res, next) => {
  const start = Date.now();

  const headers = { ...req.headers };
  if (headers.authorization) {
    headers.authorization = '[REDACTED]';
  }

  // Log request
  logger.info({
    event: 'request',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    query: req.query,
    headers,
    body: req.body,
  });

  // Log response
  res.on('finish', () => {
    logger.info({
      event: 'response',
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${Date.now() - start}ms`,
    });
  });

  next();
};

export default logMiddleware;
