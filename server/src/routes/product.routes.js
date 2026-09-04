const express = require('express');
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getCategories } = require('../controllers/product.controller');
const { requireAuth, requireAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProduct);
router.post('/', requireAuth, requireAdmin, createProduct);
router.put('/:id', requireAuth, requireAdmin, updateProduct);
router.delete('/:id', requireAuth, requireAdmin, deleteProduct);

module.exports = router;
