const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/myorders', protect, getMyOrders);
router.get('/', protect, admin, getAllOrders);
router.get('/stats', protect, admin, require('../controllers/orderController').getDashboardStats);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
