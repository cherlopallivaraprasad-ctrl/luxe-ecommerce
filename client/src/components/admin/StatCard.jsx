import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  change = '+12.4%',
  isPositive = true,
  icon: Icon,
  subtitle,
}) => {
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          {title}
        </span>
        {Icon && (
          <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
          {value}
        </h3>
        <div className="flex items-center gap-2 mt-1.5">
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-bold ${
              isPositive
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {change}
          </span>
          <span className="text-[11px] text-zinc-400">
            {subtitle || 'vs last month'}
          </span>
        </div>
      </div>
    </div>
  );
};
