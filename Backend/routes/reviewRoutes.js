const express = require('express');
const { isAuthenticated, authorizedRoles } = require('../middlewares/auth');
const {
  getAllReviewsAgainstProduct,
  getAllReviewsAgainstUser,
  createOrUpdateReview,
  deleteReview,
  getAReview,
  getAllReviews,
} = require('../controllers/reviewController');

const router = express.Router();

//! Public
router.route('/productId/:pdtId').get(getAllReviewsAgainstProduct);

//! Private
router.use(isAuthenticated);

router.route('/').post(createOrUpdateReview).delete(deleteReview);
router.get('/userId/:userId', getAllReviewsAgainstUser);

//! Admin
router.use(authorizedRoles('admin'));

router.get('/admin', getAllReviews);
router.get('/admin/:reviewId', getAReview);

module.exports = router;
