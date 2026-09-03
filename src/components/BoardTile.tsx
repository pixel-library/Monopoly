import { motion } from 'framer-motion';
import { Train, Zap, Droplets, HelpCircle, Gift, DollarSign, Lock, Car, AlertTriangle } from 'lucide-react';
import { BoardTile, Player } from '../types';

interface BoardTileProps {
  tile: BoardTile;
  players: Player[];
  onClick?: () => void;
  position: 'bottom' | 'left' | 'top' | 'right' | 'corner';
}

export default function BoardTileComponent({ tile, players, onClick, position }: BoardTileProps) {
  const owner = players.find(p => p.properties.includes(tile.id));
  const playersOnTile = players.filter(p => p.position === tile.position);

  const isCorner = position === 'corner';

  const getTileSize = () => {
    if (isCorner) return 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24';
    switch (position) {
      case 'bottom':
      case 'top':
        return 'w-10 h-16 sm:w-12 sm:h-20 md:w-14 md:h-24';
      case 'left':
      case 'right':
        return 'w-16 h-10 sm:w-20 sm:h-12 md:w-24 md:h-14';
      default:
        return 'w-10 h-10';
    }
  };

  const getRotation = () => {
    switch (position) {
      case 'left':
        return 'rotate-90';
      case 'right':
        return '-rotate-90';
      case 'top':
        return 'rotate-180';
      default:
        return '';
    }
  };

  const getTileIcon = () => {
    const iconClass = 'w-3 h-3 sm:w-4 sm:h-4';
    switch (tile.type) {
      case 'GO':
        return <div className={`${iconClass} font-bold text-board-gold text-[8px] sm:text-xs`}>GO</div>;
      case 'JAIL':
        return <Lock className={`${iconClass} text-orange-400`} />;
      case 'FREE_PARKING':
        return <Car className={`${iconClass} text-blue-400`} />;
      case 'GO_TO_JAIL':
        return <AlertTriangle className={`${iconClass} text-red-400`} />;
      case 'CHANCE':
        return <HelpCircle className={`${iconClass} text-orange-400`} />;
      case 'COMMUNITY_CHEST':
        return <Gift className={`${iconClass} text-blue-400`} />;
      case 'TAX':
        return <DollarSign className={`${iconClass} text-gray-400`} />;
      case 'RAILROAD':
        return <Train className={`${iconClass} text-gray-300`} />;
      case 'UTILITY':
        return tile.name.includes('Electric') ?
          <Zap className={`${iconClass} text-yellow-400`} /> :
          <Droplets className={`${iconClass} text-blue-400`} />;
      default:
        return null;
    }
  };

  const getColorBarPosition = () => {
    if (isCorner) return '';
    switch (position) {
      case 'bottom':
        return 'top-0 left-0 right-0 h-1.5 sm:h-2';
      case 'top':
        return 'bottom-0 left-0 right-0 h-1.5 sm:h-2';
      case 'left':
        return 'left-0 top-0 bottom-0 w-1.5 sm:w-2';
      case 'right':
        return 'right-0 top-0 bottom-0 w-1.5 sm:w-2';
      default:
        return '';
    }
  };

  const getOwnerColor = () => {
    if (!owner) return 'transparent';
    const colorMap: Record<string, string> = {
      'token-red': '#e74c3c',
      'token-blue': '#3498db',
      'token-green': '#27ae60',
      'token-yellow': '#f1c40f',
    };
    return colorMap[owner.tokenId] || '#ffffff';
  };

  return (
    <motion.div
      className={`${getTileSize()} relative border border-black/60 bg-gradient-to-br from-board-green to-board-dark cursor-pointer flex flex-col items-center justify-center overflow-hidden group`}
      onClick={onClick}
      whileHover={{ scale: 1.05, zIndex: 20 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Color bar for properties */}
      {tile.colorGroup && !isCorner && (
        <div
          className={`absolute ${getColorBarPosition()}`}
          style={{ backgroundColor: tile.color }}
        />
      )}

      {/* Owner indicator stripe */}
      {owner && (
        <div
          className="absolute top-0 right-0 w-2 h-2 sm:w-3 sm:h-3 rounded-bl"
          style={{ backgroundColor: getOwnerColor() }}
        />
      )}

      {/* Tile content */}
      <div className={`flex flex-col items-center justify-center p-0.5 sm:p-1 ${getRotation()}`}>
        {getTileIcon()}

        {isCorner && (
          <span className="text-[6px] sm:text-[8px] md:text-[10px] font-bold text-board-gold text-center leading-tight mt-0.5">
            {tile.name}
          </span>
        )}

        {!isCorner && tile.type !== 'GO' && (
          <span className="text-[5px] sm:text-[6px] md:text-[8px] text-white/80 text-center leading-tight truncate max-w-full px-0.5">
            {tile.name.split(' ').length > 1 ? tile.name.split(' ')[0] : tile.name}
          </span>
        )}

        {tile.price && (
          <span className="text-[5px] sm:text-[6px] md:text-[8px] text-board-gold font-bold mt-0.5">
            ${tile.price}
          </span>
        )}

        {tile.taxAmount && (
          <span className="text-[5px] sm:text-[6px] md:text-[8px] text-red-400 font-bold">
            -${tile.taxAmount}
          </span>
        )}
      </div>

      {/* Players on this tile */}
      {playersOnTile.length > 0 && (
        <div className="absolute bottom-0.5 left-0.5 flex flex-wrap gap-0.5 max-w-[90%]">
          {playersOnTile.map(player => (
            <motion.div
              key={player.id}
              className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full border-2 border-white/70 flex items-center justify-center text-[6px] sm:text-[8px] font-bold text-white shadow-md"
              style={{ backgroundColor: getOwnerColor() }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500 }}
              title={player.name}
            >
              {player.name[0].toUpperCase()}
            </motion.div>
          ))}
        </div>
      )}

      {/* Building indicators */}
      {owner && (() => {
        const building = owner.buildings.find(b => b.propertyId === tile.id);
        if (!building) return null;
        return (
          <div className="absolute top-0.5 right-0.5 flex gap-px">
            {building.hotel ? (
              <span className="text-[8px] sm:text-[10px]">🏨</span>
            ) : (
              Array.from({ length: Math.min(building.houses, 4) }).map((_, i) => (
                <span key={i} className="text-[6px] sm:text-[8px]">🏠</span>
              ))
            )}
          </div>
        );
      })()}

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors pointer-events-none" />
    </motion.div>
  );
}
