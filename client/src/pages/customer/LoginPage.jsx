import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const LoginPage = () => {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const loggedUser = await login(formData);
      toast.success(`Welcome back, ${loggedUser.name}!`);

      if (loggedUser.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(from || '/shop', { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (email, password) => {
    setFormData({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-16 px-4 bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-8 sm:p-10 border border-zinc-200/70 dark:border-zinc-800/70 shadow-2xl space-y-6"
      >
        {/* Brand header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
          </Link>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Sign in to access your curated orders, bag, and wishlists
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-zinc-700 dark:text-zinc-300">
              Email Address
            </label>
            <div className="relative mt-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="name@example.com"
                className="input-base pl-11 text-xs"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <a href="#" className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative mt-1">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="input-base pl-11 pr-11 text-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3.5 rounded-2xl text-xs font-bold inline-flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Login Helpers */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
          <span className="text-[11px] font-bold text-zinc-400 block uppercase tracking-wider text-center">
            Quick Fill Demo Accounts
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@example.com', 'Admin@123')}
              className="p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/30 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-colors"
            >
              Demo Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('user@example.com', 'User@123')}
              className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-[11px] font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 transition-colors"
            >
              Demo Customer
            </button>
          </div>
        </div>

        {/* Switch to Register */}
        <p className="text-center text-xs text-zinc-500">
          Don't have an account yet?{' '}
          <Link
            to="/register"
            className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Create an Account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
