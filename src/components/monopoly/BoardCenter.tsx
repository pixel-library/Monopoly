import React from 'react';
import { motion } from 'framer-motion';
import { DiceResult } from '../../types';
import { GameLog } from '../../types';
import Dice3D from '../Dice3D';

interface BoardCenterProps {
  dice: DiceResult | null;
  rolling: boolean;
  onRoll?: () => void;
  canRoll: boolean;
  showRollAgain: boolean;
  messages?: GameLog[];
}

export const BoardCenter: React.FC<BoardCenterProps> = ({
  dice,
  rolling,
  onRoll,
  canRoll,
  showRollAgain,
  messages = [],
}) => {
  const displayMessages = messages.slice(0, 3);

  return (
    <div className="board-center">
      <div className="center-background"></div>

      <div className="center-content">
        <div className="monopoly-word">ESTATE EMPIRE</div>
      </div>

      <div className="center-dice">
        <Dice3D
          dice={dice}
          rolling={rolling}
          onRoll={onRoll}
          disabled={!canRoll && !showRollAgain}
          size="md"
        />
      </div>

      {displayMessages.length > 0 && (
        <div className="center-messages">
          {displayMessages.map((log, idx) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`text-[11px] font-medium px-3 py-1.5 rounded-lg border ${
                log.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                log.type === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                log.type === 'error' ? 'bg-red-50 text-red-700 border-red-100' :
                log.type === 'action' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                'bg-gray-50 text-gray-600 border-gray-100'
              }`}
            >
              {log.message}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
