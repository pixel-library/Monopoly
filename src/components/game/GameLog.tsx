import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameLog } from '../../types';
import { useGameStore } from '../../state/gameStore';

interface GameLogProps {
  logs: GameLog[];
}

const iconMap: Record<GameLog['type'], React.ReactNode> = {
  info: <span className="w-2 h-2 bg-gray-300 rounded-full" />,
  success: <span className="w-2 h-2 bg-green-500 rounded-full" />,
  warning: <span className="w-2 h-2 bg-amber-500 rounded-full" />,
  error: <span className="w-2 h-2 bg-red-500 rounded-full" />,
  action: <span className="w-2 h-2 bg-blue-500 rounded-full" />,
};

const colorMap: Record<GameLog['type'], string> = {
  info: 'text-gray-500',
  success: 'text-green-700',
  warning: 'text-amber-700',
  error: 'text-red-700',
  action: 'text-blue-600',
};

const formatDistanceToNow = (timestamp: number) => {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

export const GameLogPanel: React.FC<GameLogProps> = ({ logs }) => {
  const { players } = useGameStore();

  const formatTime = (timestamp: number) => {
    return formatDistanceToNow(timestamp);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b border-gray-200 flex-shrink-0">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Game Log
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1.5 scrollbar-thin">
        <AnimatePresence>
          {logs.length === 0 ? (
            <p className="text-xs text-center py-4 text-gray-400">
              No events yet...
            </p>
          ) : (
            logs.slice(0, 50).map((log) => {
              const player = log.playerId ? players.find(p => p.id === log.playerId) : null;
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  className="flex items-start gap-2 px-2 py-1.5 rounded-lg text-xs hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {iconMap[log.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`font-medium ${colorMap[log.type]}`}>
                      {log.message}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {formatTime(log.timestamp)}
                  </span>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GameLogPanel;
