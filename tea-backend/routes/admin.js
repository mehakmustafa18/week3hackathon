const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const { getDashboardStats, getAllUsers, blockUnblockUser, changeUserRole } = require('../controllers/adminController');

router.use(verifyToken);
router.use(checkRole('admin', 'superadmin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/block', blockUnblockUser);
router.put('/users/:id/role', checkRole('superadmin'), changeUserRole);

module.exports = router;
