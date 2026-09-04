const prisma = require('../config/prisma');

const generateOrderNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `ORD-${year}-${random}`;
};

// POST /api/orders
const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod = 'CASH_ON_DELIVERY' } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: 'Shipping address is required.' });
    }

    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty.' });
    }

    // Validate stock and calculate totals (server-side)
    for (const item of cart.items) {
      if (!item.product.isActive) {
        return res.status(400).json({ success: false, message: `Product "${item.product.name}" is no longer available.` });
      }
      if (item.quantity > item.product.stock) {
        return res.status(400).json({ success: false, message: `Only ${item.product.stock} units of "${item.product.name}" are available.` });
      }
    }

    // Calculate amounts server-side
    let subtotalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const price = item.product.discountPrice || item.product.price;
      subtotalAmount += price * item.quantity;
      orderItems.push({ productId: item.productId, quantity: item.quantity, price });
    }

    const shippingAmount = subtotalAmount >= 999 ? 0 : 99;
    const taxRate = 0.18;
    const taxAmount = Math.round(subtotalAmount * taxRate);
    const totalAmount = subtotalAmount + shippingAmount + taxAmount;

    const stringifiedAddress = typeof shippingAddress === 'string' ? shippingAddress : JSON.stringify(shippingAddress);

    // Create order in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Reduce stock for each product
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Create the order
      const newOrder = await tx.order.create({
        data: {
          userId: req.user.id,
          orderNumber: generateOrderNumber(),
          totalAmount,
          subtotalAmount,
          shippingAmount,
          taxAmount,
          paymentMethod,
          paymentStatus: paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'PAID',
          orderStatus: 'ORDER_PLACED',
          shippingAddress: stringifiedAddress,
          items: { create: orderItems },
        },
        include: {
          items: { include: { product: true } },
        },
      });

      // Clear cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

const parseAddress = (order) => {
  if (!order) return order;
  let shippingAddress = order.shippingAddress;
  if (typeof shippingAddress === 'string') {
    try {
      shippingAddress = JSON.parse(shippingAddress);
    } catch {
      // keep as is
    }
  }
  return { ...order, shippingAddress };
};

// GET /api/orders
const getUserOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: req.user.id },
        include: {
          items: { include: { product: { select: { id: true, name: true, image: true, price: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.order.count({ where: { userId: req.user.id } }),
    ]);

    res.json({
      success: true,
      data: {
        orders: orders.map(parseAddress),
        pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/:id
const getOrder = async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { product: true } },
      },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Ensure user can only see their own orders
    if (order.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.json({ success: true, data: { order: parseAddress(order) } });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getUserOrders, getOrder };
