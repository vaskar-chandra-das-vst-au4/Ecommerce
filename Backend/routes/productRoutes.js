const express = require('express');
const { isAuthenticated, authorizedRoles } = require('../middlewares/auth');
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
} = require('../controllers/productController');

const router = express.Router();

// ! Public routes
router.route('/').get(getAllProducts);
router.route('/:id').get(getProduct);

// ! Admin Routes
router.use(isAuthenticated, authorizedRoles('admin'));
router.route('/admin').post(createProduct);
router.route('/admin/:id').patch(updateProduct).delete(deleteProduct);

module.exports = router;
