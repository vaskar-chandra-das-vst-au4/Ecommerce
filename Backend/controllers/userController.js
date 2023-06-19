const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const sendToken = require('../utils/sendToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

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

  sendToken(user, 201, res);
});

// @ Login user

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) return next(new AppError('Please enter email & password', 400));

  const user = await User.findOne({ email }).select('+password');

  if (!user) return next(new AppError('Invalid email or password', 401));

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) return next(new AppError('Invalid email or password', 401));

  sendToken(user, 200, res);
});

// @ Logout user
exports.logout = catchAsync(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    status: true,
    message: 'You are successfully logged out.',
  });
});

// @ Forgot Password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError('No user exist for the given email id.', 404));

  const resetToken = await user.generateResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
  const message = `Forgot your password ?\n\nSubmit a PATCH request with your new password and confirmPassword to :\n${resetURL}\nIf you didn't requested then, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'User password recovery',
      message,
    });
    res.status(200).json({
      status: true,
      message: `Email sent to ${req.body.email} successfully`,
    });
  } catch (error) {
    this.resetPasswordToken = undefined;
    this.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError(error.message, 500));
    // return next(new AppError('There was an error sending email. Try again later!', 500));
  }
});

// @ Reset Password
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;

  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({ resetPasswordToken: hashedToken });

  if (!user) return next(new AppError('Token is invalid or has expired', 400));

  if (!(user.resetPasswordExpire > Date.now())) {
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    await user.save();
    return next(new AppError('Token is invalid or has expired', 400));
  }

  if (password !== passwordConfirm) return next(new AppError('Password and confirm password must be same', 401));

  user.password = password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;
  await user.save();

  sendToken(user, 200, res, 'Password updated successfully');
});

// @ Get logged in User details
exports.getLoggedInUserDetails = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: true,
    user: req.user,
  });
});

// @ Update password of logged in user
exports.updateMyPassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');
  const { oldPassword, newPassword, confirmPassword } = req.body;
  console.log('USER', user);
  const isOldPasswordMatched = await user.comparePassword(oldPassword);
  if (!isOldPasswordMatched) return next(new AppError('Old Password is incorrect'));

  if (newPassword !== confirmPassword) return next(new AppError('New and Confirm passwords are not same'));

  user.password = newPassword;
  await user.save();

  sendToken(user, 200, res, 'Password updated successfully');
});

// @ Update MyProfile
exports.updateProfile = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword || req.body.oldPassword)
    return next(
      new AppError("This route is not for updating password. Please use '/updateMyPassword' route for that. ", 400)
    );

  const { email, name } = req.body;

  if (!email && !name && !role) return next(new AppError('No data recieved for updation', 400));

  const update = {};
  if (email) update.email = email;
  if (name) update.name = name;
  if (role) update.role = role;

  const user = await User.findByIdAndUpdate(req.user._id, update, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: true,
    message: 'Profile updated successfully',
    user,
  });
});

// ! Get all users - admin
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: true,
    message: 'Fetched all users successfully',
    users,
  });
});

// ! Get single user - admin
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError(`No user found for the given id ${req.params.id}`, 404));
  res.status(200).json({
    status: true,
    message: 'User fetched successfully',
    user,
  });
});
// ! Delete user - admin
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return next(new AppError(`No user found for the given id ${req.params.id}`, 404));

  res.status(204).json({
    status: true,
    message: 'User deleted successfully',
  });
});
