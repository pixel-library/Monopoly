import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../state/gameStore';
import { socketService } from '../services/socketService';
import { BOARD_TILES } from '../data/boardData';
import { Player, BoardTile } from '../types';
import { formatMoney, generateId } from '../game/engine';
import { X, ArrowRightLeft, DollarSign, CheckCircle2 } from 'lucide-react';

interface TradeDrawerProps {
  onClose: () => void;
}

export default function TradeDrawer({ onClose }: TradeDrawerProps) {
  const { players, currentPlayerIndex, setTradeModalOpen, roomCode } = useGameStore();
  const socketRoomCode = socketService.getRoomCode();

  const sender = players[currentPlayerIndex];
  const availablePartners = players.filter((_, idx) => idx !== currentPlayerIndex && !_.bankrupt);

  const [targetPlayerId, setTargetPlayerId] = useState<string>(availablePartners[0]?.id || '');
  const receiver = players.find(p => p.id === targetPlayerId);

  const [offerMoney, setOfferMoney] = useState<number>(0);
  const [requestMoney, setRequestMoney] = useState<number>(0);
  const [offerProperties, setOfferProperties] = useState<number[]>([]);
  const [requestProperties, setRequestProperties] = useState<number[]>([]);

  const isHotseat = !roomCode && !socketRoomCode;
  const canSend = isHotseat ? sender?.isCurrentPlayer : true;

  if (!sender || !receiver) {
    return (
      <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 p-6 rounded-2xl max-w-sm text-center shadow-xl">
          <p className="text-gray-500 mb-4">No other active players available to trade with.</p>
          <button onClick={onClose} className="bg-gray-100 px-4 py-2 rounded-xl text-sm font-bold text-gray-700">Close</button>
        </div>
      </div>
    );
  }

  const senderTiles = sender.properties.map(id => BOARD_TILES.find(t => t.id === id)).filter(Boolean) as BoardTile[];
  const receiverTiles = receiver.properties.map(id => BOARD_TILES.find(t => t.id === id)).filter(Boolean) as BoardTile[];

  const toggleOfferProp = (id: number) => {
    setOfferProperties(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const toggleRequestProp = (id: number) => {
    setRequestProperties(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const handleSendTrade = () => {
    if (!canSend) return;

    const tradeData = {
      fromPlayerId: sender.id,
      toPlayerId: receiver.id,
      offeredMoney: offerMoney,
      offeredPropertyIds: offerProperties,
      requestedMoney: requestMoney,
      requestedPropertyIds: requestProperties,
    };

    const effectiveRoomCode = roomCode || socketRoomCode;
    if (effectiveRoomCode) {
      socketService.proposeTrade(effectiveRoomCode, tradeData);
    } else {
      useGameStore.getState().proposeTrade({
        id: generateId(),
        ...tradeData,
        offeredProperties: offerProperties,
        requestedProperties: requestProperties,
        status: 'pending',
        createdAt: Date.now(),
      });
    }
    setTradeModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="text-red-600" size={20} />
            <h2 className="font-extrabold text-base tracking-wide text-gray-800">Propose Trade Deal</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Partner Select */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
          <span className="text-xs text-gray-500 font-semibold uppercase">Trade With:</span>
          <select
            value={targetPlayerId}
            onChange={(e) => {
              setTargetPlayerId(e.target.value);
              setRequestProperties([]);
              setRequestMoney(0);
            }}
            disabled={!canSend}
            className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold text-red-700 focus:outline-none focus:border-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {availablePartners.map(p => (
              <option key={p.id} value={p.id}>{p.name} (${p.money})</option>
            ))}
          </select>
        </div>

        {/* Dual Pane Deal Construction */}
        <div className="flex-1 grid grid-cols-2 divide-x divide-gray-200 overflow-y-auto p-4 gap-4 scrollbar-thin">

          {/* SENDER OFFERS */}
          <div className="space-y-4 pr-2">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <span className="font-bold text-xs text-red-700 uppercase tracking-wider">YOU OFFER ({sender.name})</span>
              <span className="text-xs text-gray-500">Cash: ${sender.money}</span>
            </div>

            {/* Cash Input */}
            <div>
              <label className="text-[11px] text-gray-500 font-semibold block mb-1">CASH OFFERED ($)</label>
              <input
                type="number"
                min={0}
                max={sender.money}
                value={offerMoney}
                onChange={e => setOfferMoney(Math.min(sender.money, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-gray-800 focus:outline-none focus:border-red-400"
              />
            </div>

            {/* Properties */}
            <div>
              <label className="text-[11px] text-gray-500 font-semibold block mb-2">PROPERTIES OFFERED</label>
              {senderTiles.length === 0 ? (
                <p className="text-gray-400 text-xs italic">No properties owned</p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {senderTiles.map(tile => {
                    const selected = offerProperties.includes(tile.id);
                    return (
                      <button
                        key={tile.id}
                        onClick={() => toggleOfferProp(tile.id)}
                        className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-all border ${
                          selected
                            ? 'bg-red-100 border-red-300 text-red-700'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {tile.color && <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: tile.color }} />}
                          <span className="truncate font-medium">{tile.name}</span>
                        </div>
                        {selected && <CheckCircle2 size={14} className="text-red-600 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* RECEIVER OFFERS (YOU REQUEST) */}
          <div className="space-y-4 pl-2">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <span className="font-bold text-xs text-orange-600 uppercase tracking-wider">YOU REQUEST ({receiver.name})</span>
              <span className="text-xs text-gray-500">Cash: ${receiver.money}</span>
            </div>

            {/* Cash Input */}
            <div>
              <label className="text-[11px] text-gray-500 font-semibold block mb-1">CASH REQUESTED ($)</label>
              <input
                type="number"
                min={0}
                max={receiver.money}
                value={requestMoney}
                onChange={e => setRequestMoney(Math.min(receiver.money, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-gray-800 focus:outline-none focus:border-orange-400"
              />
            </div>

            {/* Properties */}
            <div>
              <label className="text-[11px] text-gray-500 font-semibold block mb-2">PROPERTIES REQUESTED</label>
              {receiverTiles.length === 0 ? (
                <p className="text-gray-400 text-xs italic">No properties owned</p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {receiverTiles.map(tile => {
                    const selected = requestProperties.includes(tile.id);
                    return (
                      <button
                        key={tile.id}
                        onClick={() => toggleRequestProp(tile.id)}
                        className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-all border ${
                          selected
                            ? 'bg-orange-100 border-orange-300 text-orange-700'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {tile.color && <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: tile.color }} />}
                          <span className="truncate font-medium">{tile.name}</span>
                        </div>
                        {selected && <CheckCircle2 size={14} className="text-orange-600 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Offering <span className="text-red-700 font-bold">${offerMoney} + {offerProperties.length} prop</span> for <span className="text-orange-700 font-bold">${requestMoney} + {requestProperties.length} prop</span>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:text-gray-800 bg-gray-100 border border-gray-200 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSendTrade}
              disabled={!canSend || (offerMoney === 0 && offerProperties.length === 0 && requestMoney === 0 && requestProperties.length === 0)}
              className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-5 py-2 rounded-xl text-xs shadow-md disabled:opacity-40 transition-colors"
            >
              {isHotseat && !canSend ? 'Not Your Turn' : 'Send Offer'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}