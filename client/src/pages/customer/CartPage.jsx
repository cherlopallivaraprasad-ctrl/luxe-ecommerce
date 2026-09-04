import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice, FALLBACK_PRODUCT_IMAGE } from '../../utils/formatters';
import { EmptyState } from '../../components/common/EmptyState';
import { Loader } from '../../components/common/Loader';

export const CartPage = () => {
  const { cart, loading, updateItem, removeItem, clearCart, cartTotal } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  const items = cart?.items || [];

  const handleUpdateQty = async (itemId, currentQty, delta, maxStock) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    if (newQty > maxStock) {
      toast.warning(`Only ${maxStock} items available in stock.`);
      return;
    }
    try {
      await updateItem(itemId, newQty);
    } catch (err) {
      toast.error('Failed to update quantity.');
    }
  };

  const handleRemove = async (itemId, name) => {
    try {
      await removeItem(itemId);
      toast.info(`Removed "${name}" from cart.`);
    } catch (err) {
      toast.error('Failed to remove item.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader text="Loading your shopping cart..." size="lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-24 text-center">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is waiting for something great."
          description="Looks like you haven't added any items to your shopping bag yet. Explore our premier selection of lifestyle essentials."
          actionText="Start Exploring Products"
          actionLink="/shop"
        />
      </div>
    );
  }

  // Calculations matching backend rules
  const subtotal = cartTotal;
  const shipping = subtotal >= 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Checkout Flow
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight mt-1">
          Shopping Bag ({items.length} {items.length === 1 ? 'item' : 'items'})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Cart items list */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 text-xs text-zinc-400 font-semibold">
            <span>Product</span>
            <button
              onClick={clearCart}
              className="text-rose-500 hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Bag
            </button>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {items.map((item) => {
                const prod = item.product;
                const unitPrice = prod?.discountPrice || prod?.price || 0;
                const itemSubtotal = unitPrice * item.quantity;

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm gap-4"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <img
                        src={prod?.image || FALLBACK_PRODUCT_IMAGE}
                        alt={prod?.name}
                        className="w-20 h-20 rounded-2xl object-cover bg-zinc-100 dark:bg-zinc-800 flex-shrink-0"
                      />
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">
                          {prod?.category}
                        </span>
                        <Link to={`/product/${prod?.id}`}>
                          <h3 className="font-bold text-sm text-zinc-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-1">
                            {prod?.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-zinc-500 font-semibold">
                          {formatPrice(unitPrice)} each
                        </p>
                      </div>
                    </div>

                    {/* Quantity controls and item total */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-1">
                        <button
                          onClick={() => handleUpdateQty(item.id, item.quantity, -1, prod?.stock)}
                          disabled={item.quantity <= 1}
                          className="p-1.5 rounded-xl text-zinc-500 hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-30"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-zinc-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQty(item.id, item.quantity, 1, prod?.stock)}
                          disabled={item.quantity >= prod?.stock}
                          className="p-1.5 rounded-xl text-zinc-500 hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-30"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right min-w-[90px]">
                        <span className="block text-sm font-black text-zinc-900 dark:text-white">
                          {formatPrice(itemSubtotal)}
                        </span>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id, prod?.name)}
                        className="p-2 rounded-xl text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="pt-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Order Summary box */}
        <div className="lg:col-span-4 sticky top-28">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-800">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Items Subtotal</span>
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">FREE</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Estimated Taxes (18% GST)</span>
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {formatPrice(tax)}
                </span>
              </div>

              {shipping > 0 && (
                <p className="text-[11px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 p-2.5 rounded-xl font-medium">
                  💡 Add {formatPrice(999 - subtotal)} more to qualify for <strong>FREE Delivery</strong>!
                </p>
              )}

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-bold text-zinc-900 dark:text-white">Final Total</span>
                  <p className="text-[10px] text-zinc-400">Includes all duties & taxes</p>
                </div>
                <span className="text-2xl font-black text-zinc-900 dark:text-white">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full btn-primary py-4 rounded-2xl text-xs font-bold inline-flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 flex items-center justify-center gap-2 text-zinc-400 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Safe & Secure 256-Bit SSL Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
