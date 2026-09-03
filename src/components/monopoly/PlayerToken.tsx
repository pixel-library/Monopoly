import React from 'react';
import { motion } from 'framer-motion';
import { Player } from '../../types';

const TOKEN_COLORS: Record<string, string> = {
  'token-red': '#e74c3c',
  'token-orange': '#FF8C00',
  'token-blue': '#3b82f6',
  'token-purple': '#a78bfa',
  'token-green': '#22c55e',
  'token-yellow': '#f59e0b',
};

export interface PlayerTokenProps {
  player: Player;
  position: { top: number; left: number };
  offsetIndex?: number;
}

export const PlayerToken: React.FC<PlayerTokenProps> = ({ player, position, offsetIndex = 0 }) => {
  const color = TOKEN_COLORS[player.tokenId] || '#888';
  const initials = player.name.substring(0, 1).toUpperCase();

  const offsets = [
    { top: 0, left: 0 },
    { top: -12, left: -12 },
    { top: -24, left: 0 },
    { top: 0, left: -24 },
  ];
  const offset = offsets[offsetIndex] || offsets[0];

  const animationProps = player.isCurrentPlayer
    ? {
        animate: { scale: [1, 1.15, 1], boxShadow: ['0 0 0 0px rgba(0,0,0,0)', '0 0 0 8px rgba(0,0,0,0.1)', '0 0 0 0px rgba(0,0,0,0)'] },
        transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
      }
    : {};

  return (
    <motion.div
      className="player-token"
      data-player-id={player.id}
      style={{
        top: `calc(${position.top}% + ${offset.top}px)`,
        left: `calc(${position.left}% + ${offset.left}px)`,
        backgroundColor: color,
        borderColor: '#ffffff',
        color: '#ffffff',
        transform: 'translate(-50%, -50%)',
      }}
      {...animationProps}
      aria-label={player.name}
      title={player.name}
    >
      {initials}
    </motion.div>
  );
};

export default PlayerToken;
