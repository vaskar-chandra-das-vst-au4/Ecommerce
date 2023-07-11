const express = require('express');
const { createOrder, getOrder, getLoggedInUserOrders, getAllOrders } = require('../controllers/orderController');
const { isAuthenticated, authorizedRoles } = require('../controllers/authController');

const router = express.Router();

// ! Private
router.use(isAuthenticated);
router.route('/').post(createOrder);
router.get('/me', getLoggedInUserOrders);

// ! Admin
router.use(authorizedRoles('admin'));
router.route('/admin/:id').get(getOrder);
router.route('/admin').get(getAllOrders);

module.exports = router;
