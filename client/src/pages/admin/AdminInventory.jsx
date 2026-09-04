import { useState, useEffect } from 'react';
import { Search, Save, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { adminService } from '../../services';
import { useToast } from '../../context/ToastContext';
import { formatPrice, FALLBACK_PRODUCT_IMAGE } from '../../utils/formatters';

export const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState(''); // 'in', 'low', 'out'
  const [editingStocks, setEditingStocks] = useState({});
  const [savingId, setSavingId] = useState(null);
  const toast = useToast();

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await adminService.getInventory({ search, status: filterStatus });
      setProducts(res.data.data.products || []);
    } catch (err) {
      toast.error('Failed to load inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [search, filterStatus]);

  const handleStockInputChange = (id, val) => {
    setEditingStocks({ ...editingStocks, [id]: val });
  };

  const handleUpdateStock = async (id) => {
    const newStock = editingStocks[id];
    if (newStock === undefined || newStock === '') return;

    setSavingId(id);
    try {
      await adminService.updateInventory(id, { stock: parseInt(newStock) });
      toast.success('Inventory stock level updated!');
      fetchInventory();
      // clear edited value
      const copy = { ...editingStocks };
      delete copy[id];
      setEditingStocks(copy);
    } catch (err) {
      toast.error('Failed to update stock.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Real-Time Inventory Operations
        </h2>
        <p className="text-xs text-zinc-500">
          Monitor warehouse stock, prevent stockouts, and update units on hand
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or SKU..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {[
            { id: '', label: 'All Items' },
            { id: 'in', label: 'In Stock' },
            { id: 'low', label: 'Low Stock (≤10)' },
            { id: 'out', label: 'Out of Stock' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                filterStatus === f.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Item</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Unit Price</th>
                <th className="py-3.5 px-4">Stock Status</th>
                <th className="py-3.5 px-4">Available Units</th>
                <th className="py-3.5 px-4 text-right">Quick Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-zinc-400">
                    Loading inventory units...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-zinc-400">
                    No matching inventory items found.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const isOut = p.stock === 0;
                  const isLow = p.stock > 0 && p.stock <= 10;
                  const currentEditVal =
                    editingStocks[p.id] !== undefined ? editingStocks[p.id] : p.stock;

                  return (
                    <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image || FALLBACK_PRODUCT_IMAGE}
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover"
                          />
                          <span className="font-bold text-zinc-900 dark:text-white max-w-xs truncate">
                            {p.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-zinc-500">
                        {p.sku}
                      </td>
                      <td className="py-3 px-4 text-zinc-500">{p.category}</td>
                      <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-white">
                        {formatPrice(p.price)}
                      </td>
                      <td className="py-3 px-4">
                        {isOut ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                            <XCircle className="w-3 h-3" /> Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                            <AlertTriangle className="w-3 h-3" /> Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" /> In Stock
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-bold text-zinc-900 dark:text-white">
                        {p.stock}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-2 justify-end">
                          <input
                            type="number"
                            value={currentEditVal}
                            onChange={(e) => handleStockInputChange(p.id, e.target.value)}
                            min="0"
                            aria-label={`Stock for ${p.name}`}
                            className="w-20 px-2.5 py-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-bold text-center focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                          <button
                            onClick={() => handleUpdateStock(p.id)}
                            disabled={
                              savingId === p.id ||
                              editingStocks[p.id] === undefined ||
                              parseInt(editingStocks[p.id]) === p.stock
                            }
                            className="p-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-30 transition-opacity"
                            title="Save stock update"
                            aria-label="Save stock update"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
