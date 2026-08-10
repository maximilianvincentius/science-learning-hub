const ERROR_MESSAGES = {
  USER_NOT_FOUND: 'User not found.',
  INSUFFICIENT_CREDITS:
    'You have an active simulation. Please complete the simulation first before enrolling to another simulation.',
  INTERNAL_SERVER_ERROR: 'An internal server error occurred.',
  COURSE_NOT_FOUND: 'The course you are trying to access does not exist.',
  AUTHOIZATION_TOKEN_REQUIRED: 'Authorization token required!',
  ARTICLE_NOT_FOUND: 'The article you are trying to access does not exist.',
  ALREADY_ENROLLED: 'You are already enrolled in this course.',
};
const ERROR_CODES = {
  INSUFFICIENT_CREDITS: 'INSUFFICIENT_CREDITS',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  COURSE_NOT_FOUND: 'COURSE_NOT_FOUND',
  ARTICLE_NOT_FOUND: 'ARTICLE_NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  ALREADY_ENROLLED: 'ALREADY_ENROLLED',
};

const ERROR_STATUS_CODE = {
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
};

module.exports = {
  ERROR_CODES,
  ERROR_MESSAGES,
  ERROR_STATUS_CODE,
};
