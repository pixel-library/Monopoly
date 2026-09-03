import { motion } from 'framer-motion';
import { GameLog } from '../types';

interface GameActivityFeedProps {
  logs: GameLog[];
}

export default function GameActivityFeed({ logs }: GameActivityFeedProps) {
  const getLogStyle = (type: GameLog['type']) => {
    switch (type) {
      case 'action':
        return { border: 'rgba(215,27,27,0.2)', text: '#D71B1B' };
      case 'success':
        return { border: 'rgba(34,197,94,0.2)', text: '#16a34a' };
      case 'warning':
      case 'error':
        return { border: 'rgba(239,68,68,0.2)', text: '#dc2626' };
      default:
        return { border: 'var(--color-border)', text: '#666666' };
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-2 space-y-1.5 scrollbar-thin">
      {logs.length === 0 ? (
        <p className="text-xs text-center py-4" style={{ color: 'var(--color-text-muted)' }}>
          Game started. Waiting for actions...
        </p>
      ) : (
        logs.map((log) => {
          const style = getLogStyle(log.type);
          return (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-2 rounded-lg text-xs font-medium border"
              style={{
                background: 'var(--color-surface-2)',
                borderColor: style.border,
                color: style.text,
              }}
            >
              <span>{log.message}</span>
            </motion.div>
          );
        })
      )}
    </div>
  );
}
