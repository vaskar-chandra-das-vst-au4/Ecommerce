const express = require('express');
const { isAuthenticated, authorizedRoles } = require('../middlewares/auth');
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

router.get('/', getAllProducts);
router.get('/productId/:id', getProduct);

router
  .route('/reviews')
  .get(getAllReviewForAProduct)
  .patch(isAuthenticated, createPdtReview)
  .delete(isAuthenticated, deleteReview);

// ! Admin Routes
router.use(isAuthenticated, authorizedRoles('admin'));
router.route('/admin').post(createProduct);
router.route('/admin/:id').patch(updateProduct).delete(deleteProduct);

module.exports = router;
