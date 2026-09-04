import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Truck, RotateCcw, Clock, Instagram, Twitter, Github, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200/70 dark:border-zinc-800/70 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value propositions banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-16 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Free Express Delivery</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">On all orders over ₹999</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Secure Payments</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">256-bit encrypted checkout</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">30-Day Returns</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Hassle-free guarantee</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">24/7 Dedicated Support</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Expert concierge team</p>
            </div>
          </div>
        </div>

        {/* Links & Brand section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12">
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
                LUXE
              </span>
            </Link>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed">
              Curated everyday essentials crafted with architectural precision, premium materials, and timeless modern aesthetics.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-indigo-600 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-indigo-600 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-indigo-600 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-indigo-600 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-4">Shop</h5>
            <ul className="space-y-2.5 text-xs text-zinc-500 dark:text-zinc-400">
              <li><Link to="/shop?category=Electronics" className="hover:text-indigo-600 transition-colors">Electronics</Link></li>
              <li><Link to="/shop?category=Fashion" className="hover:text-indigo-600 transition-colors">Fashion & Apparel</Link></li>
              <li><Link to="/shop?category=Home" className="hover:text-indigo-600 transition-colors">Home & Living</Link></li>
              <li><Link to="/shop?category=Beauty" className="hover:text-indigo-600 transition-colors">Beauty & Care</Link></li>
              <li><Link to="/shop?category=Sports" className="hover:text-indigo-600 transition-colors">Sports & Outdoors</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-4">Customer Care</h5>
            <ul className="space-y-2.5 text-xs text-zinc-500 dark:text-zinc-400">
              <li><Link to="/orders" className="hover:text-indigo-600 transition-colors">Track Your Order</Link></li>
              <li><Link to="/cart" className="hover:text-indigo-600 transition-colors">View Cart</Link></li>
              <li><Link to="/profile" className="hover:text-indigo-600 transition-colors">Account Details</Link></li>
              <li><a href="#faq" className="hover:text-indigo-600 transition-colors">Returns & Exchanges</a></li>
              <li><a href="#support" className="hover:text-indigo-600 transition-colors">Help Center</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-4">Demo Credentials</h5>
            <div className="bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl p-4 border border-zinc-200/50 dark:border-zinc-800/50 space-y-2 text-xs">
              <p className="font-semibold text-zinc-800 dark:text-zinc-200">Admin Account</p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">admin@example.com / Admin@123</p>
              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-2" />
              <p className="font-semibold text-zinc-800 dark:text-zinc-200">Customer Demo</p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">user@example.com / User@123</p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© 2026 LUXE E-Commerce Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
