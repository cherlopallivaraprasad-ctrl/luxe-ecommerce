import { useState } from 'react';
import { Menu, Sun, Moon, Bell, Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export const AdminHeader = ({ onMenuClick, title = 'Dashboard Overview' }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-zinc-600" />
          )}
        </button>

        {/* Notifications badge */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl p-4 text-xs z-50 animate-fadeIn">
              <span className="font-bold text-zinc-900 dark:text-white block mb-2">
                Recent System Alerts
              </span>
              <div className="space-y-2 text-zinc-500">
                <p className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                  📦 2 new orders received in the last hour
                </p>
                <p className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                  ⚠️ 3 products reached low-stock threshold
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />

        {/* Admin profile pill */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:inline-block text-xs font-bold text-zinc-800 dark:text-zinc-200">
            {user?.name?.split(' ')[0]}
          </span>
        </div>
      </div>
    </header>
  );
};
