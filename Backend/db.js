const mongoose = require('mongoose');

exports.connectDatabase = () => {
  const db = process.env.DB_URI.replace('<PASSWORD>', process.env.DB_PASSWORD);
  mongoose.set('strictQuery', false);

  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(data => {
      console.log(`Database connection established successfully at ${data.connection.host}`);
    });
};
