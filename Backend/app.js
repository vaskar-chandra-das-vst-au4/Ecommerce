const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorController = require('./controllers/globalErrorController');

//! App and body parser
const app = express();
app.use(express.json());

//! Morgan
console.log(`App is in ${process.env.NODE_ENV}⚙`);
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

//! Routers
//~ Original Url =  http://localhost:8000/api/v1/
app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);

//! Undefined Routes

app.use('*', (req, res, next) => {
  let err = new Error('Page not found');
  err.status = 'fail';
  next(err);
});

//! Global Error handler
app.use(globalErrorController);

//! App
module.exports = app;
