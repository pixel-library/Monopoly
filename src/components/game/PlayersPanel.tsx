import React from 'react';
import { motion } from 'framer-motion';
import { Player, BoardTile } from '../../types';
import { formatMoney } from '../../game/engine';
import { PlayerCard } from './PlayerCard';
import { Crown, Lock } from 'lucide-react';

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

interface PlayersPanelProps {
  players: Player[];
  currentPlayerIndex: number;
  board: BoardTile[];
  currentPlayerId: string;
  onPlayerClick?: (player: Player) => void;
}

export const PlayersPanel: React.FC<PlayersPanelProps> = ({
  players,
  currentPlayerIndex,
  board,
  currentPlayerId,
  onPlayerClick,
}) => {
  const activePlayers = players.filter(p => !p.bankrupt);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1 mb-2">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Players ({activePlayers.length}/{players.length})
        </h3>
      </div>

      {players.map((player, index) => {
        const isActive = index === currentPlayerIndex;
        const isCurrentUser = player.id === currentPlayerId;
        const playerColor = PLAYER_COLOR_MAP[player.tokenId] || '#888';

        return (
          <PlayerCard
            key={player.id}
            player={player}
            isCurrentPlayer={isActive}
            isCurrentUser={isCurrentUser}
            onClick={() => onPlayerClick?.(player)}
          />
        );
      })}

      {/* Property summary strip */}
      {activePlayers.some(p => p.properties.length > 0) && (
        <div className="mt-3 pt-2 border-t border-gray-200 space-y-2">
          {activePlayers
            .filter(p => p.properties.length > 0)
            .map(player => {
              const colorGroups = [...new Set(
                player.properties
                  .map(id => board.find(t => t.id === id)?.colorGroup)
                  .filter(Boolean) as string[]
              )];

              return (
                <div key={player.id} className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: PLAYER_COLOR_MAP[player.tokenId] || '#888' }}
                  />
                  <span className="text-xs font-medium text-gray-600 truncate">
                    {player.name}
                  </span>
                  <div className="flex flex-wrap gap-0.5 ml-auto">
                    {colorGroups.map(group => (
                      <div
                        key={group}
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: COLOR_GROUP_COLORS[group] || '#888' }}
                        title={group}
                      />
                    ))}
                  </div>
                  {player.properties.length > 0 && (
                    <span className="text-xs text-gray-400">
                      {player.properties.length} {player.properties.length === 1 ? 'prop' : 'props'}
                    </span>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default PlayersPanel;
