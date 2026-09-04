import React from 'react';
import { motion } from 'framer-motion';
import { Dices, ShoppingCart, Gavel, X, ArrowRightLeft, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';
import { useGameStore } from '../state/gameStore';
import { socketService } from '../services/socketService';
import { soundManager } from '../game/soundManager';
import { BOARD_TILES } from '../data/boardData';

interface ActionBarProps {
  roomCode?: string | null;
  onOpenTrade?: () => void;
  onOpenBuild?: () => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({ roomCode, onOpenTrade, onOpenBuild }) => {
  const { players, currentPlayerIndex, turnState, rollDiceAction, endTurn, buyProperty, declinePropertyPurchase, payDebt, declareBankruptcy } = useGameStore();

  const currentPlayer = players[currentPlayerIndex];
  if (!currentPlayer || currentPlayer.bankrupt) return null;

  const currentTile = BOARD_TILES[currentPlayer.position];
  const isUnownedProperty = currentTile && (currentTile.type === 'PROPERTY' || currentTile.type === 'RAILROAD' || currentTile.type === 'UTILITY') && currentTile.price && !players.some(p => p.properties.includes(currentTile.id));
  const debtAmount = turnState.debtAmount || 0;
  const creditor = turnState.creditorId ? (turnState.creditorId === 'BANK' ? 'the Bank' : players.find(p => p.id === turnState.creditorId)?.name) : null;

  const handleRoll = () => {
    soundManager.play('dice');
    if (roomCode) {
      socketService.rollDice(roomCode, currentPlayer.id);
    } else {
      rollDiceAction();
    }
  };

  const handleBuy = () => {
    soundManager.play('cash');
    if (roomCode && currentTile) {
      socketService.buyProperty(roomCode, currentPlayer.id, currentTile.id);
    } else if (currentTile) {
      buyProperty(currentPlayer.id, currentTile.id);
    }
  };

  const handleDecline = () => {
    soundManager.play('click');
    if (roomCode && currentTile) {
      socketService.declineProperty(roomCode, currentPlayer.id, currentTile.id);
    } else if (currentTile) {
      declinePropertyPurchase(currentPlayer.id, currentTile.id);
    }
  };

  const handleEndTurn = () => {
    soundManager.play('click');
    if (roomCode) {
      socketService.endTurn(roomCode);
    } else {
      endTurn();
    }
  };

  const handlePayDebt = () => {
    soundManager.play('cash');
    if (roomCode) {
      socketService.resolveDebt(roomCode, currentPlayer.id, 'pay');
    } else {
      payDebt();
    }
  };

  const handleBankruptcy = () => {
    if (roomCode) {
      socketService.declareBankruptcy(roomCode, currentPlayer.id);
    } else {
      declareBankruptcy(currentPlayer.id);
    }
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-950/90 border border-amber-500/30 backdrop-blur-lg px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-4 text-white"
    >
      {/* ROLL DICE BUTTON */}
      {!turnState.hasRolled && turnState.phase === 'ROLL' && (
        <button
          onClick={handleRoll}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
        >
          <Dices className="w-5 h-5" /> Roll Dice
        </button>
      )}

      {/* CAN ROLL AGAIN (doubles) */}
      {turnState.canRollAgain && currentPlayer && !currentPlayer.inJail && (
        <button
          onClick={handleRoll}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
        >
          <Dices className="w-5 h-5" />
          Roll Again
        </button>
      )}

      {/* BUY PROPERTY BUTTON */}
      {turnState.hasRolled && isUnownedProperty && turnState.phase === 'ACTION' && (
        <div className="flex items-center gap-2">
          <button
            onClick={handleBuy}
            disabled={currentPlayer.money < (currentTile?.price || 0)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <ShoppingCart className="w-4 h-4" /> Buy (${currentTile?.price})
          </button>
          <button
            onClick={handleDecline}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-4 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 text-sm transition-all active:scale-95"
          >
            <X className="w-4 h-4" /> Pass
          </button>
        </div>
      )}

      {/* DEBT PAYMENT */}
      {turnState.phase === 'DEBT' && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-xs">
                Pay {debtAmount > 0 ? `$${debtAmount}` : ''} to {creditor || 'creditor'}
              </span>
            </div>
            <button
              onClick={handlePayDebt}
              disabled={currentPlayer.money < debtAmount}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 text-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <TrendingUp className="w-4 h-4" />
              Pay
            </button>
            <button
              onClick={handleBankruptcy}
              className="bg-red-600/20 text-red-400 font-medium px-4 py-2 rounded-xl border border-red-500/30 flex items-center gap-1.5 text-sm transition-all active:scale-95"
            >
              Bankrupt
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>💡 Mortgage properties or sell houses to raise cash</span>
          </div>
        </div>
      )}

      {/* TRADE BUTTON */}
      {onOpenTrade && turnState.phase !== 'DEBT' && turnState.phase !== 'TAX_DECISION' && turnState.phase !== 'ROLL' && (
        <button
          onClick={() => {
            soundManager.play('click');
            onOpenTrade();
          }}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-4 py-2 rounded-xl border border-slate-700 flex items-center gap-2 text-sm transition-all active:scale-95"
        >
          <ArrowRightLeft className="w-4 h-4 text-indigo-400" /> Trade
        </button>
      )}

      {/* BUILD/MANAGE BUTTON (also available during DEBT to sell assets) */}
      {currentPlayer && (turnState.phase === 'ACTION' || turnState.phase === 'DEBT') && turnState.hasRolled && (
          <button
            onClick={() => {
              soundManager.play('click');
              onOpenBuild?.();
            }}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-4 py-2 rounded-xl border border-slate-700 flex items-center gap-2 text-sm transition-all active:scale-95"
          >
            <Gavel className="w-4 h-4 text-sky-400" /> Manage
          </button>
      )}

      {/* END TURN BUTTON */}
      {turnState.phase === 'ACTION' && (
        <button
          onClick={handleEndTurn}
          className="bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold px-5 py-2.5 rounded-xl border border-slate-700 flex items-center gap-2 transition-all active:scale-95"
        >
          <CheckCircle2 className="w-4 h-4" /> End Turn
        </button>
      )}

      {/* JAIL ESCAPE (rolled doubles in jail) */}
      {!turnState.hasRolled && currentPlayer.inJail && (
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span>Roll for doubles or pay $50</span>
        </div>
      )}
    </motion.div>
  );
};
