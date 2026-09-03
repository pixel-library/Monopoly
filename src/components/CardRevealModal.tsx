import { motion } from 'framer-motion';
import { Card } from '../types';
import { Sparkles, Heart, X } from 'lucide-react';

interface CardRevealModalProps {
  card: Card;
  onClose: () => void;
}

export default function CardRevealModal({ card, onClose }: CardRevealModalProps) {
  const isChance = card.type === 'CHANCE';

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative w-full max-w-md bg-white border-2 border-red-200 rounded-2xl p-6 shadow-xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1 rounded-lg"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center ${
              isChance ? 'bg-orange-100' : 'bg-blue-100'
            }`}
          >
            {isChance ? (
              <Sparkles size={24} className="text-orange-600" />
            ) : (
              <Heart size={24} className="text-blue-600" />
            )}
          </div>
          <h2 className={`text-2xl font-bold ${isChance ? 'text-orange-700' : 'text-blue-700'}`}>
            {isChance ? 'Chance' : 'Community Chest'}
          </h2>
        </div>

        <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{card.title}</h3>
          {card.description && (
            <p className="text-gray-600 text-sm leading-relaxed">{card.description}</p>
          )}
        </div>

        <motion.button
          onClick={onClose}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Continue
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
