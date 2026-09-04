import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  AlertCircle,
  Package,
} from 'lucide-react';
import { productService } from '../../services';
import { formatPrice, FALLBACK_PRODUCT_IMAGE } from '../../utils/formatters';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { Pagination } from '../../components/common/Pagination';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const res = await productService.getProducts({
        page,
        limit: 10,
        search,
        category: selectedCategory,
      });
      setProducts(res.data.data.products || []);
      setPagination(res.data.data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (err) {
      toast.error('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, [search, selectedCategory]);

  const handleDeleteClick = (prod) => {
    setProductToDelete(prod);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      await productService.deleteProduct(productToDelete.id);
      toast.success(`Product "${productToDelete.name}" deleted successfully.`);
      setDeleteModalOpen(false);
      setProductToDelete(null);
      fetchProducts(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Product Catalog Management
          </h2>
          <p className="text-xs text-zinc-500">
            Create, update, and manage products listed in the store
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="btn-primary text-xs px-5 py-3 rounded-2xl inline-flex items-center gap-2 shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, SKU, brand..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          aria-label="Filter by category"
          className="w-full sm:w-auto px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold focus:outline-none"
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Accessories">Accessories</option>
          <option value="Home">Home</option>
          <option value="Beauty">Beauty</option>
          <option value="Sports">Sports</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Image</th>
                <th className="py-3.5 px-4">Product Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-zinc-400">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-zinc-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="py-3 px-4">
                      <img
                        src={p.image || FALLBACK_PRODUCT_IMAGE}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover bg-zinc-100 dark:bg-zinc-800"
                      />
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <p className="font-bold text-zinc-900 dark:text-white truncate">
                        {p.name}
                      </p>
                      <span className="text-[10px] text-zinc-400">{p.brand}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-zinc-500">
                      {p.sku}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-extrabold text-zinc-900 dark:text-white">
                        {formatPrice(p.discountPrice || p.price)}
                      </span>
                      {p.discountPrice && (
                        <span className="text-[10px] text-zinc-400 line-through block">
                          {formatPrice(p.price)}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-bold ${
                          p.stock <= 5 ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-700 dark:text-zinc-300'
                        }`}
                      >
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {p.stock > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          to={`/product/${p.id}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          title="View on store"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/products/edit/${p.id}`}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
                          title="Edit product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(p)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
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
            onPageChange={fetchProducts}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Product Confirmation"
      >
        <div className="space-y-4 text-xs">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>
              Are you sure you want to delete <strong>"{productToDelete?.name}"</strong>? This will remove it from the customer store catalog.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="btn-secondary text-xs px-4 py-2.5 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={deleting}
              className="btn-danger text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>{deleting ? 'Deleting...' : 'Confirm Delete'}</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
