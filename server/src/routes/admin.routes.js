const express = require('express');
const { getDashboardStats, getAllOrders, updateOrderStatus, getAllUsers, updateUser, deleteUser, getInventory, updateInventory } = require('../controllers/admin.controller');
const { requireAuth, requireAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(requireAuth, requireAdmin);

// Dashboard
router.get('/stats', getDashboardStats);

// Orders
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Users
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Inventory
router.get('/inventory', getInventory);
router.put('/inventory/:id', updateInventory);

module.exports = router;
