const ExpressError = require('../errors/ExpressError');
const businessValidation = require('../validations/businessValidation');

// Validation middleware
const validateBusiness = (req, res, next) => {
  const { error } = businessValidation.validate(req.body);

  if (error) {
    const message = error.details.map((detail) => detail.message).join(', ');

    throw new ExpressError(message, 400);
  }

  next();
};

module.exports = validateBusiness;
