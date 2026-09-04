import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  MapPin,
  CheckCheck,
  XCircle,
} from 'lucide-react';
import { ORDER_STATUS_MAP } from '../../utils/formatters';

const TIMELINE_STEPS = [
  { key: 'ORDER_PLACED', label: 'Order Placed', icon: Clock },
  { key: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'PROCESSING', label: 'Processing', icon: Package },
  { key: 'SHIPPED', label: 'Shipped', icon: Truck },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: MapPin },
  { key: 'DELIVERED', label: 'Delivered', icon: CheckCheck },
];

export const OrderTimeline = ({ currentStatus }) => {
  const isCancelled = currentStatus === 'CANCELLED';
  const currentStepIndex = ORDER_STATUS_MAP[currentStatus]?.step ?? 0;

  if (isCancelled) {
    return (
      <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-3xl p-6 flex items-center gap-4 text-rose-700 dark:text-rose-400">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/60 flex items-center justify-center flex-shrink-0">
          <XCircle className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-base">This Order has been Cancelled</h4>
          <p className="text-xs text-rose-600 dark:text-rose-400/80 mt-0.5">
            If payment was already processed, a full refund will be credited to your original payment method within 3-5 business days.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Current Status
          </span>
          <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2 mt-0.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping" />
            {ORDER_STATUS_MAP[currentStatus]?.label || currentStatus}
          </h3>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            ORDER_STATUS_MAP[currentStatus]?.color
          }`}
        >
          {ORDER_STATUS_MAP[currentStatus]?.label}
        </span>
      </div>

      {/* Desktop / Tablet Horizontal Timeline */}
      <div className="hidden sm:block">
        <div className="relative flex items-center justify-between">
          {/* Progress track line */}
          <div className="absolute top-5 left-6 right-6 h-1 bg-zinc-100 dark:bg-zinc-800 -z-0">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(
                  100,
                  (currentStepIndex / (TIMELINE_STEPS.length - 1)) * 100
                )}%`,
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>

          {TIMELINE_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const Icon = step.icon;

            return (
              <div
                key={step.key}
                className="relative z-10 flex flex-col items-center group max-w-[100px] text-center"
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                      : isCurrent
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20 shadow-lg shadow-indigo-600/30'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`mt-3 text-xs font-bold leading-tight ${
                    isCurrent
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : isCompleted
                      ? 'text-zinc-800 dark:text-zinc-200'
                      : 'text-zinc-400 dark:text-zinc-600'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Vertical Timeline */}
      <div className="sm:hidden space-y-6 relative pl-6 border-l-2 border-zinc-200 dark:border-zinc-800 ml-3">
        {TIMELINE_STEPS.map((step, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} className="relative flex items-center gap-4">
              <div
                className={`absolute -left-[37px] w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  isCompleted
                    ? 'bg-indigo-600 text-white'
                    : isCurrent
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h4
                  className={`text-sm font-bold ${
                    isCurrent
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : isCompleted
                      ? 'text-zinc-900 dark:text-white'
                      : 'text-zinc-400'
                  }`}
                >
                  {step.label}
                </h4>
                <p className="text-xs text-zinc-400">
                  {isCurrent ? 'In progress' : isCompleted ? 'Completed' : 'Pending'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
