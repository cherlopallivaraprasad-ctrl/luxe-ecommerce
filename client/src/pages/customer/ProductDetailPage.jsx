import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Minus,
  Plus,
  Heart,
  Share2,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { productService } from '../../services';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, FALLBACK_PRODUCT_IMAGE } from '../../utils/formatters';
import { ProductCard } from '../../components/customer/ProductCard';
import { Loader } from '../../components/common/Loader';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const toast = useToast();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImg, setActiveImg] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await productService.getProduct(id);
        setProduct(res.data.data.product);
        setRelated(res.data.data.related || []);
        setActiveImg(res.data.data.product?.image || FALLBACK_PRODUCT_IMAGE);
        setQuantity(1);
      } catch (err) {
        toast.error('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader text="Loading product details..." size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-24 text-center px-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Product Not Found</h2>
        <p className="text-xs text-zinc-500 mb-6">The requested product does not exist or has been removed.</p>
        <Link to="/shop" className="btn-primary text-xs">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const discountPercent =
    product.discountPrice && product.price
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : 0;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to add items to your cart.');
      navigate('/login');
      return;
    }

    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} units available in inventory.`);
      return;
    }

    setAdding(true);
    try {
      await addToCart(product.id, quantity);
      toast.success(`Added ${quantity} item(s) to your cart.`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add item to cart.');
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to complete your checkout.');
      navigate('/login');
      return;
    }

    try {
      await addToCart(product.id, quantity);
      navigate('/checkout');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to proceed to checkout.');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-16">
      {/* Breadcrumb navigation */}
      <nav className="flex items-center gap-2 text-xs text-zinc-400">
        <Link to="/" className="hover:text-zinc-600 dark:hover:text-zinc-200">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-zinc-600 dark:hover:text-zinc-200">
          Shop
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/shop?category=${product.category}`} className="hover:text-zinc-600 dark:hover:text-zinc-200">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-zinc-800 dark:text-zinc-200 font-semibold truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main Product Showcase Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Image Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800/70 shadow-lg">
            <img
              src={activeImg}
              alt={product.name}
              onError={() => setActiveImg(FALLBACK_PRODUCT_IMAGE)}
              className="w-full h-full object-cover object-center"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-rose-500 text-white text-xs font-bold shadow-md">
                Save {discountPercent}%
              </span>
            )}
          </div>
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {product.brand} • {product.category}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  aria-label="Wishlist"
                  className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isWishlisted ? 'fill-rose-500 text-rose-500' : ''
                    }`}
                  />
                </button>
                <button
                  onClick={handleShare}
                  aria-label="Share"
                  className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              {product.name}
            </h1>

            {/* Rating and SKU */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1 font-semibold text-zinc-700 dark:text-zinc-300">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 5)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-zinc-200 dark:text-zinc-700'
                      }`}
                    />
                  ))}
                </div>
                <span>{product.rating?.toFixed(1) || '4.8'}</span>
                <span className="text-zinc-400">({product.reviewCount || 0} reviews)</span>
              </div>
              <span className="text-zinc-300 dark:text-zinc-700">•</span>
              <span className="text-zinc-400 font-mono text-[11px]">SKU: {product.sku}</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60 flex items-baseline gap-3">
            <span className="text-3xl font-black text-zinc-900 dark:text-white">
              {formatPrice(product.discountPrice || product.price)}
            </span>
            {product.discountPrice && (
              <span className="text-base text-zinc-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
            <span className="text-xs text-zinc-400 ml-auto">Inclusive of all local taxes</span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {product.description}
          </p>

          {/* Stock Status Badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-500">Availability:</span>
            {product.stock > 10 ? (
              <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                In Stock ({product.stock} units)
              </span>
            ) : product.stock > 0 ? (
              <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                Low Stock — Only {product.stock} left
              </span>
            ) : (
              <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                Currently Out of Stock
              </span>
            )}
          </div>

          {/* Quantity Selector & Action Buttons */}
          {product.stock > 0 && (
            <div className="space-y-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Quantity</span>
                <div className="flex items-center rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-zinc-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="btn-primary py-3.5 rounded-2xl text-xs font-bold inline-flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{adding ? 'Adding...' : 'Add to Bag'}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold shadow-md transition-all active:scale-95"
                >
                  <Zap className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          )}

          {/* Guarantees Box */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-center">
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 space-y-1">
              <Truck className="w-4 h-4 mx-auto text-indigo-600 dark:text-indigo-400" />
              <p className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200">Express Delivery</p>
              <p className="text-[9px] text-zinc-400">Dispatch in 24 hrs</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 space-y-1">
              <ShieldCheck className="w-4 h-4 mx-auto text-emerald-600 dark:text-emerald-400" />
              <p className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200">100% Genuine</p>
              <p className="text-[9px] text-zinc-400">Direct from brand</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 space-y-1">
              <RotateCcw className="w-4 h-4 mx-auto text-amber-600 dark:text-amber-400" />
              <p className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200">30-Day Returns</p>
              <p className="text-[9px] text-zinc-400">Easy pickup</p>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table (if available) */}
      {product.specifications && typeof product.specifications === 'object' && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Technical Specifications</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(product.specifications).map(([key, val]) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 text-xs"
              >
                <span className="font-semibold text-zinc-500">{key}</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">{String(val)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Products Section */}
      {related.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-zinc-200/50 dark:border-zinc-800/50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Similar Products in {product.category}
            </h2>
            <Link
              to={`/shop?category=${product.category}`}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              See More
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
