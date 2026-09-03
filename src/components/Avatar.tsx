import { motion } from 'framer-motion';
import { Player } from '../types';
import { getInitials } from '../game/engine';
import { DEFAULT_CHARACTERS, TOKEN_COLORS } from '../data/boardData';

interface AvatarProps {
  player: Player;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showToken?: boolean;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-24 h-24 text-2xl',
};

export default function Avatar({ player, size = 'md', showToken = false }: AvatarProps) {
  const character = DEFAULT_CHARACTERS.find(c => c.id === player.defaultCharacterId);
  const token = TOKEN_COLORS.find(t => t.id === player.tokenId);
  const initials = getInitials(player.name);

  const bgColor = character?.color || token?.color || '#4a5568';

  return (
    <div className="relative">
      <motion.div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-semibold text-white overflow-hidden border-2 border-white shadow-sm`}
        style={{ backgroundColor: bgColor }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {player.avatarType === 'custom' && player.avatarUrl ? (
          <img
            src={player.avatarUrl}
            alt={player.name}
            className="w-full h-full object-cover rounded-full"
          />
        ) : character ? (
          <span>{character.icon}</span>
        ) : (
          <span>{initials}</span>
        )}
      </motion.div>

      {showToken && token && (
        <div
          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm"
          style={{ backgroundColor: token.color }}
        />
      )}

      {player.inJail && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-[8px] text-white">🔒</span>
        </div>
      )}

      {player.bankrupt && (
        <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
          <span className="text-xs text-red-400">💀</span>
        </div>
      )}
    </div>
  );
}
