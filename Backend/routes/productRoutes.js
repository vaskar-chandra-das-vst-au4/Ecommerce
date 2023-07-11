const express = require('express');
const { isAuthenticated, authorizedRoles } = require('../controllers/authController');
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  createPdtReview,
  getAllReviewForAProduct,
  deleteReview,
} = require('../controllers/productController');

const router = express.Router();

// ! Public
router.get('/', getAllProducts);
router.get('/productId/:id', getProduct);

// router
//   .route('/reviews')
//   .get(getAllReviewForAProduct)
//   .patch(isAuthenticated, createPdtReview)
//   .delete(isAuthenticated, deleteReview);

//! Admin
router.use(isAuthenticated, authorizedRoles('admin'));

router.route('/admin').post(createProduct);
router.route('/admin/:id').patch(updateProduct).delete(deleteProduct);

module.exports = router;
