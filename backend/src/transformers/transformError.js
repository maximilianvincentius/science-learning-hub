const transformError = (errorCode, errorMessage) => ({
  code: errorCode,
  message: errorMessage,
});

module.exports = { transformError };
