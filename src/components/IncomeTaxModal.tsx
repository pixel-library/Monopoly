import { motion } from 'framer-motion';
import { Player } from '../types';
import { formatMoney, calculateNetWorth } from '../game/engine';

interface IncomeTaxModalProps {
  player: Player;
  onPayFixed: () => void;
  onPayPercent: () => void;
}

export default function IncomeTaxModal({ player, onPayFixed, onPayPercent }: IncomeTaxModalProps) {
  const netWorth = calculateNetWorth(player);
  const percentAmount = Math.round(netWorth * 0.1);
  const fixedAmount = 200;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-lg bg-white border-2 border-red-200 rounded-2xl p-6 shadow-xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <h2 className="text-xl font-bold text-red-700 mb-4 text-center">Income Tax</h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Choose your tax payment method:
        </p>

        <div className="grid grid-cols-2 gap-4">
          <motion.button
            onClick={onPayFixed}
            className="p-4 border border-gray-200 rounded-xl text-center hover:border-red-300 hover:bg-red-50 transition-all"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <p className="text-xs text-gray-500 mb-1">Fixed Amount</p>
            <p className="text-2xl font-bold text-red-700">{formatMoney(fixedAmount)}</p>
          </motion.button>

          <motion.button
            onClick={onPayPercent}
            className="p-4 border border-gray-200 rounded-xl text-center hover:border-red-300 hover:bg-red-50 transition-all"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <p className="text-xs text-gray-500 mb-1">10% of Net Worth</p>
            <p className="text-2xl font-bold text-red-700">{formatMoney(percentAmount)}</p>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
