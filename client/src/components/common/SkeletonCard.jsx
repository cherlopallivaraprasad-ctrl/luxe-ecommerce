export const ProductSkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-4 border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col gap-3 animate-pulse">
      <div className="w-full aspect-square bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
      <div className="h-4 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded-md mt-1" />
      <div className="h-5 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
      <div className="flex justify-between items-center mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
        <div className="h-10 w-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
      </div>
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-800" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-800" />
        <div className="h-80 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-800" />
      </div>
    </div>
  );
};
