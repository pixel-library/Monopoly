import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../state/gameStore';
import { socketService } from '../services/socketService';
import { BOARD_TILES } from '../data/boardData';
import { Player, BoardTile, TradeOffer } from '../types';
import { formatMoney, generateId } from '../game/engine';
import { X, ArrowRightLeft, DollarSign, CheckCircle2, RotateCcw } from 'lucide-react';

interface TradeDrawerProps {
  onClose: () => void;
  counterTrade?: TradeOffer | null;
}

export default function TradeDrawer({ onClose, counterTrade }: TradeDrawerProps) {
  const { players, currentPlayerIndex, setTradeModalOpen, roomCode, myPlayerId, counterTrade: counterTradeAction } = useGameStore();
  const socketRoomCode = socketService.getRoomCode();
  const isHotseat = !roomCode;
  const localPlayer = isHotseat ? players[currentPlayerIndex] : players.find(p => p.id === myPlayerId);
  const sender = localPlayer;
  const availablePartners = players.filter(p => p.id !== localPlayer?.id && !p.bankrupt);

  const [targetPlayerId, setTargetPlayerId] = useState<string>(availablePartners[0]?.id || '');
  const receiver = players.find(p => p.id === targetPlayerId);

  const [offerMoney, setOfferMoney] = useState(0);
  const [requestMoney, setRequestMoney] = useState(0);
  const [offerProperties, setOfferProperties] = useState<number[]>([]);
  const [requestProperties, setRequestProperties] = useState<number[]>([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (counterTrade && counterTrade.status === 'pending') {
      // For a counter offer, we swap the roles.
      // What the original sender requested is now what we (the new sender) offer.
      setOfferMoney(counterTrade.requestedMoney);
      setOfferProperties(counterTrade.requestedProperties);
      
      // What the original sender offered is now what we (the new sender) request.
      setRequestMoney(counterTrade.offeredMoney);
      setRequestProperties(counterTrade.offeredProperties);
      
      // The target player is the original sender.
      setTargetPlayerId(counterTrade.fromPlayerId);
    }
  }, [counterTrade?.id, counterTrade?.status]);

  const toggleOfferProp = (id: number) => {
    setOfferProperties(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const toggleRequestProp = (id: number) => {
    setRequestProperties(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const handleSendTrade = () => {
    if (!sender || !receiver || processing) return;

    const tradeData = {
      fromPlayerId: sender.id,
      toPlayerId: receiver.id,
      offeredMoney: offerMoney,
      offeredPropertyIds: offerProperties,
      requestedMoney: requestMoney,
      requestedPropertyIds: requestProperties,
    };

    const effectiveRoomCode = roomCode || socketRoomCode;
    if (counterTrade && counterTrade.status === 'pending') {
      setProcessing(true);
      if (effectiveRoomCode) {
        socketService.counterTrade(effectiveRoomCode, counterTrade.id, tradeData);
      } else {
        counterTradeAction(counterTrade.id, tradeData);
      }
      setProcessing(false);
      onClose();
      return;
    }

    setProcessing(true);
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
        revision: 1,
      });
    }
    setProcessing(false);
    onClose();
  };

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

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="text-red-600" size={20} />
            <h2 className="font-extrabold text-base tracking-wide text-gray-800">
              {counterTrade ? 'Counter Offer' : 'Propose Trade Deal'}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 grid grid-cols-2 divide-x divide-gray-200 overflow-y-auto p-4 gap-4 scrollbar-thin">
          <div className="space-y-4 pr-2">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <span className="font-bold text-xs text-red-700 uppercase tracking-wider">YOU OFFER ({sender.name})</span>
              <span className="text-xs text-gray-500">Cash: ${sender.money}</span>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold block mb-1">Money</label>
              <input
                type="number"
                value={offerMoney}
                onChange={(e) => setOfferMoney(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-400"
                min={0}
                max={sender.money}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold block mb-1">Properties</label>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {senderTiles.map(tile => (
                  <button
                    key={tile.id}
                    onClick={() => toggleOfferProp(tile.id)}
                    className={`w-full text-left p-2 rounded-lg text-sm transition-colors border ${
                      offerProperties.includes(tile.id)
                        ? 'bg-red-50 border-red-200 text-red-700'
                        : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                    }`}
                  >
                    {tile.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 pl-2">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <span className="font-bold text-xs text-blue-700 uppercase tracking-wider">YOU REQUEST ({receiver.name})</span>
              <span className="text-xs text-gray-500">Cash: ${receiver.money}</span>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold block mb-1">Money</label>
              <input
                type="number"
                value={requestMoney}
                onChange={(e) => setRequestMoney(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                min={0}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold block mb-1">Properties</label>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {receiverTiles.map(tile => (
                  <button
                    key={tile.id}
                    onClick={() => toggleRequestProp(tile.id)}
                    className={`w-full text-left p-2 rounded-lg text-sm transition-colors border ${
                      requestProperties.includes(tile.id)
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                    }`}
                  >
                    {tile.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleSendTrade}
            disabled={processing}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-md disabled:opacity-50"
          >
            {counterTrade ? 'Send Counter Offer' : 'Propose Trade'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}