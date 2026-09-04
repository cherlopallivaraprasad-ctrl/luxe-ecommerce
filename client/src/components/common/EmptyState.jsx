import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionText,
  actionLink,
  onAction,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center p-12 max-w-md mx-auto"
    >
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500 mb-5">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && actionLink && (
        <Link to={actionLink} className="btn-primary inline-flex items-center gap-2 text-sm">
          {actionText}
        </Link>
      )}
      {actionText && onAction && (
        <button onClick={onAction} className="btn-primary inline-flex items-center gap-2 text-sm">
          {actionText}
        </button>
      )}
    </motion.div>
  );
};
