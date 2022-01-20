const ExpressError = require('../errors/ExpressError');
const reviewSchema = require('../schemas/reviewSchema');

// Validation middleware
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const message = error.details.map((detail) => detail.message).join(', ');

    throw new ExpressError(message, 400);
  }

  next();
};

module.exports = validateReview;
