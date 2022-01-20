const ExpressError = require('../errors/ExpressError');
const reviewValidation = require('../validations/reviewValidation');

// Validation middleware
const validateReview = (req, res, next) => {
  const { error } = reviewValidation.validate(req.body);

  if (error) {
    const message = error.details.map((detail) => detail.message).join(', ');

    throw new ExpressError(message, 400);
  }

  next();
};

module.exports = validateReview;
