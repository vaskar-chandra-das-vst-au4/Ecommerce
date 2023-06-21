const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'UserId is needed'],
  },
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'ProductId is needed'],
  },
  name: {
    type: String,
    required: [true, 'Reviewer name is needed!'],
  },
  rating: {
    type: Number,
    required: [true, 'Rating is needed!'],
  },
  comment: {
    type: String,
    required: [true, 'Please write few words about the product!'],
  },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
