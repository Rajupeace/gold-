const express = require('express');
const router = express.Router();
const { register, login, getProfile, getAllUsers, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', protect, getProfile);
router.get('/users', protect, admin, getAllUsers);
router.post('/address', protect, require('../controllers/authController').addAddress);
router.get('/addresses', protect, require('../controllers/authController').getAddresses);

module.exports = router;
