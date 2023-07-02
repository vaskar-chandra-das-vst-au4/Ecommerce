const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: { type: String, required: [true, 'Address is a mandatory field'] },
    city: { type: String, required: [true, 'City is a mandatory field'] },
    state: { type: String, required: [true, 'State is a mandatory field'] },
    country: { type: String, required: [true, 'Country is a mandatory field'] },
    pinCode: { type: Number, required: [true, 'Pin code is a mandatory field'] },
    phoneNo: { type: Number, required: [true, 'Phone Number is a mandatory field'] },
  },
  orderItems: [
    {
      name: {
        type: String,
        required: [true, 'Name is a mandatory field'],
      },
      price: {
        type: Number,
        required: [true, 'Price is a mandatory field'],
      },
      quantity: {
        type: Number,
        required: [true, 'Quantity is a mandatory field'],
      },
      image: {
        type: String,
        required: [true, 'Image is a mandatory field'],
      },
      productId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'Product Id is Required'],
      },
    },
  ],
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'User Id is required'],
  },
  paymentInfo: {
    id: {
      type: String,
      required: [true, 'Payment Id is required'],
    },
    status: {
      type: String,
      required: [true, 'Status is required field'],
    },
  },
  paidOn: {
    type: Date,
    required: [true, 'Payment Date is needed'],
  },
  itemsPrice: {
    type: Number,
    default: 0,
    required: [true, 'Items Price is needed'],
  },
  taxPrice: {
    type: Number,
    default: 0,
    required: [true, 'Tax Price is needed'],
  },
  shippingPrice: {
    type: Number,
    default: 0,
    required: [true, 'Shipping Price is needed'],
  },
  totalPrice: {
    type: Number,
    default: 0,
    required: [true, 'Total Price is needed'],
  },
  orderStatus: {
    type: String,
    required: [true, 'Order status is needed'],
    default: 'Proccessing',
  },
  deliveredOn: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
