import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '../types';
import { BOARD_TILES, getCountryById } from '../data/boardData';
import { formatMoney } from '../game/engine';
import { useGameStore } from '../state/gameStore';
import { socketService } from '../services/socketService';
import { soundManager } from '../game/soundManager';
import { X, TrendingUp, UserPlus, Users, Clock } from 'lucide-react';

interface AuctionModalProps {
  roomCode?: string | null;
}

export default function AuctionModal({ roomCode }: AuctionModalProps) {
  const { auction, players, currentPlayerIndex } = useGameStore();
  const [bidAmounts, setBidAmounts] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(30);

  const isHotseat = !roomCode;
  const auctionTile = auction ? BOARD_TILES.find(t => t.id === auction.tileId) : null;
  const country = auctionTile?.country ? getCountryById(auctionTile.country) : null;

  useEffect(() => {
    if (!auction || auction.status !== 'active') return;
    setTimeLeft(auction.timeLeft || 30);
    setBidAmounts({});
  }, [auction?.id, auction?.currentBid]);

  useEffect(() => {
    if (!auction || auction.status !== 'active' || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [auction?.id, auction?.status, timeLeft]);

  useEffect(() => {
    if (!auction || auction.status !== 'active' || timeLeft > 0) return;
    if (roomCode) return;
    useGameStore.getState().completeAuction();
  }, [auction?.id, auction?.status, timeLeft, roomCode]);

  const getCanBid = useCallback((player: Player) => {
    if (!auction || auction.status !== 'active') return false;
    if (auction.startedBy === player.id) return false;
    if (player.bankrupt) return false;
    if (!auction.activeBidders.includes(player.id)) return false;
    return player.money >= (auction.currentBid + 10);
  }, [auction]);

  const getBidAmount = useCallback((player: Player) => {
    return bidAmounts[player.id] || (auction ? auction.currentBid + 10 : 10);
  }, [bidAmounts, auction]);

  const handlePlaceBid = useCallback((player: Player) => {
    if (!auction || !getCanBid(player)) return;
    soundManager.play('cash');
    const amount = Math.max(auction.currentBid + 10, getBidAmount(player));
    if (roomCode) {
      socketService.placeBid(roomCode, amount);
    } else {
      useGameStore.getState().placeBid(player.id, amount);
    }
    setBidAmounts(prev => ({ ...prev, [player.id]: amount + 10 }));
  }, [auction, getCanBid, getBidAmount, roomCode]);

  const handlePass = useCallback((player: Player) => {
    if (!auction || auction.startedBy === player.id) return;
    soundManager.play('click');
    if (roomCode) {
      socketService.passBid(roomCode);
    } else {
      useGameStore.getState().passBid(player.id);
    }
  }, [auction, roomCode]);

  const highestBidder = auction ? players.find(p => p.id === auction.highestBidderId) : null;
  const starter = auction ? players.find(p => p.id === auction.startedBy) : null;
  const isCompleted = auction?.status === 'completed';

  if (!auction) return null;

  const renderPlayerPanel = (player: Player) => {
    const isStarter = player.id === auction.startedBy;
    const canBid = getCanBid(player);
    const bidAmount = getBidAmount(player);
    const isHighestBidder = player.id === auction.highestBidderId;

    return (
      <motion.div
        key={player.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl border-2 p-4 ${
          isStarter
            ? 'bg-blue-50 border-blue-200'
            : isHighestBidder
              ? 'bg-amber-50 border-amber-200'
              : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full"
              style={{
                backgroundColor:
                  player.tokenId === 'token-red' ? '#e74c3c' :
                  player.tokenId === 'token-orange' ? '#FF8C00' :
                  player.tokenId === 'token-blue' ? '#3b82f6' :
                  player.tokenId === 'token-purple' ? '#a78bfa' :
                  player.tokenId === 'token-green' ? '#22c55e' :
                  player.tokenId === 'token-yellow' ? '#f59e0b' : '#9ca3af',
              }}
            />
            <span className="font-bold text-xs text-gray-900">{player.name}</span>
          </div>
          {isStarter && (
            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">STARTER</span>
          )}
          {isHighestBidder && !isStarter && (
            <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">HIGHEST BIDDER</span>
          )}
        </div>

        {auctionTile && (
          <div className="flex items-center gap-2 mb-3 bg-gray-50 rounded-lg p-2">
            {country && (
              <div className="w-8 h-8 rounded-full bg-white border border-gray-100 shadow flex items-center justify-center text-xl flex-shrink-0">
                {country.flag}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-bold text-xs text-gray-900 truncate">{auctionTile.name}</p>
              <p className="text-[10px] text-gray-500">{auctionTile.type}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <p className="text-[10px] text-gray-500 mb-0.5">Current Bid</p>
            <p className="text-lg font-extrabold text-gray-900 font-mono">{formatMoney(auction.currentBid)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <p className="text-[10px] text-gray-500 mb-0.5">Time Left</p>
            <p className={`text-lg font-extrabold font-mono ${timeLeft < 10 ? 'text-red-600' : 'text-gray-900'}`}>
              {timeLeft}s
            </p>
          </div>
        </div>

        {highestBidder ? (
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-lg px-2 py-1.5 mb-3">
            <TrendingUp size={14} className="text-amber-600" />
            <span className="text-[11px] text-amber-900">
              Highest: <span className="font-bold">{highestBidder.name}</span>
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1.5 mb-3">
            <UserPlus size={14} className="text-gray-400" />
            <span className="text-[11px] text-gray-500">No bids yet. Be the first!</span>
          </div>
        )}

        {isCompleted && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-2 py-1.5 mb-3">
            <p className="text-[11px] text-emerald-800 font-bold text-center">
              AUCTION COMPLETE
            </p>
            {auction.winnerId && (
              <p className="text-[11px] text-emerald-700 text-center">
                Winner: {players.find(p => p.id === auction.winnerId)?.name} at {formatMoney(auction.winningBid || 0)}
              </p>
            )}
            {isStarter && auction.winningBid && (
              <p className="text-[10px] text-emerald-600 text-center">
                Commission: +{formatMoney(Math.round((auction.winningBid || 0) * 0.05))}
              </p>
            )}
          </div>
        )}

        {auction.bids.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-2 mb-3">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Bid History</p>
            <div className="space-y-0.5 max-h-24 overflow-y-auto">
              {auction.bids.slice().reverse().map((bid, idx) => {
                const bidder = players.find(p => p.id === bid.playerId);
                return (
                  <div key={idx} className="flex justify-between text-[11px]">
                    <span className="text-gray-600">{bidder?.name || 'Unknown'}</span>
                    <span className="font-mono font-bold text-gray-900">{formatMoney(bid.amount)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isCompleted ? null : isStarter ? (
          <div className="bg-blue-50 border border-blue-100 rounded-lg px-2 py-1.5">
            <p className="text-[11px] text-blue-700 font-medium text-center">You started this auction. You can observe but cannot bid.</p>
          </div>
        ) : canBid ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmounts(prev => ({ ...prev, [player.id]: Number(e.target.value) }))}
                min={auction.currentBid + 10}
                max={player.money}
                className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <span className="text-[10px] text-gray-500">min +$10</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handlePlaceBid(player)}
                disabled={!canBid}
                className="py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-lg font-bold text-xs transition-all active:scale-95 shadow-md disabled:shadow-none"
              >
                Place Bid
              </button>
              <button
                onClick={() => handlePass(player)}
                disabled={!canBid}
                className="py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg font-bold text-xs transition-all active:scale-95 disabled:opacity-50"
              >
                Pass
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-1.5">
            <p className="text-[11px] text-gray-500">
              {!auction.activeBidders.includes(player.id) ? 'You are not an active bidder' : 'You cannot afford the minimum bid'}
            </p>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-white" size={24} />
            <h2 className="text-xl font-extrabold text-white tracking-tight">LIVE AUCTION</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1">
              <Users size={16} className="text-white" />
              <span className="text-white font-bold text-sm">{auction.activeBidders.length + 1}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {isHotseat ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {players.map(renderPlayerPanel)}
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              {currentPlayerIndex >= 0 && currentPlayerIndex < players.length && renderPlayerPanel(players[currentPlayerIndex])}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
