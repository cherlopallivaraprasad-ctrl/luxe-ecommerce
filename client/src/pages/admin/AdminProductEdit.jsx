import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import { productService } from '../../services';
import { useToast } from '../../context/ToastContext';
import { FALLBACK_PRODUCT_IMAGE } from '../../utils/formatters';
import { Loader } from '../../components/common/Loader';

const CATEGORIES = ['Electronics', 'Fashion', 'Accessories', 'Home', 'Beauty', 'Sports'];

export const AdminProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: 'Electronics',
    brand: '',
    sku: '',
    image: '',
    stock: 0,
    featured: false,
    specifications: '',
  });

  useEffect(() => {
    productService
      .getProduct(id)
      .then((res) => {
        const prod = res.data.data.product;
        setForm({
          name: prod.name || '',
          description: prod.description || '',
          price: prod.price || '',
          discountPrice: prod.discountPrice || '',
          category: prod.category || 'Electronics',
          brand: prod.brand || '',
          sku: prod.sku || '',
          image: prod.image || '',
          stock: prod.stock || 0,
          featured: Boolean(prod.featured),
          specifications: prod.specifications
            ? typeof prod.specifications === 'string'
              ? prod.specifications
              : JSON.stringify(prod.specifications, null, 2)
            : '',
        });
      })
      .catch(() => toast.error('Failed to load product data.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let parsedSpecs = null;
      if (form.specifications) {
        try {
          parsedSpecs = JSON.parse(form.specifications);
        } catch {
          parsedSpecs = { Details: form.specifications };
        }
      }

      await productService.updateProduct(id, {
        ...form,
        specifications: parsedSpecs,
      });

      toast.success('Product updated successfully!');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update product.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader text="Loading product details..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/admin/products"
          className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Edit Product #{id}
          </h2>
          <p className="text-xs text-zinc-500">Modify product pricing, specs, and details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white pb-2 border-b border-zinc-100 dark:border-zinc-800">
              Product Information
            </h3>

            <div>
              <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                Product Title *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="input-base text-xs mt-1"
              />
            </div>

            <div>
              <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                Description *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                className="input-base text-xs mt-1 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  required
                  className="input-base text-xs mt-1"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  required
                  className="input-base text-xs mt-1 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                Specifications (JSON)
              </label>
              <textarea
                name="specifications"
                value={form.specifications}
                onChange={handleChange}
                rows={3}
                className="input-base text-xs mt-1 font-mono resize-none"
              />
            </div>
          </div>

          <div className="md:col-span-4 space-y-6 text-xs">
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Product Image</h3>
              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  required
                  className="input-base text-xs mt-1"
                />
              </div>

              <div className="aspect-square w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center relative">
                {form.image ? (
                  <img
                    src={form.image}
                    alt="Preview"
                    onError={(e) => (e.target.src = FALLBACK_PRODUCT_IMAGE)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-zinc-400">
                    <ImageIcon className="w-8 h-8" />
                    <span className="text-[11px]">No image provided</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Pricing & Stock</h3>
              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">Base Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="input-base text-xs mt-1"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">Discount Price (₹)</label>
                <input
                  type="number"
                  name="discountPrice"
                  value={form.discountPrice}
                  onChange={handleChange}
                  className="input-base text-xs mt-1"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">Stock Count</label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  className="input-base text-xs mt-1"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="input-base text-xs mt-1"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="featured" className="font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer">
                  Featured Product
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link to="/admin/products" className="btn-secondary text-xs px-6 py-3 rounded-2xl">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary text-xs px-8 py-3 rounded-2xl inline-flex items-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Updating Product...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
