import { useState } from 'react';
import { useGameStore } from '../state/gameStore';
import { generateId, formatMoney } from '../game/engine';
import { socketService } from '../services/socketService';
import Modal from './Modal';
import Avatar from './Avatar';
import { ArrowRight, Check, X, Clock } from 'lucide-react';

export default function TradeModal() {
  const { players, currentPlayerIndex, trade, setTrade, proposeTrade, acceptTrade, rejectTrade, waitTrade, cancelTrade } = useGameStore();
  const roomCode = socketService.getRoomCode();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [offeredMoney, setOfferedMoney] = useState(0);
  const [requestedMoney, setRequestedMoney] = useState(0);
  const [offeredProperties, setOfferedProperties] = useState<number[]>([]);
  const [requestedProperties, setRequestedProperties] = useState<number[]>([]);
  const [processing, setProcessing] = useState(false);

  const currentPlayer = players[currentPlayerIndex];
  const otherPlayers = players.filter(p => p.id !== currentPlayer?.id);

  const handleProposeTrade = () => {
    if (!currentPlayer || !selectedPlayerId || processing) return;

    const tradeData = {
      fromPlayerId: currentPlayer.id,
      toPlayerId: selectedPlayerId,
      offeredMoney,
      offeredPropertyIds: offeredProperties,
      requestedMoney,
      requestedPropertyIds: requestedProperties,
    };

    setProcessing(true);
    if (roomCode) {
      socketService.proposeTrade(roomCode, tradeData);
    } else {
      proposeTrade({
        id: generateId(),
        ...tradeData,
        offeredProperties,
        requestedProperties,
        status: 'pending',
        createdAt: Date.now(),
      });
    }
    setProcessing(false);
    setTrade(null);
  };

  const toggleOfferedProperty = (propId: number) => {
    setOfferedProperties(prev =>
      prev.includes(propId) ? prev.filter(id => id !== propId) : [...prev, propId]
    );
  };

  const toggleRequestedProperty = (propId: number) => {
    setRequestedProperties(prev =>
      prev.includes(propId) ? prev.filter(id => id !== propId) : [...prev, propId]
    );
  };

  if (trade?.status === 'pending') {
    const fromPlayer = players.find(p => p.id === trade.fromPlayerId);
    const toPlayer = players.find(p => p.id === trade.toPlayerId);
    const isRecipient = currentPlayer?.id === trade.toPlayerId;
    const isSender = currentPlayer?.id === trade.fromPlayerId;

    return (
      <Modal isOpen={true} onClose={() => setTrade(null)} title="Trade Offer">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Avatar player={fromPlayer!} size="sm" />
                <span className="font-medium">{fromPlayer?.name}</span>
                {isSender && <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.25 rounded font-bold">YOU</span>}
              </div>
              <p className="text-sm text-board-gold">{formatMoney(trade.offeredMoney)}</p>
              {trade.offeredProperties.map(propId => {
                const tile = useGameStore.getState().board.find(t => t.id === propId);
                return tile ? <p key={propId} className="text-sm">{tile.name}</p> : null;
              })}
            </div>

            <div className="bg-white/5 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Avatar player={toPlayer!} size="sm" />
                <span className="font-medium">{toPlayer?.name}</span>
                {isRecipient && <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.25 rounded font-bold">YOU</span>}
              </div>
              <p className="text-sm text-board-gold">{formatMoney(trade.requestedMoney)}</p>
              {trade.requestedProperties.map(propId => {
                const tile = useGameStore.getState().board.find(t => t.id === propId);
                return tile ? <p key={propId} className="text-sm">{tile.name}</p> : null;
              })}
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowRight size={24} className="text-white/40" />
          </div>

          {isRecipient && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (processing) return;
                  setProcessing(true);
                  if (roomCode) {
                     socketService.tradeResponse(roomCode, true);
                  } else {
                    acceptTrade();
                  }
                  setProcessing(false);
                }}
                disabled={processing}
                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Check size={16} />
                Accept
              </button>
              <button
                onClick={() => {
                  if (processing) return;
                  setProcessing(true);
                  if (roomCode) {
                     socketService.tradeResponse(roomCode, false);
                  } else {
                    rejectTrade();
                  }
                  setProcessing(false);
                }}
                disabled={processing}
                className="btn-danger flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <X size={16} />
                Reject
              </button>
              <button
                onClick={() => {
                  if (processing) return;
                  setProcessing(true);
                  waitTrade();
                  setProcessing(false);
                }}
                disabled={processing}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-bold text-sm transition-all disabled:opacity-50"
              >
                <Clock size={16} />
                Wait
              </button>
            </div>
          )}

          {isSender && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (processing) return;
                  setProcessing(true);
                  cancelTrade();
                  setProcessing(false);
                }}
                disabled={processing}
                className="btn-danger flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                onClick={() => setTrade(null)}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-bold text-sm transition-all"
              >
                Close
              </button>
            </div>
          )}

          {!isRecipient && !isSender && (
            <p className="text-center text-white/60 text-sm">Waiting for response...</p>
          )}
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={true} onClose={() => setTrade(null)} title="Propose Trade">
      <div className="space-y-4">
        <div>
          <p className="text-sm text-white/60 mb-2">Trade with:</p>
          <div className="grid grid-cols-2 gap-2">
            {otherPlayers.map(player => (
              <button
                key={player.id}
                onClick={() => setSelectedPlayerId(player.id)}
                className={`p-2 rounded-lg flex items-center gap-2 transition-colors ${
                  selectedPlayerId === player.id
                    ? 'bg-board-gold/20 border border-board-gold'
                    : 'bg-white/5 border border-transparent hover:bg-white/10'
                }`}
              >
                <Avatar player={player} size="sm" />
                <span className="text-sm truncate">{player.name}</span>
              </button>
            ))}
          </div>
        </div>

        {selectedPlayerId && (
          <>
            <div className="bg-white/5 p-3 rounded-lg">
              <p className="text-sm font-medium mb-2">You offer:</p>
              <input
                type="number"
                value={offeredMoney}
                onChange={(e) => setOfferedMoney(Number(e.target.value))}
                placeholder="Money"
                className="input-field mb-2"
                min={0}
              />
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {currentPlayer?.properties.map(propId => {
                  const tile = useGameStore.getState().board.find(t => t.id === propId);
                  if (!tile) return null;
                  return (
                    <button
                      key={propId}
                      onClick={() => toggleOfferedProperty(propId)}
                      className={`w-full text-left p-2 rounded text-sm transition-colors ${
                        offeredProperties.includes(propId)
                          ? 'bg-board-gold/20 text-board-gold'
                          : 'hover:bg-white/10'
                      }`}
                    >
                      {tile.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white/5 p-3 rounded-lg">
              <p className="text-sm font-medium mb-2">You request:</p>
              <input
                type="number"
                value={requestedMoney}
                onChange={(e) => setRequestedMoney(Number(e.target.value))}
                placeholder="Money"
                className="input-field mb-2"
                min={0}
              />
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {players.find(p => p.id === selectedPlayerId)?.properties.map(propId => {
                  const tile = useGameStore.getState().board.find(t => t.id === propId);
                  if (!tile) return null;
                  return (
                    <button
                      key={propId}
                      onClick={() => toggleRequestedProperty(propId)}
                      className={`w-full text-left p-2 rounded text-sm transition-colors ${
                        requestedProperties.includes(propId)
                          ? 'bg-board-gold/20 text-board-gold'
                          : 'hover:bg-white/10'
                      }`}
                    >
                      {tile.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleProposeTrade}
              disabled={processing || (offeredMoney === 0 && offeredProperties.length === 0 && requestedMoney === 0 && requestedProperties.length === 0)}
              className="btn-primary w-full disabled:opacity-40"
            >
              {processing ? 'Sending...' : 'Propose Trade'}
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}
