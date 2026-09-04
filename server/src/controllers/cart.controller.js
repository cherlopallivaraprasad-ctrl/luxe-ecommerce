const prisma = require('../config/prisma');

const getOrCreateCart = async (userId) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: { include: { product: true } },
      },
    });
  }

  return cart;
};

// GET /api/cart
const getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    res.json({ success: true, data: { cart } });
  } catch (error) {
    next(error);
  }
};

// POST /api/cart
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
    }

    const product = await prisma.product.findUnique({ where: { id: parseInt(productId) } });
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    if (product.stock === 0) {
      return res.status(400).json({ success: false, message: 'Product is out of stock.' });
    }

    const cart = await getOrCreateCart(req.user.id);

    const existingItem = cart.items.find(i => i.productId === parseInt(productId));
    if (existingItem) {
      const newQty = existingItem.quantity + parseInt(quantity);
      if (newQty > product.stock) {
        return res.status(400).json({ success: false, message: `Only ${product.stock} items available.` });
      }
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
      });
    } else {
      if (parseInt(quantity) > product.stock) {
        return res.status(400).json({ success: false, message: `Only ${product.stock} items available.` });
      }
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId: parseInt(productId), quantity: parseInt(quantity) },
      });
    }

    const updatedCart = await getOrCreateCart(req.user.id);
    res.json({ success: true, message: 'Item added to cart!', data: { cart: updatedCart } });
  } catch (error) {
    next(error);
  }
};

// PUT /api/cart/:itemId
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const itemId = parseInt(req.params.itemId);

    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1.' });
    }

    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true, product: true },
    });

    if (!item || item.cart.userId !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Cart item not found.' });
    }

    if (quantity > item.product.stock) {
      return res.status(400).json({ success: false, message: `Only ${item.product.stock} items available.` });
    }

    await prisma.cartItem.update({ where: { id: itemId }, data: { quantity: parseInt(quantity) } });

    const updatedCart = await getOrCreateCart(req.user.id);
    res.json({ success: true, message: 'Cart updated!', data: { cart: updatedCart } });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/cart/:itemId
const removeCartItem = async (req, res, next) => {
  try {
    const itemId = parseInt(req.params.itemId);

    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!item || item.cart.userId !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Cart item not found.' });
    }

    await prisma.cartItem.delete({ where: { id: itemId } });

    const updatedCart = await getOrCreateCart(req.user.id);
    res.json({ success: true, message: 'Item removed from cart.', data: { cart: updatedCart } });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/cart (clear cart)
const clearCart = async (req, res, next) => {
  try {
    const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    res.json({ success: true, message: 'Cart cleared.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
