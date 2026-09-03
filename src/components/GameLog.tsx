import { motion, AnimatePresence } from 'framer-motion';
import { GameLog } from '../types';
import { Info, CheckCircle, AlertTriangle, XCircle, Zap } from 'lucide-react';

interface GameLogProps {
  logs: GameLog[];
  maxItems?: number;
}

const iconMap = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  action: Zap,
};

const colorMap = {
  info: 'text-gray-400',
  success: 'text-green-600',
  warning: 'text-amber-600',
  error: 'text-red-600',
  action: 'text-red-600',
};

export default function GameLogPanel({ logs, maxItems = 10 }: GameLogProps) {
  const displayLogs = logs.slice(0, maxItems);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 h-full flex flex-col">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
        Game Log
      </h3>

      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-1">
        <AnimatePresence mode="popLayout">
          {displayLogs.map((log) => {
            const Icon = iconMap[log.type];
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-start gap-2 text-sm"
              >
                <Icon size={14} className={`${colorMap[log.type]} mt-0.5 flex-shrink-0`} />
                <span className="text-gray-700">{log.message}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {logs.length === 0 && (
          <p className="text-gray-400 text-sm italic">No events yet...</p>
        )}
      </div>
    </div>
  );
}
