import { useState, useEffect } from 'react';
import { Search, Shield, User, Power, Calendar } from 'lucide-react';
import { adminService } from '../../services';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatters';
import { Pagination } from '../../components/common/Pagination';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const toast = useToast();

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const res = await adminService.getAllUsers({
        page,
        limit: 10,
        search,
        role: roleFilter || undefined,
      });
      setUsers(res.data.data.users || []);
      setPagination(res.data.data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (err) {
      toast.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, [search, roleFilter]);

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    setUpdatingId(userId);
    try {
      await adminService.updateUser(userId, { role: newRole });
      toast.success(`User role updated to ${newRole}.`);
      fetchUsers(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user role.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusToggle = async (userId, currentActive) => {
    setUpdatingId(userId);
    try {
      await adminService.updateUser(userId, { isActive: !currentActive });
      toast.success(`User account ${!currentActive ? 'activated' : 'deactivated'}.`);
      fetchUsers(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Customer & User Administration
        </h2>
        <p className="text-xs text-zinc-500">
          Review registered accounts, grant administrative privileges, and manage access
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
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs focus:outline-none"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          aria-label="Filter by role"
          className="w-full sm:w-auto px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold focus:outline-none"
        >
          <option value="">All Roles</option>
          <option value="USER">Customer (USER)</option>
          <option value="ADMIN">Administrator (ADMIN)</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Orders Placed</th>
                <th className="py-3.5 px-4">Registered Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-zinc-400">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-zinc-400">
                    No users found matching query.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-white">{u.name}</p>
                          <p className="text-[10px] text-zinc-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-500">
                      {u.phone || '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === 'ADMIN'
                            ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-zinc-900 dark:text-white">
                      {u._count?.orders || 0} orders
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="py-3.5 px-4">
                      {u.isActive ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-400">
                          Disabled
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleRoleToggle(u.id, u.role)}
                          disabled={updatingId === u.id}
                          className="px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 disabled:opacity-40"
                          title="Toggle Admin / User"
                        >
                          {u.role === 'ADMIN' ? 'Demote to User' : 'Promote to Admin'}
                        </button>
                        <button
                          onClick={() => handleStatusToggle(u.id, u.isActive)}
                          disabled={updatingId === u.id}
                          className={`p-1.5 rounded-lg border text-zinc-400 hover:text-white transition-colors ${
                            u.isActive
                              ? 'border-zinc-200 hover:bg-rose-600'
                              : 'border-emerald-500 hover:bg-emerald-600 text-emerald-500'
                          }`}
                          title={u.isActive ? 'Deactivate User' : 'Activate User'}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={fetchUsers}
          />
        </div>
      </div>
    </div>
  );
};
