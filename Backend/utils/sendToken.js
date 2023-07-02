const sendToken = (user, statusCode, res, message) => {
  const token = user.signToken();
  const options = {
    httpOnly: true,
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
  };
  if (process.env.NODE_ENV === 'production') options.secure = true;

  const obj = {
    status: true,
    message,
    data: { user, token },
  };

  res.status(statusCode).cookie('token', token, options).json(obj);
};

module.exports = sendToken;
