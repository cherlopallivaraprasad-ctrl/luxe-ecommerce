import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Heart, Check } from 'lucide-react';
import { formatPrice, FALLBACK_PRODUCT_IMAGE } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const toast = useToast();
  const { isAuthenticated } = useAuth();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.image || FALLBACK_PRODUCT_IMAGE);

  const discountPercent =
    product.discountPrice && product.price
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info('Please sign in to add items to your bag.');
      return;
    }

    if (product.stock <= 0) {
      toast.error('This product is currently out of stock.');
      return;
    }

    setAdding(true);
    try {
      await addToCart(product.id, 1);
      setAdded(true);
      toast.success(`Added "${product.name}" to cart!`);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart.');
    } finally {
      setAdding(false);
    }
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    if (!isWishlisted) {
      toast.success('Saved to your wishlist!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group relative bg-white dark:bg-zinc-900 rounded-3xl p-4 border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 dark:hover:shadow-black/40 flex flex-col justify-between transition-all duration-300"
    >
      <div>
        {/* Image Container */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 mb-4">
          <Link to={`/product/${product.id}`}>
            <img
              src={imgSrc}
              alt={product.name}
              onError={() => setImgSrc(FALLBACK_PRODUCT_IMAGE)}
              className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
              loading="lazy"
            />
          </Link>

          {/* Badges: Discount & Stock */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
            {discountPercent > 0 && (
              <span className="px-2.5 py-1 text-[11px] font-bold tracking-wider rounded-full bg-rose-500 text-white shadow-md">
                -{discountPercent}%
              </span>
            )}
            {product.stock <= 0 && (
              <span className="px-2.5 py-1 text-[11px] font-bold tracking-wider rounded-full bg-zinc-900/90 text-zinc-100 backdrop-blur-sm">
                Out of Stock
              </span>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <span className="px-2.5 py-1 text-[11px] font-bold tracking-wider rounded-full bg-amber-500 text-white shadow-md">
                Only {product.stock} left
              </span>
            )}
          </div>

          {/* Wishlist button */}
          <button
            onClick={toggleWishlist}
            aria-label="Save to Wishlist"
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-rose-500 dark:hover:text-rose-400 shadow-md transition-colors"
          >
            <Heart
              className={`w-4 h-4 transition-transform active:scale-125 ${
                isWishlisted ? 'fill-rose-500 text-rose-500' : ''
              }`}
            />
          </button>
        </div>

        {/* Product Meta */}
        <div className="space-y-1.5 px-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-indigo-600 dark:text-indigo-400">
              {product.category}
            </span>
            <div className="flex items-center gap-1 font-semibold text-zinc-700 dark:text-zinc-300">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating?.toFixed(1) || '4.5'}</span>
              <span className="text-zinc-400">({product.reviewCount || 0})</span>
            </div>
          </div>

          <Link to={`/product/${product.id}`} className="block">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Pricing & Add to Cart button */}
      <div className="pt-4 mt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-2 px-1">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-extrabold text-zinc-900 dark:text-white">
              {formatPrice(product.discountPrice || product.price)}
            </span>
            {product.discountPrice && (
              <span className="text-xs text-zinc-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <span className="text-[10px] text-zinc-400">Tax incl.</span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={adding || product.stock <= 0}
          aria-label="Add to cart"
          className={`flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 active:scale-95 ${
            added
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
              : product.stock <= 0
              ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
              : 'bg-zinc-900 hover:bg-indigo-600 dark:bg-zinc-800 dark:hover:bg-indigo-600 text-white shadow-sm'
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4" />
              <span>Added</span>
            </>
          ) : adding ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Add</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
