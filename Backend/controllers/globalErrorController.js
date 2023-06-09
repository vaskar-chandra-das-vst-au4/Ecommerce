const AppError = require('../utils/appError');

const globalErrorController = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // ~ Caste error
  if (err.name === 'CastError') {
    const msg = `${err.name} : Invalid data recieved!(${err.path})`;
    err = new AppError(msg, 400);
  }

  //~ Validation error
  if (err.name === 'ValidationError') {
    const msg = `${err.message.split(':')[0]} : ${err.message.split(':')[2]}`;
    err = new AppError(msg, 400);
  }
  //   console.log(err.constructor);
  // ~ Duplicate key error
  if (err.code === 11000) {
    const msg = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new AppError(msg, 400);
  }

  // ~ Json web token error
  if (err.name === 'JsonWebTokenError') {
    const msg = 'JsonWebToken is invalid, try again';
    err = new AppError(msg, 400);
  }
  // ~ Json web token error
  if (err.name === 'TokenExpiredError') {
    const msg = 'JsonWebToken is expired, try again';
    err = new AppError(msg, 400);
  }

  // ~ Response object
  let jsonObj = {
    status: false,
    message: err.message,
  };

  // ~ NODE_ENV checker
  if (process.env.NODE_ENV === 'development') {
    jsonObj.error = err;
    console.log(err);
  }

  // ~ Send response
  return res.status(err.statusCode).json(jsonObj);
};

module.exports = globalErrorController;
