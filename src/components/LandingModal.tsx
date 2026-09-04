import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BoardTile, Player } from '../types';
import { getCountryById } from '../data/boardData';
import { formatMoney } from '../game/engine';
import { useGameStore } from '../state/gameStore';
import { socketService } from '../services/socketService';
import { soundManager } from '../game/soundManager';
import { ShoppingCart, Gavel, SkipForward, Loader2 } from 'lucide-react';

interface LandingModalProps {
  tile: BoardTile;
  player: Player;
  players: Player[];
  roomCode?: string | null;
  onClose: () => void;
  onActionComplete?: () => void;
  isMyTurn?: boolean;
}

export default function LandingModal({ tile, player, players, roomCode, onClose, onActionComplete, isMyTurn = true }: LandingModalProps) {
  const { declinePropertyPurchase } = useGameStore();
  const country = tile.country ? getCountryById(tile.country) : null;
  const rentObj = typeof tile.rent === 'object' && 'base' in tile.rent ? tile.rent : null;
  const canAfford = player.money >= (tile.price || 0);
  const [processing, setProcessing] = useState<string | null>(null);

  const owner = players.find(p => p.properties.includes(tile.id));
  const isOwned = !!owner;
  const isCurrentPlayerOwner = owner?.id === player.id;
  const canBuy = !isOwned && canAfford;

  const handleBuy = useCallback(() => {
    if (processing || isOwned) return;
    setProcessing('buy');
    soundManager.play('cash');

    const executeBuy = () => {
      if (roomCode) {
        socketService.buyProperty(roomCode, tile.id);
      } else {
        useGameStore.getState().buyProperty(player.id, tile.id);
      }
      onActionComplete?.();
      onClose();
    };

    executeBuy();
  }, [player, tile, roomCode, processing, isOwned, onClose, onActionComplete]);

  const handleAuction = useCallback(() => {
    if (processing) return;
    setProcessing('auction');
    soundManager.play('click');

    const executeAuction = () => {
      if (roomCode) {
        socketService.startAuction(roomCode, tile.id);
      } else {
        useGameStore.getState().startAuction(tile.id);
      }
      onActionComplete?.();
      onClose();
    };

    executeAuction();
  }, [player, tile, roomCode, processing, onClose, onActionComplete]);

  const handlePass = useCallback(() => {
    if (processing || isOwned) return;
    setProcessing('pass');
    soundManager.play('click');

    const executePass = () => {
      if (roomCode) {
        socketService.declineProperty(roomCode, tile.id);
      } else {
        declinePropertyPurchase(player.id, tile.id);
      }
      onActionComplete?.();
      onClose();
    };

    executePass();
  }, [player, tile, roomCode, processing, isOwned, declinePropertyPurchase, onClose, onActionComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.92, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 16 }}
        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-gradient-to-br from-gray-50 to-white p-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
          {country && (
            <div className="w-14 h-14 rounded-full bg-white border-2 border-gray-100 shadow-md flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden" aria-label={country.name}>
              {country.flag}
            </div>
          )}
            <div className="min-w-0">
              <h2 className="text-lg font-extrabold text-gray-900 leading-tight truncate">{tile.name}</h2>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                {tile.type === 'PROPERTY' ? 'Property' : tile.type === 'RAILROAD' ? 'Railroad' : tile.type === 'UTILITY' ? 'Utility' : tile.type}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-3">
          {tile.price && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Price</span>
              <span className="text-xl font-bold text-gray-900 font-mono">{formatMoney(tile.price)}</span>
            </div>
          )}

          {isOwned && (
            <div className="px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-xs text-blue-700 font-medium text-center">
                {isCurrentPlayerOwner ? 'You already own this property' : `Owned by ${owner?.name}`}
              </p>
            </div>
          )}

          {!isOwned && !canAfford && !processing && (
            <div className="px-3 py-2 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-xs text-red-700 font-medium text-center">Insufficient Balance</p>
            </div>
          )}

          {rentObj && (
            <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Rent Schedule</p>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Base Rent</span>
                <span className="font-mono font-bold text-gray-900">{formatMoney(rentObj.base)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">1 House</span>
                <span className="font-mono font-bold text-gray-900">{formatMoney(rentObj.oneHouse)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">2 Houses</span>
                <span className="font-mono font-bold text-gray-900">{formatMoney(rentObj.twoHouses)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">3 Houses</span>
                <span className="font-mono font-bold text-gray-900">{formatMoney(rentObj.threeHouses)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">4 Houses</span>
                <span className="font-mono font-bold text-gray-900">{formatMoney(rentObj.fourHouses)}</span>
              </div>
              <div className="flex justify-between text-xs pt-1 border-t border-gray-200">
                <span className="text-gray-900 font-bold">Hotel</span>
                <span className="font-mono font-bold text-red-600">{formatMoney(rentObj.hotel)}</span>
              </div>
            </div>
          )}

          {tile.houseCost && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">House Cost</span>
              <span className="font-mono font-bold text-gray-900">{formatMoney(tile.houseCost)}</span>
            </div>
          )}

          {tile.mortgageValue && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Mortgage Value</span>
              <span className="font-mono font-bold text-gray-900">{formatMoney(tile.mortgageValue)}</span>
            </div>
          )}

          {tile.price && !isOwned && (
            <div className="pt-2">
              {isMyTurn ? (
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={handleBuy}
                    disabled={!canBuy || !!processing}
                    className="col-span-1 flex flex-col items-center gap-1 py-3 px-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl font-bold text-xs transition-all active:scale-95 shadow-md disabled:shadow-none"
                  >
                    {processing === 'buy' ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <ShoppingCart size={18} />
                    )}
                    <span>{processing === 'buy' ? 'Buying...' : 'Buy'}</span>
                  </button>
                  <button
                    onClick={handleAuction}
                    disabled={!!processing}
                    className="col-span-1 flex flex-col items-center gap-1 py-3 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-md disabled:opacity-50"
                  >
                    {processing === 'auction' ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Gavel size={18} />
                    )}
                    <span>{processing === 'auction' ? 'Starting...' : 'Auction'}</span>
                  </button>
                  <button
                    onClick={handlePass}
                    disabled={!!processing}
                    className="col-span-1 flex flex-col items-center gap-1 py-3 px-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl font-bold text-xs transition-all active:scale-95 disabled:opacity-50"
                  >
                    {processing === 'pass' ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <SkipForward size={18} />
                    )}
                    <span>{processing === 'pass' ? 'Passing...' : 'Pass'}</span>
                  </button>
                </div>
              ) : (
                <div className="px-3 py-2 bg-amber-50 border border-amber-100 rounded-lg">
                  <p className="text-xs text-amber-700 font-medium text-center">
                    Waiting for {player.name} to decide...
                  </p>
                </div>
              )}
            </div>
          )}

          {isOwned && (
            <div className="pt-2">
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={onClose}
                  className="w-full flex flex-col items-center gap-1 py-3 px-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs transition-all active:scale-95"
                >
                  <span>Close</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
