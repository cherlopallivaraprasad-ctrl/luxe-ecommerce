import { useState, useEffect } from 'react';
import { Search, ChevronDown, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { adminService } from '../../services';
import { useToast } from '../../context/ToastContext';
import { formatPrice, formatDate, ORDER_STATUS_MAP, FALLBACK_PRODUCT_IMAGE } from '../../utils/formatters';
import { Pagination } from '../../components/common/Pagination';

const STATUS_OPTIONS = [
  { value: 'ORDER_PLACED', label: 'Order Placed' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const toast = useToast();

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const res = await adminService.getAllOrders({
        page,
        limit: 10,
        search,
        status: filterStatus || undefined,
      });
      setOrders(res.data.data.orders || []);
      setPagination(res.data.data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (err) {
      toast.error('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, [search, filterStatus]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await adminService.updateOrderStatus(orderId, { status: newStatus });
      toast.success(`Order #${orderId} status updated to "${ORDER_STATUS_MAP[newStatus]?.label}".`);
      fetchOrders(pagination.page);
    } catch (err) {
      toast.error('Failed to update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Order Management & Logistics
        </h2>
        <p className="text-xs text-zinc-500">
          Process customer orders, update tracking states, and review payment settlements
        </p>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID or customer email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs focus:outline-none"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          aria-label="Filter by order status"
          className="w-full sm:w-auto px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold focus:outline-none"
        >
          <option value="">All Order Statuses</option>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-zinc-400">
                    Loading customer orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-zinc-400">
                    No orders match your search criteria.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => {
                  const statusInfo = ORDER_STATUS_MAP[ord.orderStatus] || {
                    label: ord.orderStatus,
                    color: 'bg-zinc-100 text-zinc-700',
                  };

                  return (
                    <tr key={ord.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                      <td className="py-3.5 px-4 font-mono font-bold text-zinc-900 dark:text-white">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-zinc-900 dark:text-white">
                          {ord.user?.name || 'Customer'}
                        </p>
                        <p className="text-[10px] text-zinc-400">{ord.user?.email}</p>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-400">
                        {formatDate(ord.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-300">
                        {ord.items?.length || 0} items
                      </td>
                      <td className="py-3.5 px-4 font-black text-zinc-900 dark:text-white">
                        {formatPrice(ord.totalAmount)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 block w-fit">
                          {ord.paymentMethod}
                        </span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
                          {ord.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <select
                            value={ord.orderStatus}
                            onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                            disabled={updatingId === ord.id}
                            aria-label={`Order status for ${ord.orderNumber}`}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:outline-none ${statusInfo.color}`}
                          >
                            {STATUS_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={fetchOrders}
          />
        </div>
      </div>
    </div>
  );
};
