import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, Lock, Copy, Check, Users } from 'lucide-react';
import { useGameStore } from '../state/gameStore';
import { socketService } from '../services/socketService';
import { soundManager } from '../game/soundManager';
import { BoardTile } from '../types';
import MonopolyBoard from '../components/monopoly/MonopolyBoard';
import LeftSidebar from '../components/game/LeftSidebar';
import RightSidebar from '../components/game/RightSidebar';
import GameControls from '../components/game/GameControls';
import PropertyDrawer from '../components/PropertyDrawer';
import TradeDrawer from '../components/TradeDrawer';
import CardRevealModal from '../components/CardRevealModal';
import IncomeTaxModal from '../components/IncomeTaxModal';
import BuildPanel from '../components/BuildPanel';
import LandingModal from '../components/LandingModal';
import AuctionModal from '../components/AuctionModal';

export default function GamePage() {
  const navigate = useNavigate();
   const {
      players, currentPlayerIndex, dice, turnState, logs,
       board, bankHouses, bankHotels, auction, trade,
      payJailFine, useJailCard, setPhase,
     isTradeModalOpen, setTradeModalOpen, isStoreOpen, setStoreOpen,
     lastCard, resolveTile, payIncomeTax, chatMessages, roomCode,
     setRoomCode, rollDiceAction, turnNumber,
     powerUps, usePowerUp, playerStats, myPlayerId,
   } = useGameStore();

  const [selectedTile, setSelectedTile] = useState<BoardTile | null>(null);
  const [showBuild, setShowBuild] = useState(false);
  const [activeTab, setActiveTab] = useState<'trade' | 'store' | 'settings' | 'effects'>('trade');
  const [rolling, setRolling] = useState(false);
  const [landingTile, setLandingTile] = useState<BoardTile | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const landingShownRef = React.useRef(false);

  const currentPlayer = players[currentPlayerIndex];
  const isMyTurn = currentPlayer?.isCurrentPlayer;
  const currentPlayerId = players.find(p => p.isCurrentPlayer)?.id || '';

  const canRoll = turnState.phase === 'ROLL' && !turnState.hasRolled;
  const showRollAgain = turnState.phase === 'ACTION' && turnState.canRollAgain && !currentPlayer?.inJail;

  const handleRoll = useCallback(() => {
    if (!currentPlayer) return;
    soundManager.play('dice');
    setRolling(true);
    if (roomCode) {
      socketService.rollDice(roomCode);
    } else {
      rollDiceAction();
    }
    setTimeout(() => setRolling(false), 1500);
  }, [currentPlayer, roomCode, rollDiceAction]);

  useEffect(() => {
    if (dice && rolling) {
      const timer = setTimeout(() => {
        setRolling(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [dice, rolling]);

  useEffect(() => {
    if (roomCode && !socketService.getRoomCode()) {
      socketService.reconnect(roomCode);
    }
  }, [roomCode]);

  useEffect(() => {
    landingShownRef.current = false;
  }, [turnNumber, currentPlayerIndex]);

  useEffect(() => {
    if (!currentPlayer || !dice || !turnState.hasRolled) return;
    if (turnState.phase !== 'ACTION') return;
    if (landingTile) return;
    if (landingShownRef.current) return;

    const tile = board[currentPlayer.position];
    if (!tile) return;
    if (tile.type !== 'PROPERTY' && tile.type !== 'RAILROAD' && tile.type !== 'UTILITY') return;
    if (!tile.price) return;
    const owner = players.find(p => p.properties.includes(tile.id));
    if (owner) return;

    const timer = setTimeout(() => {
      setLandingTile(tile);
      landingShownRef.current = true;
    }, 600);
    return () => clearTimeout(timer);
  }, [dice, turnState.hasRolled, turnState.phase, currentPlayer?.position, landingTile, board, players]);

  const handlePayJail = useCallback(() => {
    soundManager.play('cash');
    if (roomCode) {
      socketService.payJail(roomCode);
    } else {
      payJailFine(currentPlayer.id);
    }
  }, [currentPlayer, roomCode]);

  const handleUseJailCard = useCallback(() => {
    soundManager.play('card');
    if (roomCode && currentPlayer) {
      socketService.useJailCard(roomCode);
    } else if (currentPlayer) {
      useJailCard(currentPlayer.id);
    }
  }, [currentPlayer, roomCode]);

  const handleLeave = () => {
    socketService.disconnect();
    setPhase('SETUP');
    setRoomCode(null);
    navigate('/');
  };

  const handleTileClick = (tile: BoardTile) => {
    setSelectedTile(tile);
    soundManager.play('click');
  };

  const handleCopyRoomCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
    }
  };

  if (!currentPlayer) return null;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* ── Top Bar ── */}
      <header className="flex items-center justify-between px-3 py-2 flex-shrink-0 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-red-600 flex items-center justify-center text-white font-black text-xs">
            M
          </div>
          <span className="font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#151515' }}>
            Monopoly
          </span>
          {roomCode && (
            <span className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs font-mono">
              {roomCode}
            </span>
          )}
          <span className="px-1.5 py-0.5 bg-red-100 text-red-700 border border-red-200 rounded text-xs font-bold">
            Turn {turnNumber}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
           <button
            onClick={() => navigate('/stats')}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-amber-600 transition-colors"
            title="Player Statistics"
          >
            📊
          </button>
          {powerUps.filter(p => !p.used).length > 0 && (
            <div className="flex items-center gap-1">
              {powerUps.filter(p => !p.used).map(p => (
                <div
                  key={p.id}
                  title={`${p.name}: ${p.description}`}
                  className="w-5 h-5 rounded-full bg-amber-400/20 flex items-center justify-center text-xs cursor-pointer hover:bg-amber-400/40"
                  onClick={() => {
                    usePowerUp(p.id);
                    soundManager.play('card');
                  }}
                >
                  {p.icon}
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            className="lg:hidden flex items-center gap-1 text-xs text-gray-500 hover:text-amber-600 transition-colors"
            title="Players & Chat"
          >
            <Users size={12} />
          </button>
          <button onClick={handleLeave} className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 transition-colors">
            <LogOut size={12} />
            <span>Leave</span>
          </button>
        </div>
      </header>

      {/* ── Incoming Trade Notification ── */}
      {(trade && trade.status === 'pending' && trade.toPlayerId === currentPlayerId) && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-800">Incoming Trade</span>
              <span className="text-xs text-amber-600">
                {players.find(p => p.id === trade.fromPlayerId)?.name} wants to trade
              </span>
            </div>
            <div className="flex items-center gap-2">
              {roomCode ? (
                <>
                  <button
                    onClick={() => {
                       socketService.tradeResponse(roomCode, true);
                    }}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => {
                       socketService.tradeResponse(roomCode, false);
                    }}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-xs font-bold transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                       socketService.tradeResponse(roomCode, false);
                    }}
                    className="px-3 py-1 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Wait
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      if (currentPlayerId === trade.toPlayerId) {
                        useGameStore.getState().acceptTrade();
                      }
                    }}
                    disabled={currentPlayerId !== trade.toPlayerId}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => {
                      if (currentPlayerId === trade.toPlayerId) {
                        useGameStore.getState().rejectTrade();
                      }
                    }}
                    disabled={currentPlayerId !== trade.toPlayerId}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      if (currentPlayerId === trade.toPlayerId) {
                        useGameStore.getState().waitTrade();
                      }
                    }}
                    disabled={currentPlayerId !== trade.toPlayerId}
                    className="px-3 py-1 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Wait
                  </button>
                </>
              )}
              <button
                onClick={() => setTradeModalOpen(true)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
              >
                View
              </button>
            </div>
          </div>
          {!roomCode && currentPlayerId !== trade.toPlayerId && (
            <p className="text-[10px] text-amber-600 mt-1">Waiting for {players.find(p => p.id === trade.toPlayerId)?.name}'s turn to respond.</p>
          )}
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Mobile sidebar overlay */}
        {showMobileSidebar && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setShowMobileSidebar(false)}
          />
        )}

        {/* ── Left Sidebar ── */}
        <div className={`${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative inset-y-0 left-0 z-40 lg:z-auto transition-transform duration-200`}>
          <LeftSidebar
            players={players}
            currentPlayerIndex={currentPlayerIndex}
            board={board}
            chatMessages={chatMessages}
            currentPlayerId={currentPlayerId}
          />
        </div>

        {/* ── Center: Board ── */}
        <main className="flex-1 flex flex-col items-center justify-center overflow-auto p-2 relative min-h-0">
          <div className="flex-1 flex items-center justify-center w-full min-h-0">
            <MonopolyBoard
              players={players}
              onTileClick={handleTileClick}
              dice={dice}
              rolling={rolling}
              onRoll={handleRoll}
              canRoll={canRoll}
              showRollAgain={showRollAgain}
              messages={logs.slice(0, 3).reverse()}
            />
          </div>

          {/* Bottom Game Controls */}
          <GameControls
            currentPlayer={currentPlayer}
            board={board}
            roomCode={roomCode}
            myPlayerId={myPlayerId}
          />
        </main>

        {/* ── Right Sidebar ── */}
        <div className="hidden lg:block flex-shrink-0">
          <RightSidebar
            logs={logs}
            roomCode={roomCode}
          />
        </div>
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {selectedTile && (
          <PropertyDrawer
            tile={selectedTile}
            players={players}
            onClose={() => setSelectedTile(null)}
            onTrade={() => setTradeModalOpen(true)}
            onBuild={() => setShowBuild(true)}
            currentPlayer={currentPlayer}
            roomCode={roomCode}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isTradeModalOpen && (
          <TradeDrawer onClose={() => setTradeModalOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lastCard && (
          <CardRevealModal card={lastCard} onClose={() => useGameStore.setState({ lastCard: null })} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {turnState.phase === 'TAX_DECISION' && currentPlayer && (
          <IncomeTaxModal
            player={currentPlayer}
            onPayFixed={() => {
              soundManager.play('cash');
              if (roomCode) {
                 socketService.payIncomeTax(roomCode, true);
              } else {
                payIncomeTax(true);
              }
            }}
            onPayPercent={() => {
              soundManager.play('cash');
              if (roomCode) {
                 socketService.payIncomeTax(roomCode, false);
              } else {
                payIncomeTax(false);
              }
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {landingTile && currentPlayer && turnState.phase === 'ACTION' && turnState.hasRolled && (
          <LandingModal
            tile={landingTile}
            player={currentPlayer}
            players={players}
            roomCode={roomCode}
            onClose={() => setLandingTile(null)}
            onActionComplete={() => setLandingTile(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBuild && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
            onClick={() => setShowBuild(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-gray-200 rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden"
            >
              <BuildPanel
                currentPlayer={currentPlayer}
                board={board}
                onClose={() => setShowBuild(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {auction && (auction.status === 'active' || auction.status === 'completed') && (
          <AuctionModal roomCode={roomCode} />
        )}
      </AnimatePresence>
    </div>
  );
}
