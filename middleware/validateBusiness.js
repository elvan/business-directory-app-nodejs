const ExpressError = require('../errors/ExpressError');
const businessSchema = require('../schemas/businessSchema');

// Validation middleware
const validateBusiness = (req, res, next) => {
  const { error } = businessSchema.validate(req.body);

  if (error) {
    const message = error.details.map((detail) => detail.message).join(', ');

    throw new ExpressError(message, 400);
  }

  next();
};

module.exports = validateBusiness;
