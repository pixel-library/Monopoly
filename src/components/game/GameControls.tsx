import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, RotateCcw } from 'lucide-react';
import { useGameStore } from '../../state/gameStore';
import { Player, BoardTile } from '../../types';
import { soundManager } from '../../game/soundManager';
import { socketService } from '../../services/socketService';

const PLAYER_COLOR_MAP: Record<string, string> = {
  'token-red': '#e74c3c',
  'token-orange': '#FF8C00',
  'token-blue': '#3b82f6',
  'token-purple': '#a78bfa',
  'token-green': '#22c55e',
  'token-yellow': '#f59e0b',
};

interface GameControlsProps {
  currentPlayer: Player;
  board: BoardTile[];
  roomCode?: string | null;
}

export const GameControls: React.FC<GameControlsProps> = ({
  currentPlayer,
  board,
  roomCode,
}) => {
  const { endTurn, bankHouses, bankHotels } = useGameStore();

  const currentTile = board[currentPlayer?.position ?? 0];
  const playerColor = PLAYER_COLOR_MAP[currentPlayer?.tokenId || ''] || '#888';
  const currentTileName = currentTile?.name || 'GO';

  const handleEndTurn = () => {
    soundManager.play('click');
    if (roomCode) {
      socketService.endTurn(roomCode);
    } else {
      endTurn();
    }
  };

  const handleUndo = () => {
    soundManager.play('click');
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full max-w-3xl mx-auto mt-2 mb-1 px-3"
    >
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-2 flex items-center justify-between">
        {/* Left: Current player info */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs"
              style={{ backgroundColor: playerColor }}
            >
              {currentPlayer?.name?.substring(0, 1).toUpperCase()}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-gray-500 uppercase">YOUR TURN</span>
              {currentPlayer?.inJail && (
                <span className="text-[10px] text-red-600 font-medium">IN JAIL</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
              <span>{currentPlayer?.name}</span>
              <span>•</span>
              <span className="font-medium">{currentTileName}</span>
            </div>
          </div>
        </div>

        {/* Right: Action buttons + bank supply */}
        <div className="flex items-center gap-2.5">
          <div className="text-[10px] text-gray-400 flex items-center gap-2.5">
            <span>🏠 {bankHouses}</span>
            <span>🏨 {bankHotels}</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleEndTurn}
            className="px-2.5 py-1.5 rounded-lg font-bold text-xs text-gray-600 hover:text-red-600 border border-gray-200 hover:bg-gray-50 transition-all"
          >
            End Turn
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleUndo}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            title="Undo"
          >
            <RotateCcw size={12} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default GameControls;
