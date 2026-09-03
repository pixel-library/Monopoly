import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, RotateCcw, Home, Trophy, Sparkles } from 'lucide-react';
import { useGameStore } from '../state/gameStore';
import { formatMoney } from '../game/engine';

export default function VictoryPage() {
  const navigate = useNavigate();
  const { winner, players, resetGame } = useGameStore();

  const winningPlayer = winner || players.find(p => !p.bankrupt) || players[0];

  const handlePlayAgain = () => {
    resetGame();
    navigate('/lobby');
  };

  const handleHome = () => {
    resetGame();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(240,180,41,0.15) 0%, var(--color-surface-0) 70%)' }}>
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl relative z-10"
      >
        {/* Crown Icon */}
        <div className="inline-flex p-4 rounded-3xl bg-amber-500/20 border border-amber-500/30 text-amber-400 mb-6 shadow-xl">
          <Crown size={48} className="animate-bounce" />
        </div>

        <h1 className="heading-1 text-amber-400 mb-1">VICTORY!</h1>
        <p className="text-slate-400 text-sm mb-6">Monopoly Tycoon Supreme</p>

        {/* Winner Info Card */}
        {winningPlayer && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 mb-8">
            <h2 className="text-xl font-black text-white mb-1">{winningPlayer.name}</h2>
            <p className="text-xs text-amber-400 font-mono font-bold mb-3">Final Net Worth: {formatMoney(winningPlayer.money)}</p>
            <div className="flex justify-center gap-4 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
              <span>Properties: {winningPlayer.properties.length}</span>
              <span>Buildings: {winningPlayer.buildings.length}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button onClick={handlePlayAgain} className="btn btn-gold btn-xl w-full">
            <RotateCcw size={18} /> Play Again
          </button>
          <button
            onClick={() => navigate('/stats')}
            className="btn btn-surface btn-xl w-full"
          >
            <Trophy size={18} /> View Stats
          </button>
          <button onClick={handleHome} className="btn btn-surface btn-xl w-full">
            <Home size={18} /> Main Menu
          </button>
        </div>
      </motion.div>
    </div>
  );
}
