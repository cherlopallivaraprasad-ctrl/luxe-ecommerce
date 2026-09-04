import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  CreditCard,
  Banknote,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { orderService } from '../../services';
import { formatPrice, FALLBACK_PRODUCT_IMAGE } from '../../utils/formatters';

export const CheckoutPage = () => {
  const { user } = useAuth();
  const { cart, fetchCart, cartTotal } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Address form fields pre-filled from user profile
  const [addressData, setAddressData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
    country: user?.country || 'India',
  });

  // Payment method: CASH_ON_DELIVERY | CARD | UPI
  const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY');
  const [cardData, setCardData] = useState({
    cardNumber: '4242 •••• •••• 4242',
    nameOnCard: user?.name || '',
    expiry: '12/28',
    cvv: '888',
  });
  const [upiId, setUpiId] = useState('user@okaxis');

  const items = cart?.items || [];
  const subtotal = cartTotal;
  const shipping = subtotal >= 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const handleAddressChange = (e) => {
    setAddressData({ ...addressData, [e.target.name]: e.target.value });
  };

  const validateStep1 = () => {
    const { name, phone, address, city, state, pincode } = addressData;
    if (!name || !phone || !address || !city || !state || !pincode) {
      toast.error('Please fill in all required shipping address fields.');
      return false;
    }
    return true;
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1 && validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 2) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateStep1()) {
      setStep(1);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        shippingAddress: addressData,
        paymentMethod,
      };

      const res = await orderService.createOrder(payload);
      const createdOrder = res.data.data.order;
      setOrderSuccess(createdOrder);
      await fetchCart(); // Refresh cart to show 0
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order.');
      setSubmitting(false);
    }
  };

  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-24 text-center px-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Your Bag is Empty</h2>
        <p className="text-xs text-zinc-500 mb-6">Add items to your cart before proceeding to checkout.</p>
        <Link to="/shop" className="btn-primary text-xs">
          Explore Products
        </Link>
      </div>
    );
  }

  // Order Success View
  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-36 pb-24 text-center space-y-6 animate-fadeIn">
        <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Order Confirmed
          </span>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Order Placed Successfully!
          </h1>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            Thank you for your purchase. We have received your order and our fulfillment team is preparing it for shipment.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm max-w-md mx-auto text-left space-y-3">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-500">Order Reference</span>
            <span className="font-mono font-bold text-zinc-900 dark:text-white">
              {orderSuccess.orderNumber}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-zinc-500">Total Paid</span>
            <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
              {formatPrice(orderSuccess.totalAmount)}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-zinc-500">Payment Mode</span>
            <span className="font-bold text-zinc-800 dark:text-zinc-200">
              {orderSuccess.paymentMethod}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={() => navigate(`/orders/${orderSuccess.id}`)}
            className="btn-primary text-xs px-8 py-3.5 rounded-2xl shadow-lg shadow-indigo-600/20"
          >
            Track Order Status
          </button>
          <Link
            to="/shop"
            className="btn-secondary text-xs px-6 py-3.5 rounded-2xl"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Fast & Secure
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight mt-1">
          Checkout
        </h1>
      </div>

      {/* Stepper Progress Bar */}
      <div className="flex items-center justify-between max-w-xl mx-auto pb-4">
        {[
          { num: 1, label: 'Shipping' },
          { num: 2, label: 'Summary' },
          { num: 3, label: 'Payment' },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step >= s.num
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
              }`}
            >
              {s.num}
            </div>
            <span
              className={`text-xs font-bold ${
                step >= s.num ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Step forms */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Shipping Address */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm space-y-6"
            >
              <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                  Step 1 — Shipping Address
                </h2>
              </div>

              <form onSubmit={handleNextStep} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={addressData.name}
                      onChange={handleAddressChange}
                      required
                      placeholder="e.g. Rahul Sharma"
                      className="input-base text-xs mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={addressData.phone}
                      onChange={handleAddressChange}
                      required
                      placeholder="+91 9876543210"
                      className="input-base text-xs mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={addressData.address}
                    onChange={handleAddressChange}
                    required
                    placeholder="Apartment, suite, unit, building, floor, street"
                    className="input-base text-xs mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={addressData.city}
                      onChange={handleAddressChange}
                      required
                      placeholder="City"
                      className="input-base text-xs mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={addressData.state}
                      onChange={handleAddressChange}
                      required
                      placeholder="State"
                      className="input-base text-xs mt-1"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={addressData.pincode}
                      onChange={handleAddressChange}
                      required
                      placeholder="e.g. 400001"
                      className="input-base text-xs mt-1"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="btn-primary text-xs px-8 py-3.5 rounded-2xl inline-flex items-center gap-2"
                  >
                    <span>Proceed to Review</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Step 2: Order Review */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                  Step 2 — Order Review
                </h2>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Edit Address
                </button>
              </div>

              {/* Delivery destination summary */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/60 text-xs space-y-1">
                <span className="font-bold text-zinc-900 dark:text-white">
                  Delivering to: {addressData.name} ({addressData.phone})
                </span>
                <p className="text-zinc-500 dark:text-zinc-400">
                  {addressData.address}, {addressData.city}, {addressData.state} - {addressData.pincode}, {addressData.country}
                </p>
              </div>

              {/* Items overview */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Items to be delivered
                </span>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product?.image || FALLBACK_PRODUCT_IMAGE}
                        alt={item.product?.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-white line-clamp-1">
                          {item.product?.name}
                        </h4>
                        <span className="text-[11px] text-zinc-400">
                          Qty: {item.quantity} × {formatPrice(item.product?.discountPrice || item.product?.price)}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-zinc-900 dark:text-white">
                      {formatPrice((item.product?.discountPrice || item.product?.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 dark:text-zinc-400"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="btn-primary text-xs px-8 py-3.5 rounded-2xl inline-flex items-center gap-2"
                >
                  <span>Choose Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Payment Method */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                  Step 3 — Payment Method
                </h2>
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-500" /> Simulated Environment
                </span>
              </div>

              {/* Payment selector options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-28 transition-all ${
                    paymentMethod === 'CASH_ON_DELIVERY'
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <Banknote className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <h4 className="text-xs font-bold">Cash on Delivery</h4>
                    <p className="text-[10px] text-zinc-400">Pay cash upon delivery</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-28 transition-all ${
                    paymentMethod === 'CARD'
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <CreditCard className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <h4 className="text-xs font-bold">Credit / Debit Card</h4>
                    <p className="text-[10px] text-zinc-400">Visa, Mastercard, RuPay</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-28 transition-all ${
                    paymentMethod === 'UPI'
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <Smartphone className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <h4 className="text-xs font-bold">UPI / QR Code</h4>
                    <p className="text-[10px] text-zinc-400">GPay, PhonePe, Paytm</p>
                  </div>
                </button>
              </div>

              {/* Simulated Card input fields */}
              {paymentMethod === 'CARD' && (
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/60 space-y-3 animate-fadeIn text-xs">
                  <p className="text-[11px] text-zinc-400">
                    💡 Simulated test card. No real money will be charged.
                  </p>
                  <div>
                    <label className="font-semibold text-zinc-700 dark:text-zinc-300">Card Number</label>
                    <input
                      type="text"
                      value={cardData.cardNumber}
                      onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                      className="input-base text-xs mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-zinc-700 dark:text-zinc-300">Expiry</label>
                      <input
                        type="text"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        className="input-base text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-zinc-700 dark:text-zinc-300">CVV</label>
                      <input
                        type="password"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                        className="input-base text-xs mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Simulated UPI input */}
              {paymentMethod === 'UPI' && (
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/60 space-y-3 animate-fadeIn text-xs">
                  <p className="text-[11px] text-zinc-400">
                    💡 Simulated UPI payment. Instant verification.
                  </p>
                  <div>
                    <label className="font-semibold text-zinc-700 dark:text-zinc-300">UPI Virtual ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@okhdfcbank"
                      className="input-base text-xs mt-1"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 dark:text-zinc-400"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                  className="btn-primary text-xs px-10 py-4 rounded-2xl inline-flex items-center gap-2 shadow-xl shadow-indigo-600/25"
                >
                  <Lock className="w-4 h-4" />
                  <span>{submitting ? 'Confirming Order...' : `Pay & Place Order • ${formatPrice(total)}`}</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right column: Sticky live order summary */}
        <div className="lg:col-span-5 sticky top-28 space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-800">
              Order Summary
            </h3>

            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {items.map((it) => (
                <div key={it.id} className="flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <img
                      src={it.product?.image || FALLBACK_PRODUCT_IMAGE}
                      alt=""
                      className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                    />
                    <span className="truncate text-zinc-800 dark:text-zinc-200 font-medium">
                      {it.product?.name}
                    </span>
                  </div>
                  <span className="text-zinc-500 font-semibold whitespace-nowrap">
                    {it.quantity} × {formatPrice(it.product?.discountPrice || it.product?.price)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-900 dark:text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Shipping</span>
                <span>{shipping === 0 ? <strong className="text-emerald-600">FREE</strong> : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>GST Tax (18%)</span>
                <span className="font-semibold text-zinc-900 dark:text-white">{formatPrice(tax)}</span>
              </div>
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-zinc-900 dark:text-white">Amount Due</span>
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
