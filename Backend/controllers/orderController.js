const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createOrder = catchAsync(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    orderStatus,
    deliveredOn,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    userId: req.user._id,
    paymentInfo,
    paidOn: Date.now(),
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  }).select('-__v');

  res.status(200).json({
    status: true,
    message: 'Order created successfully',
    data: order,
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate([
    { path: 'userId', select: 'name email' },
    { path: 'orderItems.productId', select: 'name stock description' },
  ]);
  if (!order) return next(new AppError('Order not found with the given Id', 404));
  res.status(200).json({
    status: true,
    message: 'Order fetched successfully',
    data: order,
  });
});

exports.getLoggedInUserOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ userId: req.user._id }).populate([
    { path: 'userId', select: 'name email' },
    { path: 'orderItems.productId', select: 'name stock description' },
  ]);

  if (!orders) return next(new AppError('No orders found', 404));
  res.status(200).json({
    status: true,
    message: 'Orders fetched successfully',
    data: { totalOrders: orders.length, orders },
  });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find()
    .populate('userId', 'name email')
    .populate([
      { path: 'userId', select: 'name email' },
      { path: 'orderItems.productId', select: 'name stock description' },
    ]);
  if (!orders) return next(new AppError('No orders found', 404));

  let totalAmount = orders.reduce((acc, item) => acc + item?.totalPrice, 0);

  res.status(200).json({
    status: true,
    message: 'Orders fetched successfully',
    data: { totalOrders: orders.length, totalAmount, orders },
  });
});
