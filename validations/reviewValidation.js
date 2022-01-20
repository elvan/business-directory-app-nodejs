const Joi = require('joi');

const reviewValidation = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().min(5).max(500).required(),
  }).required(),
});

module.exports = reviewValidation;
