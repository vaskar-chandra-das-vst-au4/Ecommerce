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
  });

  res
    .status(200)
    .json({
      status: true,
      message: 'Order created successfully',
      data: order,
    })
    .select('-__v');
});
