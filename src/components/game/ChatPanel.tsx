import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '../../types';
import { Send, Smile, Mic } from 'lucide-react';
import { useGameStore } from '../../state/gameStore';
import { socketService } from '../../services/socketService';

const PLAYER_COLOR_MAP: Record<string, string> = {
  'token-red': '#e74c3c',
  'token-orange': '#FF8C00',
  'token-blue': '#3b82f6',
  'token-purple': '#a78bfa',
  'token-green': '#22c55e',
  'token-yellow': '#f59e0b',
};

interface ChatPanelProps {
  messages: ChatMessage[];
  currentPlayerId: string;
  roomCode?: string | null;
}

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    playerName: 'Alex',
    playerId: 'alex',
    message: 'Hey! Good luck everyone!',
    timestamp: Date.now() - 100000,
    isOwnMessage: false,
  },
  {
    id: '2',
    playerName: 'Sam',
    playerId: 'sam',
    message: "Thanks! Let's have fun",
    timestamp: Date.now() - 90000,
    isOwnMessage: false,
  },
  {
    id: '3',
    playerName: 'John',
    playerId: 'john',
    message: 'My strategy is ready',
    timestamp: Date.now() - 80000,
    isOwnMessage: false,
  },
];

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, currentPlayerId, roomCode }) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const addChatMessage = useGameStore((state) => state.addChatMessage);
  const isOnline = !!roomCode;

  const displayMessages = messages.length > 0 ? messages : MOCK_MESSAGES;

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getPlayerColor = (playerId: string) => {
    const players = useGameStore.getState().players;
    const player = players.find(p => p.id === playerId);
    if (!player) return '#666';
    return PLAYER_COLOR_MAP[player.tokenId] || '#666';
  };

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (isOnline) {
      // In online mode: emit to server; server broadcasts back to all clients in the room.
      // Do NOT write to local store here — the server echo will do it via receiveChatMessage.
      socketService.sendChat(trimmed);
    } else {
      addChatMessage(trimmed, currentPlayerId);
    }
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [displayMessages]);

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b border-gray-200 flex-shrink-0">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Chat</h3>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 py-2 space-y-3 scrollbar-thin"
      >
        <AnimatePresence>
          {displayMessages.map((msg) => {
            const isOwn = msg.isOwnMessage;
            const color = getPlayerColor(msg.playerId);
            const initials = msg.playerName.substring(0, 1).toUpperCase();

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: isOwn ? 20 : -20 }}
                className="flex gap-2"
              >
                <div
                  className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: color }}
                >
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-xs font-semibold ${
                        isOwn ? 'text-red-600' : 'text-gray-800'
                      }`}
                    >
                      {msg.playerName}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-0.5">{msg.message}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="p-2 border-t border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <Smile size={16} />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-200"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="p-1.5 text-gray-400 hover:text-red-600 disabled:opacity-30 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      <div className="px-3 py-2 border-t border-gray-200 flex justify-center gap-3 flex-shrink-0">
        <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
          <Smile size={14} />
        </button>
        <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
          <Mic size={14} />
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
