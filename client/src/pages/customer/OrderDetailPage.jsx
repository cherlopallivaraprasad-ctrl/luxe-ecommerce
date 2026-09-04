import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Calendar, Package, Receipt } from 'lucide-react';
import { orderService } from '../../services';
import { OrderTimeline } from '../../components/customer/OrderTimeline';
import { formatPrice, formatDate, FALLBACK_PRODUCT_IMAGE } from '../../utils/formatters';
import { Loader } from '../../components/common/Loader';
import { useToast } from '../../context/ToastContext';

export const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await orderService.getOrder(id);
        setOrder(res.data.data.order);
      } catch (err) {
        toast.error('Unable to retrieve order details.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader text="Tracking your order..." size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-24 text-center px-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Order Not Found</h2>
        <p className="text-xs text-zinc-500 mb-6">We could not locate this order.</p>
        <Link to="/orders" className="btn-primary text-xs">
          View All Orders
        </Link>
      </div>
    );
  }

  const shippingAddr =
    typeof order.shippingAddress === 'string'
      ? JSON.parse(order.shippingAddress || '{}')
      : order.shippingAddress || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8">
      {/* Top back navigation and order header */}
      <div className="space-y-4">
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Order Details & Tracking
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight mt-0.5">
              {order.orderNumber}
            </h1>
            <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-zinc-400 block uppercase font-semibold">
              Payment Status
            </span>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              {order.paymentStatus} ({order.paymentMethod})
            </span>
          </div>
        </div>
      </div>

      {/* Visual Tracking Timeline */}
      <OrderTimeline currentStatus={order.orderStatus} />

      {/* Order Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Products list */}
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <Package className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">
              Package Contents ({order.items?.length || 0} items)
            </h2>
          </div>

          <div className="space-y-4">
            {order.items?.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200/60 dark:border-zinc-800/60 gap-4"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <img
                    src={item.product?.image || FALLBACK_PRODUCT_IMAGE}
                    alt={item.product?.name}
                    className="w-16 h-16 rounded-2xl object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400">
                      {item.product?.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white truncate">
                      {item.product?.name}
                    </h4>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                </div>

                <span className="text-sm font-black text-zinc-900 dark:text-white whitespace-nowrap">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Shipping Address & Invoice Summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Shipping Address */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800 text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>Delivery Address</span>
            </div>
            <div className="text-xs space-y-1 text-zinc-600 dark:text-zinc-300">
              <p className="font-bold text-zinc-900 dark:text-white">{shippingAddr.name}</p>
              <p>{shippingAddr.phone}</p>
              <p>{shippingAddr.address}</p>
              <p>
                {shippingAddr.city}, {shippingAddr.state} - {shippingAddr.pincode}
              </p>
              <p>{shippingAddr.country}</p>
            </div>
          </div>

          {/* Payment & Invoice breakdown */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800 text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
              <Receipt className="w-4 h-4 text-indigo-600" />
              <span>Payment Breakdown</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {formatPrice(order.subtotalAmount)}
                </span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Shipping</span>
                <span>
                  {order.shippingAmount === 0 ? (
                    <strong className="text-emerald-600">FREE</strong>
                  ) : (
                    formatPrice(order.shippingAmount)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Taxes (18% GST)</span>
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {formatPrice(order.taxAmount)}
                </span>
              </div>
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-baseline">
                <span className="font-bold text-zinc-900 dark:text-white">Total Amount</span>
                <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
