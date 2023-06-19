const express = require('express');
const {
  registerUser,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getLoggedInUserDetails,
  updateMyPassword,
  updateProfile,
  getAllUsers,
  getUser,
  deleteUser,
} = require('../controllers/userController');
const { isAuthenticated, authorizedRoles } = require('../middlewares/auth');

const router = express.Router();

// ! Public routes
router.post('/register', registerUser);
router.post('/login', login);
router.get('/logout', logout);
router.post('/password/forgot', forgotPassword);
router.patch('/password/reset/:token', resetPassword);

// ! Protected routes
router.use(isAuthenticated);

router.get('/mydetails', getLoggedInUserDetails);
router.patch('/updateMyPassword', updateMyPassword);
router.patch('/updateMyProfile', updateProfile);

// ~ Admin Routes
router.use(authorizedRoles('admin'));
router.route('/admin').get(getAllUsers);
router.route('/admin/:id').get(getUser).delete(deleteUser);

module.exports = router;
