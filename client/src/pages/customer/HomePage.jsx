import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';
import { productService } from '../../services';
import { ProductCard } from '../../components/customer/ProductCard';
import { ProductSkeletonCard } from '../../components/common/SkeletonCard';
import { useToast } from '../../context/ToastContext';

const CATEGORIES = [
  { name: 'Electronics', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600', count: '10+ items' },
  { name: 'Fashion', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600', count: '8+ items' },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1627123424574-724758594913?w=600', count: '6+ items' },
  { name: 'Home', image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=600', count: '6+ items' },
  { name: 'Beauty', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600', count: '5+ items' },
  { name: 'Sports', image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600', count: '6+ items' },
];

export const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [featRes, trendRes] = await Promise.all([
          productService.getProducts({ featured: 'true', limit: 8 }),
          productService.getProducts({ sort: 'popular', limit: 6 }),
        ]);
        setFeaturedProducts(featRes.data.data.products || []);
        setTrendingProducts(trendRes.data.data.products || []);
      } catch (err) {
        console.error('Failed to load home page products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    toast.success('Thank you for subscribing! Check your inbox for your 10% welcome coupon.');
    setNewsletterEmail('');
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Ambient background blur glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50/80 dark:bg-indigo-950/50 backdrop-blur-md border border-indigo-200/50 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-wide">
                <Sparkles className="w-4 h-4" />
                <span>Next-Generation Editorial Commerce</span>
              </div>

              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.08]">
                Everything You Want.{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                  One Beautiful Store.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Discover an uncompromising selection of premium electronics, contemporary fashion, and refined home essentials.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to="/shop"
                  className="btn-primary inline-flex items-center gap-3 text-sm px-8 py-4 rounded-2xl shadow-xl shadow-indigo-600/20"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/shop?category=Electronics"
                  className="btn-secondary inline-flex items-center gap-2 text-sm px-6 py-4 rounded-2xl"
                >
                  Explore Tech
                </Link>
              </div>

              {/* Trust counters */}
              <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 border-t border-zinc-200/50 dark:border-zinc-800/50">
                <div>
                  <span className="text-2xl font-black text-zinc-900 dark:text-white">30+</span>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Curated Products</p>
                </div>
                <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800" />
                <div>
                  <span className="text-2xl font-black text-zinc-900 dark:text-white">99.8%</span>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Satisfaction Rate</p>
                </div>
                <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800" />
                <div>
                  <span className="text-2xl font-black text-zinc-900 dark:text-white">24h</span>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Dispatch Speed</p>
                </div>
              </div>
            </motion.div>

            {/* Right Hero Visual Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-zinc-200/60 dark:border-zinc-800/60 group">
                <img
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000"
                  alt="Hero Product"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />

                {/* Floating pill badge */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-white/20 dark:border-zinc-700/30 flex items-center justify-between shadow-lg">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
                      Featured Pick
                    </span>
                    <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white">
                      ProVision 4K OLED Monitor
                    </h4>
                    <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                      ₹54,999 <span className="text-[10px] text-rose-500 font-bold ml-1">Save 12%</span>
                    </p>
                  </div>
                  <Link
                    to="/shop?search=ProVision"
                    className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md transition-colors"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 inline-flex items-center gap-1 mt-2 sm:mt-0 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link
                to={`/shop?category=${cat.name}`}
                className="group relative flex flex-col items-center p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm hover:shadow-lg hover:border-indigo-500/40 transition-all duration-300"
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 mb-3">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xs font-extrabold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-zinc-400 mt-0.5">{cat.count}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Curated Picks
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mt-1">
              Featured Products
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 inline-flex items-center gap-1 mt-2 sm:mt-0 transition-colors"
          >
            <span>Explore Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductSkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-950 to-purple-950 text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-indigo-800/40">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              Limited Time Event
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Summer Collection — Up to 40% Off
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
              Elevate your lifestyle with high-performance audio, premium apparel, and minimalist workspace gear at exclusive introductory rates.
            </p>
            <div className="pt-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-zinc-900 hover:bg-zinc-100 font-extrabold text-xs tracking-wider uppercase transition-transform active:scale-95 shadow-xl"
              >
                <span>Claim Offer</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Decorative graphic element */}
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 pointer-events-none hidden lg:block">
            <div className="w-full h-full bg-gradient-to-l from-indigo-500 to-transparent" />
          </div>
        </div>
      </section>

      {/* Trending Products Carousel / Scroll */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                Trending Right Now
              </h2>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <ProductSkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingProducts.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            The Luxe Promise
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mt-1">
            Engineered for Perfection
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-white">Fast Delivery</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Same-day dispatch on standard orders. Track every milestone from warehouse to your doorstep in real time.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-white">Secure Payments</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Multiple checkout methods including Cash on Delivery, credit cards, and UPI with bank-grade encryption.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-white">Easy Returns</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              30-day effortless return and exchange policy. Automated pickups arranged straight from your location.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-white">Quality Products</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Every single product in our catalog passes rigorous authenticity and aesthetic standard assessments.
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-12 bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800/70 shadow-xl text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Join the Club
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Subscribe for Exclusive Drops
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            Get early access to weekly limited edition releases, seasonal clearance sales, and secret member discounts.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-2 pt-2">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address..."
              required
              className="flex-1 px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="btn-primary text-xs px-6 py-3 rounded-2xl whitespace-nowrap shadow-md"
            >
              Subscribe
            </button>
          </form>

          {subscribed && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center gap-1.5 pt-2">
              <CheckCircle className="w-4 h-4" /> You're on the VIP list!
            </p>
          )}
        </div>
      </section>
    </div>
  );
};
