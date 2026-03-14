const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const {
  getProducts, getProduct, getFeaturedProducts,
  getRelatedProducts, createProduct, updateProduct, deleteProduct
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProduct);
router.get('/:id/related', getRelatedProducts);

// Admin only routes
router.post('/', verifyToken, checkRole('admin', 'superadmin'), createProduct);
router.put('/:id', verifyToken, checkRole('admin', 'superadmin'), updateProduct);
router.delete('/:id', verifyToken, checkRole('superadmin'), deleteProduct);

module.exports = router;
