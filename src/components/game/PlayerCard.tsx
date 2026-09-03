import React from 'react';
import { motion } from 'framer-motion';
import { Player } from '../../types';
import { getInitials, formatMoney } from '../../game/engine';
import { Crown, Lock, Wifi } from 'lucide-react';

const PLAYER_COLOR_MAP: Record<string, string> = {
  'token-red': '#e74c3c',
  'token-orange': '#FF8C00',
  'token-blue': '#3b82f6',
  'token-purple': '#a78bfa',
  'token-green': '#22c55e',
  'token-yellow': '#f59e0b',
};

const COLOR_GROUP_COLORS: Record<string, string> = {
  brown: '#8B4513',
  lightblue: '#87CEEB',
  pink: '#FF69B4',
  orange: '#FF8C00',
  red: '#D71B1B',
  yellow: '#FFD700',
  green: '#228B22',
  darkblue: '#000080',
};

interface PlayerCardProps {
  player: Player;
  isCurrentPlayer: boolean;
  isCurrentUser: boolean;
  onClick?: () => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, isCurrentPlayer, isCurrentUser, onClick }) => {
  const color = PLAYER_COLOR_MAP[player.tokenId] || '#888';
  const initials = getInitials(player.name);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`relative p-2 rounded-lg border-2 transition-all cursor-pointer ${
        isCurrentPlayer
          ? 'border-red-600 shadow-md'
          : 'border-gray-200 hover:border-gray-300'
      } ${player.bankrupt ? 'opacity-50' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <div className="relative flex-shrink-0">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs"
            style={{ backgroundColor: color }}
          >
            {initials}
          </div>
          {!player.bankrupt && isCurrentUser && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <Crown size={6} className="text-white" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className={`font-semibold text-xs ${isCurrentUser ? 'text-red-600' : 'text-gray-800'}`}>
              {player.name}
            </span>
            <span className="text-[9px] text-gray-400">
              {isCurrentPlayer ? 'Turn' : ''}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-xs text-red-600">$ {formatMoney(player.money).replace('$', '')}</span>
            {player.inJail && (
              <Lock size={9} className="text-red-500" />
            )}
            {player.getOutOfJailCards > 0 && (
              <span className="text-[9px] text-yellow-600">🃏{player.getOutOfJailCards}</span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          {isCurrentPlayer && (
            <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
          )}
          <Wifi size={9} className="text-green-500" />
        </div>
      </div>
    </motion.div>
  );
};

export default PlayerCard;
