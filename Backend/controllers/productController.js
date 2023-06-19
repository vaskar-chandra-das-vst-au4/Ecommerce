// const createError = require('http-errors');
const Product = require('../models/productModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

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

  const features = new APIFeatures(Product.find(), req.query).search().filter().paginate().limitFields();
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
  const product = await Product.findById(req.params.id);
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
  sendRes(res, 204);
});
