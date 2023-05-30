const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    maxLength: [30, 'Name cannot exceed 30 characters'],
    minLength: [2, 'Name should have more than 2 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minLength: [8, 'Password must be greater than 8 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        //This only work on save and create.
        return el === this.password;
      },
      message: 'password and passwordConfirm must be same',
    },
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: 'user',
    enum: {
      values: ['user', 'admin'],
      message: 'role can be either user or admin',
    },
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

//! Hash password field and make passwordConfirm field undefined
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

//! Sign json web token
userSchema.methods.signToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

//! Check password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//~ Create and export model
const User = mongoose.model('User', userSchema);
module.exports = User;
