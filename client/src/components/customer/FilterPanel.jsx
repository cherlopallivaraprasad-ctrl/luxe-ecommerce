import { RotateCcw, Star } from 'lucide-react';

export const FilterPanel = ({
  categories = [],
  selectedCategory,
  onCategoryChange,
  minPrice,
  maxPrice,
  onPriceChange,
  minRating,
  onRatingChange,
  onReset,
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-900 dark:text-white">
          Filters
        </h3>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset All
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Categories
        </h4>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => onCategoryChange('')}
            className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              !selectedCategory
                ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.category}
              onClick={() => onCategoryChange(cat.category)}
              className={`text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-all ${
                selectedCategory === cat.category
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <span>{cat.category}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
                {cat._count?.category || ''}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Price (₹)
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-zinc-400">Min Price</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => onPriceChange(e.target.value, maxPrice)}
              placeholder="0"
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-zinc-400">Max Price</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => onPriceChange(minPrice, e.target.value)}
              placeholder="70000"
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Minimum Rating
        </h4>
        <div className="flex flex-col gap-1.5">
          {[4, 3, 2].map((stars) => (
            <button
              key={stars}
              onClick={() => onRatingChange(minRating === stars ? '' : stars)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all ${
                minRating === stars
                  ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < stars
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-zinc-200 dark:text-zinc-700'
                    }`}
                  />
                ))}
              </div>
              <span>{stars} Stars & Above</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
