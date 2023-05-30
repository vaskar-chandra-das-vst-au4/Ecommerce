const path = require('path');
const { connectDatabase } = require('./config/db');
const dotenv = require('dotenv');

// console.log(__dirname);
// console.log(__filename);
// console.log(path.parse(__filename));
// console.log(path.isAbsolute(`${__dirname}/config/config.env`));
// console.log(`${__dirname}/config/config.env`);

// dotenv.config({ path: path.resolve(__dirname, './config/config.env') });
// dotenv.config({ path: 'Backend/config/config.env' });
dotenv.config({ path: `${__dirname}/config/config.env` });

//! Uncaught Exceptions
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! Shutting down.....🐛');
  process.env.NODE_ENV === 'development' && console.log(err);
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app');

//! Connect DB
connectDatabase();
//! Server
const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App is running on port ${port}👻`);
});

//! Unhandled rejections
process.on('unhandledRejection', err => {
  console.log('UNCAUGHT REJECTION! 🐛 Shutting down.....');
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});
