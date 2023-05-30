const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is mandatory to enter!'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is mandatory to enter!'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is mandatory to enter!'],
    maxLength: [8, 'Price cannot exceed 8 characters'],
  },
  rating: {
    type: Number,
    default: 0,
    max: [5, 'Rating must be less or equal to 5'],
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },

      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, 'Product must have a category!'],
  },
  stock: {
    type: Number,
    required: [true, 'Please declare product stock!'],
    maxLength: [4, 'Stock cannot exceed 4 characters!'],
    default: 1,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      name: {
        type: String,
        required: [true, 'Reviewer name is needed!'],
      },
      rating: {
        type: Number,
        required: [true, 'Rating is needed!'],
        min: [1, 'Rating must be greater or equal to 1'],
        max: [5, 'Rating must be less or equal to 5'],
      },
      comment: {
        type: String,
        required: [true, 'Please write few words about the product!'],
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
