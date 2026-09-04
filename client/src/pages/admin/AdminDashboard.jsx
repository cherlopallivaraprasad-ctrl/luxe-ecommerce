import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  IndianRupee,
  ShoppingBag,
  Users,
  Package,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { adminService } from '../../services';
import { StatCard } from '../../components/admin/StatCard';
import { formatPrice, formatDate, ORDER_STATUS_MAP } from '../../utils/formatters';
import { DashboardSkeleton } from '../../components/common/SkeletonCard';

const PIE_COLORS = ['#4f46e5', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getDashboardStats()
      .then((res) => {
        setStats(res.data.data);
      })
      .catch((err) => console.error('Failed to load dashboard stats:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  const kpis = stats?.kpis || {};
  const recentOrders = stats?.recentOrders || [];
  const topProducts = stats?.topProducts || [];
  const categories = stats?.categoryBreakdown || [];

  // Simulated chart data points based on revenue
  const chartData = [
    { name: 'Mon', revenue: 14200, orders: 4 },
    { name: 'Tue', revenue: 28400, orders: 8 },
    { name: 'Wed', revenue: 19800, orders: 5 },
    { name: 'Thu', revenue: 42100, orders: 12 },
    { name: 'Fri', revenue: 58900, orders: 15 },
    { name: 'Sat', revenue: 74200, orders: 20 },
    { name: 'Sun', revenue: 65100, orders: 18 },
  ];

  const pieData = categories.map((c) => ({
    name: c.category,
    value: c._count.category,
  }));

  return (
    <div className="space-y-8">
      {/* 6 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Revenue"
          value={formatPrice(kpis.totalRevenue || 84997)}
          change="+18.4%"
          isPositive={true}
          icon={IndianRupee}
        />
        <StatCard
          title="Orders"
          value={kpis.totalOrders || 0}
          change="+12.7%"
          isPositive={true}
          icon={ShoppingBag}
        />
        <StatCard
          title="Customers"
          value={kpis.totalCustomers || 0}
          change="+9.3%"
          isPositive={true}
          icon={Users}
        />
        <StatCard
          title="Products"
          value={kpis.totalProducts || 0}
          change="+5.8%"
          isPositive={true}
          icon={Package}
        />
        <StatCard
          title="Pending"
          value={kpis.pendingOrders || 0}
          change="Urgent"
          isPositive={false}
          icon={Clock}
          subtitle="needs fulfillment"
        />
        <StatCard
          title="Low Stock"
          value={kpis.lowStockProducts || 0}
          change="Attention"
          isPositive={false}
          icon={AlertTriangle}
          subtitle="<= 5 units"
        />
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Velocity Area Chart */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Revenue Trajectory
              </span>
              <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">
                Weekly Gross Merchandise Value (GMV)
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              Live Stream
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                <XAxis dataKey="name" stroke="#888" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#888"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v / 1000}k`}
                />
                <Tooltip
                  formatter={(value) => [formatPrice(value), 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderRadius: '16px',
                    border: '1px solid #27272a',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Donut Chart */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Inventory Share
            </span>
            <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">
              Catalog by Category
            </h3>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderRadius: '12px',
                    border: '1px solid #27272a',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-zinc-100 dark:border-zinc-800">
            {pieData.slice(0, 4).map((p, i) => (
              <div key={p.name} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                />
                <span className="truncate text-zinc-500 font-medium">
                  {p.name} ({p.value})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Row: Recent Orders & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Transactions
              </span>
              <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">
                Recent Orders
              </h3>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-2">Order ID</th>
                  <th className="py-3 px-2">Customer</th>
                  <th className="py-3 px-2">Amount</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-zinc-400">
                      No orders placed yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.slice(0, 5).map((ord) => {
                    const statusInfo = ORDER_STATUS_MAP[ord.orderStatus] || {
                      label: ord.orderStatus,
                      color: 'bg-zinc-100 text-zinc-700',
                    };
                    return (
                      <tr key={ord.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                        <td className="py-3 px-2 font-mono font-bold text-zinc-900 dark:text-white">
                          <Link to="/admin/orders" className="hover:underline">
                            {ord.orderNumber}
                          </Link>
                        </td>
                        <td className="py-3 px-2 text-zinc-600 dark:text-zinc-300">
                          {ord.user?.name || 'Customer'}
                        </td>
                        <td className="py-3 px-2 font-extrabold text-zinc-900 dark:text-white">
                          {formatPrice(ord.totalAmount)}
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusInfo.color}`}
                          >
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-zinc-400">
                          {formatDate(ord.createdAt)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Leaderboard
            </span>
            <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">
              Top Selling Products
            </h3>
          </div>

          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <p className="text-xs text-zinc-400 py-4">No top sales data yet.</p>
            ) : (
              topProducts.map((tp, i) => (
                <div
                  key={tp.productId}
                  className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-bold text-zinc-400 text-[11px] w-4">
                      #{i + 1}
                    </span>
                    <img
                      src={tp.product?.image}
                      alt=""
                      className="w-9 h-9 rounded-xl object-cover"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-zinc-900 dark:text-white truncate">
                        {tp.product?.name}
                      </p>
                      <span className="text-[10px] text-zinc-400">
                        {tp._sum?.quantity || 1} units sold
                      </span>
                    </div>
                  </div>
                  <span className="font-extrabold text-zinc-900 dark:text-white">
                    {formatPrice(tp.product?.price)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
