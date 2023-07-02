const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const orderRouter = require('./routes/orderRoutes');
const globalErrorController = require('./controllers/globalErrorController');
const AppError = require('./utils/appError');

//! App and body parser
const app = express();
app.use(express.json());
app.use(cookieParser());

//! Morgan
console.log(`App is in ${process.env.NODE_ENV}⚙`);
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

//! Routers
//~ Original Url =  http://localhost:8000/api/v1/
app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/orders', orderRouter);

//! Undefined Routes
app.use('*', (req, res, next) => next(new AppError('Requested resource not found ˙◠˙ ', 404)));

//! Global Error handler
app.use(globalErrorController);

//! App
module.exports = app;
