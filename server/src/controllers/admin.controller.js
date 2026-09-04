const prisma = require('../config/prisma');

// GET /api/admin/stats
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      pendingOrders,
      lowStockProducts,
      recentOrders,
      salesByCategory,
      revenueByMonth,
    ] = await Promise.all([
      // Total revenue from paid orders
      prisma.order.aggregate({
        where: { paymentStatus: 'PAID' },
        _sum: { totalAmount: true },
      }),
      // Total orders
      prisma.order.count(),
      // Total customers (USER role)
      prisma.user.count({ where: { role: 'USER' } }),
      // Total active products
      prisma.product.count({ where: { isActive: true } }),
      // Pending orders
      prisma.order.count({ where: { orderStatus: 'ORDER_PLACED' } }),
      // Low stock products (stock <= 5)
      prisma.product.count({ where: { isActive: true, stock: { lte: 5 } } }),
      // Recent orders
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } },
      }),
      // Sales by category
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { price: true, quantity: true },
      }),
      // Revenue stats for chart (last 7 days orders)
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
        select: { totalAmount: true, createdAt: true, orderStatus: true },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    // Get top products
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true, price: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });

    const topProductDetails = await Promise.all(
      topProducts.map(async (tp) => {
        const product = await prisma.product.findUnique({
          where: { id: tp.productId },
          select: { id: true, name: true, image: true, category: true, price: true },
        });
        return { ...tp, product };
      })
    );

    // Category sales breakdown
    const categoryBreakdown = await prisma.product.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: { category: true },
    });

    res.json({
      success: true,
      data: {
        kpis: {
          totalRevenue: totalRevenue._sum.totalAmount || 0,
          totalOrders,
          totalCustomers,
          totalProducts,
          pendingOrders,
          lowStockProducts,
        },
        recentOrders,
        topProducts: topProductDetails,
        categoryBreakdown,
        revenueByMonth,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/orders
const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where = {};
    if (status) where.orderStatus = status;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { user: { name: { contains: search } } },
        { user: { email: { contains: search } } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: { include: { product: { select: { id: true, name: true, image: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      success: true,
      data: { orders, pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/orders/:id/status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['ORDER_PLACED', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status.' });
    }

    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: {
        orderStatus: status,
        ...(status === 'DELIVERED' && { paymentStatus: 'PAID' }),
      },
      include: { user: { select: { name: true, email: true } } },
    });

    res.json({ success: true, message: 'Order status updated!', data: { order } });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true, name: true, email: true, role: true, phone: true,
          city: true, state: true, isActive: true, createdAt: true,
          _count: { select: { orders: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: { users, pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/users/:id
const updateUser = async (req, res, next) => {
  try {
    const { role, isActive } = req.body;
    const userId = parseInt(req.params.id);

    if (userId === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot modify your own account.' });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(role !== undefined && { role }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });

    res.json({ success: true, message: 'User updated successfully!', data: { user } });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    if (userId === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account.' });
    }
    await prisma.user.update({ where: { id: userId }, data: { isActive: false } });
    res.json({ success: true, message: 'User deactivated successfully.' });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/inventory
const getInventory = async (req, res, next) => {
  try {
    const { search, status } = req.query;

    const where = { isActive: true };
    if (search) where.OR = [{ name: { contains: search } }, { sku: { contains: search } }];
    if (status === 'low') where.stock = { gt: 0, lte: 10 };
    else if (status === 'out') where.stock = 0;
    else if (status === 'in') where.stock = { gt: 10 };

    const products = await prisma.product.findMany({
      where,
      select: { id: true, name: true, sku: true, stock: true, category: true, image: true, price: true },
      orderBy: { stock: 'asc' },
    });

    res.json({ success: true, data: { products } });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/inventory/:id
const updateInventory = async (req, res, next) => {
  try {
    const { stock } = req.body;
    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: { stock: parseInt(stock) },
    });
    res.json({ success: true, message: 'Inventory updated!', data: { product } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats, getAllOrders, updateOrderStatus, getAllUsers, updateUser, deleteUser, getInventory, updateInventory };
