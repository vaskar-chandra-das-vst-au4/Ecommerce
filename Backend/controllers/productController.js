// const createError = require('http-errors');
const Product = require('../models/productModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const mongoose = require('mongoose');
const Review = require('../models/reviewModel');

//~ Json object
const sendRes = (res, statusCode, data, status = true) => {
  let jsonObj = {
    status,
    product: data,
  };
  return res.status(statusCode).json(jsonObj);
};

//! Create a product -- Admin
exports.createProduct = catchAsync(async (req, res, next) => {
  req.body.addedBy = req.user.id;
  const product = await Product.create(req.body);
  return sendRes(res, 201, product);
});

//! Get all products
exports.getAllProducts = catchAsync(async (req, res, next) => {
  //   const products = await Product.find();
  const totalPdtCount = await Product.countDocuments();

  const features = new APIFeatures(Product.find().select('-__v').populate('reviews'), req.query)
    .search()
    .filter()
    .paginate()
    .limitFields();
  const products = await features.query;

  return res.status(201).json({
    status: true,
    totalPdtCount,
    currentPagePdtCount: products.length,
    products,
  });
});

//! Get a product
exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate('reviews').select('-__v');
  if (!product) return next(new AppError('Product not found', 404));
  sendRes(res, 200, product);
});

//! Update a product -- Admin
exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  // On failure
  if (!product) return next(new AppError('Product not found', 404));

  // On success
  sendRes(res, 200, product);
});

//! Delete product -- Admin
exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return next(new AppError('Product ID does not exist!', 404));
  await Review.deleteMany({ productId: req.params.id });

  sendRes(res, 204);
});

// ! Create and update review
exports.createPdtReview = catchAsync(async (req, res, next) => {
  const { name, rating, comment, productId } = req.body;

  const newReview = {
    user: req.user._id,
    name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isAlreadyReviewed = product.reviews.some(item => item.user.toString() === req.user._id.toString());

  if (isAlreadyReviewed) {
    product.reviews.forEach(item => {
      if (item.user.toString() === req.user._id.toString()) {
        item.rating = Number(rating);
        item.comment = comment;
      }
    });
  } else {
    product.reviews.push(newReview);
    product.totalReviews = product.reviews.length;
  }

  product.avgRating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

  await product.save();
  res.status(200).json({
    status: true,
    message: 'Review added successfully',
  });
});

// ! Get all reviews against a single product
exports.getAllReviewForAProduct = catchAsync(async (req, res, next) => {
  // console.log('req.query.pdtId 12', req.query.pdtId);
  const product = await Product.findById(req.query.pdtId);
  if (!product) return next(new AppError('No product found', 404));

  res.status(200).json({
    status: true,
    message: 'Reviews fetched successfully',
    reviews: product.reviews,
  });
});

// ! Delete a review
exports.deleteReview = catchAsync(async (req, res, next) => {
  console.log('req.query.pdtId', req.query.pdtId, req.query.reviewId);
  let pdtId = req.query.pdtId;
  let reviewId = req.query.reviewId;

  const product = await Product.findById(pdtId);
  if (!product) return next(new AppError('No product found', 404));

  const reviews = product.reviews.filter(item => item._id.toString() !== reviewId);
  const totalReviews = reviews.length;

  const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length || 0;
  // console.log(reviews, totalReviews, avgRating);
  // console.log(
  //   'TOTAL',
  //   reviews.reduce((acc, item) => item.rating + acc, 0),
  //   reviews.length,
  //   product.reviews,
  //   reviews,
  //   avgRating
  // );
  const update = { reviews, totalReviews, avgRating: avgRating };

  await Product.findByIdAndUpdate(pdtId, update, {
    // new: true,
    // runValidators: true,
    // useFindAndModify: false,
  });

  res.status(204).json({
    status: true,
    message: 'Review deleted successfully',
  });
});
