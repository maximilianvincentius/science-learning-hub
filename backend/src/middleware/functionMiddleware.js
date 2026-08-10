const errorHandler = (callbackFunction) => {
  return async (request, response, next) => {
    await callbackFunction(request, response, next).catch((error) =>
      response.status(error.statusCode || 500).json({
        message: error.message || 'Internal Server Error',
        code: error.code || 'INTERNAL_ERROR',
      }),
    );
  };
};

export default errorHandler;
