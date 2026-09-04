import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, ArrowRight, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { orderService } from '../../services';
import { formatPrice, formatDate, ORDER_STATUS_MAP, FALLBACK_PRODUCT_IMAGE } from '../../utils/formatters';
import { EmptyState } from '../../components/common/EmptyState';
import { Loader } from '../../components/common/Loader';
import { Pagination } from '../../components/common/Pagination';

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const res = await orderService.getUserOrders({ page, limit: 6 });
      setOrders(res.data.data.orders || []);
      setPagination(res.data.data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (err) {
      console.error('Failed to load user orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader text="Retrieving your orders..." size="lg" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-24 text-center">
        <EmptyState
          icon={Package}
          title="No orders yet."
          description="Your next purchase will appear here. Start shopping to enjoy our fast express delivery and premium products."
          actionText="Start Shopping"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Account History
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight mt-1">
          My Purchases & Orders
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Track shipments, view detailed invoice breakdowns, and monitor delivery timelines
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const statusInfo = ORDER_STATUS_MAP[order.orderStatus] || {
            label: order.orderStatus,
            color: 'bg-zinc-100 text-zinc-700',
          };

          return (
            <div
              key={order.id}
              className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm hover:shadow-md transition-shadow space-y-4"
            >
              {/* Order header row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-zinc-900 dark:text-white">
                      {order.orderNumber}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Placed on {formatDate(order.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block uppercase font-semibold">
                      Total Amount
                    </span>
                    <span className="text-base font-extrabold text-zinc-900 dark:text-white">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>

                  <Link
                    to={`/orders/${order.id}`}
                    className="btn-secondary text-xs px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5"
                  >
                    <span>Track Order</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Items thumbnail preview */}
              <div className="flex flex-wrap items-center gap-3">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200/50 dark:border-zinc-800/50 max-w-xs"
                  >
                    <img
                      src={item.product?.image || FALLBACK_PRODUCT_IMAGE}
                      alt={item.product?.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                        {item.product?.name}
                      </p>
                      <p className="text-[11px] text-zinc-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={fetchOrders}
      />
    </div>
  );
};
