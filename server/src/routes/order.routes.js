const express = require('express');
const { createOrder, getUserOrders, getOrder } = require('../controllers/order.controller');
const { requireAuth } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(requireAuth);

router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrder);

module.exports = router;
