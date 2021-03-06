const mongoose = require('mongoose');

const catchAsync = require('../helpers/catchAsync');
const Review = require('../models/review');

exports.addReview = catchAsync(async (req, res) => {
  const id = req.params.id;
  const reviewData = {
    ...req.body.review,
    business: mongoose.Types.ObjectId(id),
  };

  const review = new Review(reviewData);

  await review.save();

  req.flash('success', 'Review successfully added!');

  res.redirect(`/biz/${id}`);
});

exports.deleteReview = catchAsync(async (req, res) => {
  const id = req.params.id;
  const reviewId = req.params.reviewId;

  await Review.findByIdAndDelete(reviewId);

  req.flash('warning', 'Review successfully deleted!');

  res.redirect(`/biz/${id}`);
});
