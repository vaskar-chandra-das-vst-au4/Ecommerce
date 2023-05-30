const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');

// @ Register user
exports.registerUser = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    role,
    avatar: {
      public_id: 'This is a sample ID',
      url: 'profilePicURL',
    },
  });
  const token = user.signToken();

  res.status(201).json({
    status: true,
    token,
  });
});

// @ Login user

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('Please enter email & password', 400));

  const user = await User.findOne({ email }).select('+password');

  if (!user) return next(new AppError('Invalid email or password', 401));

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched)
    return next(new AppError('Invalid email or password', 401));

  const token = user.signToken();

  res.status(200).json({
    status: true,
    token,
  });
});
