import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className={`relative ${sizeClasses[size]} w-full bg-white border border-gray-200 rounded-xl shadow-xl p-6`}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {title && (
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
