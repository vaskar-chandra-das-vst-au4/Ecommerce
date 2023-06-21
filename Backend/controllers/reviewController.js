const Product = require('../models/productModel');
const { findOne, findById, findByIdAndDelete } = require('../models/reviewModel');
const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// ! Create and update review
exports.createOrUpdateReview = catchAsync(async (req, res, next) => {
  const { userId, productId, name, rating, comment } = req.body;

  const reviewedAlready = await Review.findOne({ productId, userId });

  let review;

  if (reviewedAlready === null) {
    review = await Review.create({ userId, productId, name, rating, comment });
  } else {
    reviewedAlready.rating = rating;
    await reviewedAlready.save();
  }

  const allrev = await Review.find({ productId });
  const totalRatings = allrev.reduce((acc, item) => item.rating + acc, 0);

  await Product.findByIdAndUpdate(
    productId,
    { totalReviews: allrev.length, avgRating: (totalRatings || 0) / allrev.length },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    status: true,
    data: review,
  });
});

// ! Delete a review
exports.deleteReview = catchAsync(async (req, res, next) => {
  const { reviewId } = req.body;

  const review = await findByIdAndDelete(reviewId);

  if (!review) return next(new AppError('Review not found', 404));

  await findByIdAndDelete(reviewId);
  const allrev = await Review.find({ productId: review.productId });
  const totalRatings = allrev.reduce((acc, item) => item.rating + acc, 0);

  const product = await Product.findByIdAndUpdate(
    review.productId,
    {
      totalReviews: allrev.length,
      avgRating: (totalRatings || 0) / allrev.length,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  console.log('UPDATEDPDT', product);

  res.status(204).json({
    status: true,
    message: 'Review deleted successfully',
  });
});

// ! Get all reviews against a single product
exports.getAllReviewForAProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.query.pdtId);
  if (!product) return next(new AppError('No product found', 404));

  const reviews = await Review.find({ productId: req.query.pdtId });

  res.status(200).json({
    status: true,
    message: 'Reviews fetched successfully',
    reviews,
  });
});
