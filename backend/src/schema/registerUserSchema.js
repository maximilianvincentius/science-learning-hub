const Joi = require('joi');

const registerUserSchema = Joi.object({
  email: Joi.string().email({
    tlds: { allow: false },
  }),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().trim().required(),
  dateOfBirth: Joi.date().required(),
});

export default registerUserSchema;
