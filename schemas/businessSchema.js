const Joi = require('joi');

const businessSchema = Joi.object({
  business: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zip: Joi.string().required(),
    phone: Joi.string().required(),
    website: Joi.string().required().uri(),
    image: Joi.string().required().uri(),
  }).required(),
});

module.exports = businessSchema;
