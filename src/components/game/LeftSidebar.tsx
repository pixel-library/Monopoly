import React from 'react';
import { motion } from 'framer-motion';
import PlayersPanel from './PlayersPanel';
import ChatPanel from './ChatPanel';
import { Player, BoardTile, ChatMessage } from '../../types';

interface LeftSidebarProps {
  players: Player[];
  currentPlayerIndex: number;
  board: BoardTile[];
  chatMessages: ChatMessage[];
  currentPlayerId: string;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  players,
  currentPlayerIndex,
  board,
  chatMessages,
  currentPlayerId,
}) => {
  return (
    <motion.aside
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-52 lg:w-52 w-full flex-shrink-0 flex flex-col border-r border-gray-200 bg-white overflow-hidden"
    >
      {/* Players section - takes about 40% */}
      <div className="p-2 border-b border-gray-200 overflow-y-auto">
        <PlayersPanel
          players={players}
          currentPlayerIndex={currentPlayerIndex}
          board={board}
          currentPlayerId={currentPlayerId}
        />
      </div>

      {/* Chat section - takes about 60% */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatPanel messages={chatMessages} currentPlayerId={currentPlayerId} />
      </div>
    </motion.aside>
  );
};

export default LeftSidebar;
