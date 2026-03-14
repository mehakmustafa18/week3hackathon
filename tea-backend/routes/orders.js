const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const { placeOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus } = require('../controllers/orderController');

router.use(verifyToken);
router.post('/place', placeOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrder);

// Admin routes
router.get('/', checkRole('admin', 'superadmin'), getAllOrders);
router.put('/:id/status', checkRole('admin', 'superadmin'), updateOrderStatus);

module.exports = router;
