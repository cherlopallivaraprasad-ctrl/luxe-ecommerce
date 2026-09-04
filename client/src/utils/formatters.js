export const formatPrice = (price) => {
  if (price === null || price === undefined) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const ORDER_STATUS_MAP = {
  ORDER_PLACED: { label: 'Order Placed', step: 0, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400' },
  CONFIRMED: { label: 'Confirmed', step: 1, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400' },
  PROCESSING: { label: 'Processing', step: 2, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400' },
  SHIPPED: { label: 'Shipped', step: 3, color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', step: 4, color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-400' },
  DELIVERED: { label: 'Delivered', step: 5, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400' },
  CANCELLED: { label: 'Cancelled', step: -1, color: 'text-rose-600 bg-rose-50 dark:bg-rose-900/30 dark:text-rose-400' },
};

export const FALLBACK_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800';
