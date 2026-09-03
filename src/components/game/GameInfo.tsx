import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { useGameStore } from '../../state/gameStore';
import { formatMoney } from '../../game/engine';

interface GameInfoProps {
  roomCode?: string | null;
}

export const GameInfo: React.FC<GameInfoProps> = ({ roomCode }) => {
  const { players, turnNumber, settings } = useGameStore();
  const [copied, setCopied] = useState(false);

  const activePlayers = players.filter(p => !p.bankrupt);
  const bankMoney = 50000;
  const rounds = `${turnNumber} / ${settings.maxPlayers * 30}`;

  const handleCopy = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const infoItems = [
    { label: 'ROOM CODE', value: roomCode || '——' },
    { label: 'PLAYERS', value: `${activePlayers.length}/${players.length}` },
    { label: 'ROUND', value: rounds },
    { label: 'BANK', value: formatMoney(bankMoney) },
  ];

  return (
    <div className="p-3 space-y-3">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
        Game Info
      </h3>

      <div className="grid grid-cols-2 gap-2">
        {infoItems.map((item) => (
          <div key={item.label} className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">
              {item.label}
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-sm font-bold text-gray-800">{item.value}</span>
              {item.label === 'ROOM CODE' && roomCode && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCopy}
                  className="ml-auto text-gray-400 hover:text-gray-600"
                >
                  {copied ? <Check size={11} className="text-green-500" /> : <Copy size={11} />}
                </motion.button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameInfo;
