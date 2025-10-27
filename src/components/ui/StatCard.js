// components/ui/StatCard.js
import { motion } from 'framer-motion';

const StatCard = ({ title, value, trend, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="w-full p-6 bg-white rounded-lg shadow-md border border-gray-200" // Tailwind classes
  >
    <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
    <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
    {trend && <p className="text-xs text-green-600 mb-1">+{trend}</p>}
    {description && <p className="text-xs text-gray-400">{description}</p>}
  </motion.div>
);

export default StatCard;