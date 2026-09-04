import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowUpDown, X, PackageX } from 'lucide-react';
import { productService } from '../../services';
import { ProductCard } from '../../components/customer/ProductCard';
import { FilterPanel } from '../../components/customer/FilterPanel';
import { Pagination } from '../../components/common/Pagination';
import { EmptyState } from '../../components/common/EmptyState';
import { ProductSkeletonCard } from '../../components/common/SkeletonCard';

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter states derived from or pushed to URL params
  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const minRating = searchParams.get('minRating') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');

  // Fetch categories on mount
  useEffect(() => {
    productService.getCategories()
      .then((res) => setCategories(res.data.data.categories || []))
      .catch((err) => console.error('Failed to load categories:', err));
  }, []);

  // Fetch products whenever searchParams change
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        search: searchQuery,
        category: selectedCategory,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        minRating: minRating || undefined,
        sort,
      };
      const res = await productService.getProducts(params);
      setProducts(res.data.data.products || []);
      setPagination(res.data.data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, selectedCategory, minPrice, maxPrice, minRating, sort]);

  useEffect(() => {
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchProducts]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    // Reset page to 1 whenever filters change
    if (key !== 'page') {
      next.set('page', '1');
    }
    setSearchParams(next);
  };

  const handlePriceChange = (min, max) => {
    const next = new URLSearchParams(searchParams);
    if (min) next.set('minPrice', min); else next.delete('minPrice');
    if (max) next.set('maxPrice', max); else next.delete('maxPrice');
    next.set('page', '1');
    setSearchParams(next);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = searchQuery || selectedCategory || minPrice || maxPrice || minRating;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      {/* Page Title & Breadcrumb */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Catalog
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight mt-1">
          {selectedCategory ? `${selectedCategory} Collection` : 'All Products'}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Showing {pagination.total} luxury lifestyle products
        </p>
      </div>

      {/* Controls Bar: Search, Mobile Filter Toggle, Sort Dropdown */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => updateParam('search', e.target.value)}
            placeholder="Search catalog..."
            className="w-full pl-11 pr-10 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => updateParam('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters {hasActiveFilters ? '•' : ''}</span>
          </button>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-zinc-400 hidden sm:block" />
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              aria-label="Sort products"
              className="px-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="newest">Newest Releases</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Customer Rated</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Catalog Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-28">
          <FilterPanel
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={(cat) => updateParam('category', cat)}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceChange={handlePriceChange}
            minRating={minRating}
            onRatingChange={(r) => updateParam('minRating', r)}
            onReset={handleResetFilters}
          />
        </aside>

        {/* Mobile Filters Drawer Modal */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex items-end sm:items-center justify-center p-0 sm:p-4 bg-zinc-950/60 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">Filter Products</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterPanel
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={(cat) => updateParam('category', cat)}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onPriceChange={handlePriceChange}
                minRating={minRating}
                onRatingChange={(r) => updateParam('minRating', r)}
                onReset={handleResetFilters}
              />
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full btn-primary py-3 rounded-2xl text-xs font-bold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductSkeletonCard key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              icon={PackageX}
              title="No Products Found"
              description="We couldn't find any items matching your active search or filter criteria. Try adjusting or resetting your filters."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={(p) => updateParam('page', p.toString())}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
