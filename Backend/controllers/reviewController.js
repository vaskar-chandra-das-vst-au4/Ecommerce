const Product = require('../models/productModel');
const User = require('../models/userModel');
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
    data: review || reviewedAlready,
  });
});

// ! Delete a review
exports.deleteReview = catchAsync(async (req, res, next) => {
  const { reviewId } = req.body;

  const review = await Review.findByIdAndDelete(reviewId);

  if (!review) return next(new AppError('Review not found', 404));

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

// ! Get all reviews - admin
exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  res.status(200).json({
    status: true,
    message: 'Reviews fetched successfully',
    reviews,
  });
});

// ! Get all reviews against a single product
exports.getAllReviewsAgainstProduct = catchAsync(async (req, res, next) => {
  // const product = await Product.findById(req.params.pdtId);
  // if (!product) return next(new AppError('No product found', 404));

  const reviews = await Review.find({ productId: req.params.pdtId });

  res.status(200).json({
    status: true,
    message: `Reviews fetched successfully for a product id ${req.params.pdtId}`,
    reviews,
  });
});

// ! Get all reviews against a single user
exports.getAllReviewsAgainstUser = catchAsync(async (req, res, next) => {
  // const user = await User.findById(req.params.userId);
  // if (!user) return next(new AppError('No user exist', 404));

  const reviews = await Review.find({ userId: req.params.userId });

  res.status(200).json({
    status: true,
    message: `Reviews fetched successfully for a  user id ${req.params.userId}`,
    reviews,
  });
});

// ! Get a review -admin
exports.getAReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review) return next(new AppError('Given review id is not related to any review document'));

  res.status(200).json({
    status: true,
    message: 'Review fetched successfully',
    review,
  });
});
