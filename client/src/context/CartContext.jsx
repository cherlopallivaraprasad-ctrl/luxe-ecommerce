import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [] });
      return;
    }
    setLoading(true);
    try {
      const res = await cartService.getCart();
      setCart(res.data.data.cart);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    const res = await cartService.addToCart({ productId, quantity });
    setCart(res.data.data.cart);
    return res.data;
  }, []);

  const updateItem = useCallback(async (itemId, quantity) => {
    const res = await cartService.updateCartItem(itemId, { quantity });
    setCart(res.data.data.cart);
  }, []);

  const removeItem = useCallback(async (itemId) => {
    const res = await cartService.removeCartItem(itemId);
    setCart(res.data.data.cart);
  }, []);

  const clearCart = useCallback(async () => {
    await cartService.clearCart();
    setCart({ items: [] });
  }, []);

  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const cartTotal = cart?.items?.reduce((sum, item) => {
    const price = item.product?.discountPrice || item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0) || 0;

  const value = {
    cart,
    loading,
    cartCount,
    cartTotal,
    fetchCart,
    addToCart,
    updateItem,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
