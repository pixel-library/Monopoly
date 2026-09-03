import { motion } from 'framer-motion';
import Modal from './Modal';
import { Sparkles, Heart } from 'lucide-react';

interface CardModalProps {
  card: {
    title: string;
    description: string;
    type: string;
  };
  onClose: () => void;
}

export default function CardModal({ card, onClose }: CardModalProps) {
  const isChance = card.type === 'CHANCE';

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="text-center py-4">
        {/* Card type icon */}
        <motion.div
          className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
            isChance ? 'bg-orange-500/20' : 'bg-blue-500/20'
          }`}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {isChance ? (
            <Sparkles size={32} className="text-orange-400" />
          ) : (
            <Heart size={32} className="text-blue-400" />
          )}
        </motion.div>

        {/* Card title */}
        <motion.h2
          className={`text-2xl font-display font-bold mb-2 ${
            isChance ? 'text-orange-400' : 'text-blue-400'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {isChance ? 'Chance' : 'Community Chest'}
        </motion.h2>

        {/* Card content */}
        <motion.div
          className="bg-white/5 rounded-xl p-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
          {card.description && (
            <p className="text-white/60">{card.description}</p>
          )}
        </motion.div>

        {/* Continue button */}
        <motion.button
          onClick={onClose}
          className="btn-primary w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Continue
        </motion.button>
      </div>
    </Modal>
  );
}
