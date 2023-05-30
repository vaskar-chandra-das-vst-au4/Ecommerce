const express = require('express');
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
} = require('../controllers/productController');

const router = express.Router();

router.route('/').get(getAllProducts).post(createProduct);
router.route('/:id').get(getProduct).patch(updateProduct).delete(deleteProduct);

module.exports = router;
