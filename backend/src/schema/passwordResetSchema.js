const Joi = require('joi');

const passwordResetSchema = Joi.object({
  newPassword: Joi.string().min(6).required(),
  confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
});

export default passwordResetSchema;
