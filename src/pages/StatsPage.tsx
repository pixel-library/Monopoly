import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Target, Star } from 'lucide-react';
import { useGameStore } from '../state/gameStore';
import { POWER_UP_DEFS } from '../state/gameStore';

export default function StatsPage() {
  const navigate = useNavigate();
  const { playerStats, achievements, powerUps, checkAchievements } = useGameStore();

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const activePowerUps = powerUps.filter(p => !p.used);

  return (
    <div className="min-h-screen bg-board-dark text-gray-100">
      <div className="max-w-4xl mx-auto p-4">
        <header className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-amber-400">Player Statistics</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="panel p-4"
          >
            <h3 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-1.5">
              <Trophy size={16} /> Overview
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Games Played</span>
                <span className="font-bold">{playerStats.gamesPlayed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Games Won</span>
                <span className="font-bold text-amber-400">{playerStats.gamesWon}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Win Rate</span>
                <span className="font-bold">
                  {playerStats.gamesPlayed > 0
                    ? `${Math.round((playerStats.gamesWon / playerStats.gamesPlayed) * 100)}%`
                    : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Total Money Earned</span>
                <span className="font-bold text-green-400">${formatNumber(playerStats.totalMoneyEarned)}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="panel p-4"
          >
            <h3 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-1.5">
              <Target size={16} /> Property Mastery
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Properties Bought</span>
                <span className="font-bold">{playerStats.propertiesPurchased}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Rent Collected</span>
                <span className="font-bold">${formatNumber(playerStats.rentCollected)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Houses Built</span>
                <span className="font-bold">{playerStats.housesBuilt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Hotels Built</span>
                <span className="font-bold">{playerStats.hotelsBuilt}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="panel p-4"
          >
            <h3 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-1.5">
              <Star size={16} /> Transactions
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Trades Made</span>
                <span className="font-bold">{playerStats.tradesMade}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Bankruptcies Caused</span>
                <span className="font-bold text-red-400">{playerStats.bankruptciesCaused}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Jail Cards Used</span>
                <span className="font-bold">{playerStats.jailFreeCardsUsed}</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="panel p-4"
          >
            <h3 className="text-sm font-bold text-amber-400 mb-3">
              Achievements ({unlockedAchievements.length}/{achievements.length})
            </h3>
            <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin">
              {unlockedAchievements.map(a => (
                <div key={a.id} className="flex items-center gap-2.5 p-2 bg-slate-900/30 rounded-lg">
                  <span className="text-xl">{a.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-amber-300">{a.title}</div>
                    <div className="text-xs text-gray-400">{a.description}</div>
                  </div>
                  <span className="text-xs text-amber-400">UNLOCKED</span>
                </div>
              ))}
              {lockedAchievements.map(a => (
                <div key={a.id} className="flex items-center gap-2.5 p-2 bg-slate-900/20 rounded-lg opacity-60">
                  <span className="text-xl grayscale">{a.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-500">{a.title}</div>
                    <div className="text-xs text-gray-500">{a.description}</div>
                  </div>
                  <LockIcon size={12} />
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="panel p-4"
          >
            <h3 className="text-sm font-bold text-amber-400 mb-3">
              Power-ups ({activePowerUps.length} active)
            </h3>
            {activePowerUps.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                <p>No power-ups collected yet.</p>
                <p className="mt-1 text-xs">Land on bonus spaces to collect them!</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin">
                {activePowerUps.map(p => {
                  const def = POWER_UP_DEFS[p.type];
                  return (
                    <div key={p.id} className="flex items-center gap-2.5 p-2 bg-slate-900/30 rounded-lg">
                      <span className="text-xl">{def.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-sm text-amber-300">{def.name}</div>
                        <div className="text-xs text-gray-400">{def.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>

        <button
          onClick={checkAchievements}
          className="mt-6 w-full py-2 text-xs text-gray-500 hover:text-gray-400 transition-colors"
        >
          Refresh achievements
        </button>
      </div>
    </div>
  );
}

const LockIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="5" y="11" width="14" height="11" rx="2" ry="2" />
    <path d="M12 11V7a4 4 0 0 0-8 0v4" />
    <path d="M1 11h22" />
  </svg>
);
