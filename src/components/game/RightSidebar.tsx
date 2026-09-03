import React from 'react';
import { motion } from 'framer-motion';
import { GameLog } from '../../types';
import { useGameStore } from '../../state/gameStore';
import { socketService } from '../../services/socketService';
import { ArrowRightLeft, Users, FileText } from 'lucide-react';

interface RightSidebarProps {
  logs: GameLog[];
  roomCode?: string | null;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ logs, roomCode }) => {
  const { players, currentPlayerIndex, setTradeModalOpen } = useGameStore();
  const currentPlayer = players[currentPlayerIndex];
  const isHotseat = !roomCode;
  const canTrade = !isHotseat || currentPlayer?.isCurrentPlayer;

  return (
    <motion.aside
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-56 flex-shrink-0 flex flex-col border-l border-gray-200 bg-white overflow-hidden"
    >
      {/* Players */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center gap-1.5 mb-2">
          <Users size={14} className="text-gray-500" />
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Players</h3>
        </div>
        <div className="space-y-1.5">
          {players.map((player, idx) => (
            <div
              key={player.id}
              className={`flex items-center gap-2 p-2 rounded-lg border ${
                idx === currentPlayerIndex
                  ? 'bg-red-50 border-red-200'
                  : 'bg-gray-50 border-gray-100'
              }`}
            >
              <div
                className="w-6 h-6 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: player.tokenId === 'token-red' ? '#e74c3c' :
                    player.tokenId === 'token-orange' ? '#FF8C00' :
                    player.tokenId === 'token-blue' ? '#3b82f6' :
                    player.tokenId === 'token-purple' ? '#a78bfa' :
                    player.tokenId === 'token-green' ? '#22c55e' :
                    player.tokenId === 'token-yellow' ? '#f59e0b' : '#9ca3af',
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-gray-900 truncate">{player.name}</p>
                <p className="text-[10px] text-gray-500">${player.money}</p>
              </div>
              {idx === currentPlayerIndex && (
                <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.5 rounded font-bold">YOU</span>
              )}
              {player.bankrupt && (
                <span className="text-[9px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded font-bold">OUT</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Trade Button */}
      <div className="p-3 border-b border-gray-200">
        <button
          onClick={() => canTrade && setTradeModalOpen(true)}
          disabled={!canTrade}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs transition-all active:scale-95 shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ArrowRightLeft size={14} />
          {isHotseat && !canTrade ? 'Not Your Turn' : 'TRADE'}
        </button>
      </div>

      {/* Game Log */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="p-3 pb-1.5">
          <div className="flex items-center gap-1.5">
            <FileText size={14} className="text-gray-500" />
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Game Log</h3>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
          {logs.slice(0, 20).map(log => (
            <div
              key={log.id}
              className={`text-[11px] leading-snug p-1.5 rounded-md ${
                log.type === 'success' ? 'bg-emerald-50 text-emerald-800' :
                log.type === 'warning' ? 'bg-amber-50 text-amber-800' :
                log.type === 'error' ? 'bg-red-50 text-red-800' :
                log.type === 'action' ? 'bg-blue-50 text-blue-800' :
                'bg-gray-50 text-gray-700'
              }`}
            >
              {log.message}
            </div>
          ))}
          {logs.length === 0 && (
            <p className="text-[11px] text-gray-400 text-center py-4">No events yet</p>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default RightSidebar;
