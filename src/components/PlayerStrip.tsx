import { motion, AnimatePresence } from 'framer-motion';
import { Player, BoardTile } from '../types';
import { formatMoney, getInitials } from '../game/engine';
import { Crown, Lock, TrendingUp } from 'lucide-react';
import { getCountryById } from '../data/boardData';

const PLAYER_COLORS: Record<string, string> = {
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

interface PlayerStripProps {
  players: Player[];
  currentPlayerIndex: number;
  board: BoardTile[];
}

export default function PlayerStrip({ players, currentPlayerIndex, board }: PlayerStripProps) {
  return (
    <div className="flex items-stretch border-b flex-shrink-0" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-1)', minHeight: 72 }}>
      {players.map((player, index) => {
        const isActive = index === currentPlayerIndex;
        const color = PLAYER_COLORS[player.tokenId] || '#888';
        const currentTile = board[player.position];
        const ownedProperties = player.properties;

        const colorGroups = [...new Set(
          ownedProperties
            .map(id => board.find(t => t.id === id)?.colorGroup)
            .filter(Boolean) as string[]
        )];

        const firstCountryProp = ownedProperties
          .map(id => board.find(t => t.id === id))
          .find(t => t?.country) as BoardTile | undefined;
        const countryFlag = firstCountryProp?.country ? getCountryById(firstCountryProp.country) : null;

        return (
          <motion.div
            key={player.id}
            className="flex-1 relative flex flex-col p-2.5 cursor-default transition-all"
            style={{
              borderRight: index < players.length - 1 ? '1px solid var(--color-border)' : 'none',
              borderTop: isActive ? `3px solid ${color}` : '3px solid transparent',
              opacity: player.bankrupt ? 0.5 : 1,
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0 relative"
                style={{ backgroundColor: color }}
              >
                {player.avatarUrl
                  ? <img src={player.avatarUrl} className="w-full h-full object-cover rounded-lg" alt="" />
                  : getInitials(player.name)
                }
                {isActive && (
                  <div
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white"
                    style={{ background: color, boxShadow: `0 0 6px ${color}` }}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-semibold text-xs truncate" style={{ color: isActive ? '#151515' : 'var(--color-text-secondary)' }}>
                    {player.name}
                  </span>
                  {countryFlag && (
                    <span className="text-sm flex-shrink-0" aria-label={countryFlag.name} title={countryFlag.name}>
                      {countryFlag.flag}
                    </span>
                  )}
                  {player.isBot && <span className="text-[9px]" style={{ color: 'var(--color-text-muted)' }}>BOT</span>}
                  {player.inJail && <Lock size={9} style={{ color: 'var(--color-red)' }} className="flex-shrink-0" />}
                  {player.bankrupt && <span className="badge badge-red" style={{ fontSize: 8, padding: '1px 4px' }}>OUT</span>}
                </div>
                <p className="font-bold text-sm" style={{ color: isActive ? color : 'var(--color-text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>
                  {formatMoney(player.money)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-0.5">
              {colorGroups.length > 0 && (
                colorGroups.map(group => (
                  <div
                    key={group}
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ background: COLOR_GROUP_COLORS[group] || '#888' }}
                    title={group}
                  />
                ))
              )}
            </div>

            <div className="mt-1">
              <p className="text-[10px] truncate" style={{ color: 'var(--color-text-muted)' }}>
                📍 {currentTile?.name || 'Go'}
              </p>
            </div>

            {isActive && (
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 rounded-t"
                style={{ background: color }}
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
