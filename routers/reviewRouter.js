const express = require('express');
const { addReview, deleteReview } = require('../controllers/reviewController');

const validateReview = require('../middleware/validateReview');

const router = express.Router({ mergeParams: true });

router.post('/', validateReview, addReview);

router.delete('/:reviewId', deleteReview);

module.exports = router;
