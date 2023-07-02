const express = require('express');
const { createOrder } = require('../controllers/orderController');
const { isAuthenticated } = require('../middlewares/auth');

const router = express.Router();

router.route('/').post(isAuthenticated, createOrder);

module.exports = router;
