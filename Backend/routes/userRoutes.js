const express = require('express');
const { isAuthenticated, authorizedRoles } = require('../controllers/authController');
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

const router = express.Router();

//! Public
router.post('/register', registerUser);
router.post('/login', login);
router.get('/logout', logout);
router.post('/password/forgot', forgotPassword);
router.patch('/password/reset/:token', resetPassword);

//! Private
router.use(isAuthenticated);

router.get('/mydetails', getLoggedInUserDetails);
router.patch('/updateMyPassword', updateMyPassword);
router.patch('/updateMyProfile', updateProfile);

//!  Admin
router.use(authorizedRoles('admin'));

router.route('/admin').get(getAllUsers);
router.route('/admin/:id').get(getUser).delete(deleteUser);

module.exports = router;
