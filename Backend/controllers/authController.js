const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// ! Is authenticated ?
exports.isAuthenticated = catchAsync(async (req, res, next) => {
  let token = req.cookies.token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return next(new AppError('Please login to access this resource', 401));

  // console.log('TOKEN', token);
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decodedData.id);

  if (!user) return next(new AppError('User not exist'));

  req.user = user;
  next();
});

// ! Is role allowed ?
exports.authorizedRoles = (...roles) => {
  return (req, res, next) => {
    console.log('USER', req.user.role, req.user);
    if (!roles.includes(req.user.role))
      return next(new AppError(`Role: ${req.user.role} is not allowed to access this resource`, 403));

    next();
  };
};
