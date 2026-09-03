import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Play, UserMinus, Bot, Copy, Check, Settings, Globe, Link2 } from 'lucide-react';
import { useGameStore } from '../state/gameStore';
import { socketService } from '../services/socketService';
import { generateId, getInitials } from '../game/engine';

const PLAYER_COLORS: Record<string, string> = {
  'token-red': '#e74c3c',
  'token-orange': '#FF8C00',
  'token-blue': '#3b82f6',
  'token-purple': '#a78bfa',
  'token-green': '#22c55e',
  'token-yellow': '#f59e0b',
};

export default function LobbyPage() {
  const navigate = useNavigate();
  const { players, settings, startGame, removePlayer, addPlayer, gameId, roomCode, resetGame } = useGameStore();
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const displayRoomCode = roomCode || gameId.slice(0, 6).toUpperCase();
  const isOnline = !!roomCode;
  const hostPlayer = players[0];
  const canStart = players.length >= 2;
  const isAtMaxPlayers = players.length >= settings.maxPlayers;

  useEffect(() => {
    if (roomCode && !socketService.getRoomCode()) {
      socketService.reconnect(roomCode);
    }
  }, [roomCode]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(displayRoomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}?join=${displayRoomCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddBot = () => {
    if (isOnline) {
      socketService.addBot(displayRoomCode);
    } else {
      if (isAtMaxPlayers) return;
      const botNames = ['Alex', 'Sam', 'John'];
      const botColors = ['token-orange', 'token-blue', 'token-purple'];
      const botCount = players.filter(p => p.isBot).length;
      addPlayer({
        id: generateId(),
        name: botNames[botCount % botNames.length],
        avatarType: 'initials',
        tokenId: botColors[(players.length) % botColors.length],
        money: settings.startingMoney,
        position: 0,
        properties: [],
        buildings: [],
        inJail: false,
        jailTurns: 0,
        getOutOfJailCards: 0,
        bankrupt: false,
        isCurrentPlayer: false,
        connected: true,
        doublesCount: 0,
        isBot: true,
        isReady: true,
      });
    }
  };

   const handleStart = async () => {
     if (!canStart) return;
     if (isOnline) {
       const result = await socketService.startGame(displayRoomCode);
       if (!result.success) {
         return;
       }
     } else {
       startGame();
     }
     navigate('/game');
   };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAFAF8' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-black text-sm">M</div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: '-0.01em', color: '#151515' }}>Monopoly</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/stats')} className="btn btn-ghost btn-sm" title="Player Stats">
            📊
          </button>
          <button onClick={() => { resetGame(); socketService.disconnect(); navigate('/'); }} className="btn btn-ghost btn-sm">Leave</button>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">

          {/* Room Code Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="panel-raised p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="label mb-1">Room Code</p>
                <p className="mono text-3xl font-bold tracking-widest text-gold">{displayRoomCode}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={handleCopy} className="btn btn-surface btn-sm" title="Copy code">
                  {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  <span className="hidden sm:block">{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
                <button onClick={handleCopyLink} className="btn btn-ghost btn-icon" title="Copy invite link">
                  <Link2 size={14} />
                </button>
              </div>
            </div>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Share this code with friends to join your game
            </p>
          </motion.div>

          {/* Player Slots */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {Array.from({ length: settings.maxPlayers }).map((_, index) => {
              const player = players[index];
              const isHost = player?.id === hostPlayer?.id;
              const color = player ? PLAYER_COLORS[player.tokenId] || '#888' : undefined;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.06 }}
                  className={`panel p-4 relative ${player ? '' : 'border-dashed opacity-50'}`}
                  style={{
                    borderColor: player ? 'var(--color-border-active)' : undefined,
                    borderStyle: !player ? 'dashed' : undefined,
                  }}
                >
                  {player ? (
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 relative"
                          style={{ background: color }}
                        >
                          {getInitials(player.name)}
                          {isHost && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center">
                              <Crown size={9} className="text-black" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{player.name}</p>
                          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                            {player.isBot ? '🤖 Bot' : isHost ? 'Host' : 'Player'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="badge badge-green">Ready</span>
                        {players.length > 1 && !isHost && (
                          <button
                            onClick={() => removePlayer(player.id)}
                            className="btn btn-ghost btn-icon"
                            style={{ padding: '4px', borderRadius: '6px' }}
                          >
                            <UserMinus size={13} style={{ color: 'var(--color-red)' }} />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-20 gap-2">
                      <Globe size={20} style={{ color: 'var(--color-text-muted)' }} />
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Waiting…</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Settings (collapsible) */}
          <div className="panel mb-5">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium"
            >
              <span className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                <Settings size={14} /> Game Settings
              </span>
              <span className="label">{showSettings ? '▲' : '▼'}</span>
            </button>
            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="px-4 pb-4 grid grid-cols-2 gap-3"
              >
                <SettingItem label="Starting Money" value={`$${settings.startingMoney}`} />
                <SettingItem label="GO Salary" value={`$${settings.goSalary}`} />
                <SettingItem label="Max Players" value={`${settings.maxPlayers}`} />
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!isAtMaxPlayers && (
              <button onClick={handleAddBot} className="btn btn-surface btn-lg flex-1">
                <Bot size={16} /> Add Bot
              </button>
            )}
            <button
              onClick={handleStart}
              disabled={!canStart}
              className="btn btn-gold btn-lg flex-1"
            >
              <Play size={16} />
              {canStart ? `Start Game` : `Need ${2 - players.length} more`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel p-3">
      <p className="label mb-1">{label}</p>
      <p className="font-semibold text-sm">{value}</p>
    </div>
  );
}
