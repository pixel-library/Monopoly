import { motion } from 'framer-motion';
import { Player } from '../types';
import { formatMoney, calculateNetWorth } from '../game/engine';
import Avatar from './Avatar';
import { Building2, Wallet, MapPin, Lock } from 'lucide-react';

interface PlayerPanelProps {
  player: Player;
  isCurrentPlayer?: boolean;
  compact?: boolean;
}

export default function PlayerPanel({ player, isCurrentPlayer, compact = false }: PlayerPanelProps) {
  const netWorth = calculateNetWorth(player);

  if (compact) {
    return (
      <motion.div
        className={`glass-panel p-3 flex items-center gap-3 transition-all ${
          isCurrentPlayer ? 'ring-2 ring-board-gold' : ''
        }`}
        animate={isCurrentPlayer ? { scale: [1, 1.02, 1] } : {}}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <Avatar player={player} size="sm" showToken />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{player.name}</p>
          <p className="text-board-gold text-sm font-semibold">{formatMoney(player.money)}</p>
        </div>
        {player.inJail && <Lock size={14} className="text-red-400" />}
        {player.bankrupt && <span className="text-xs text-red-400">BANKRUPT</span>}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`glass-panel p-4 ${isCurrentPlayer ? 'ring-2 ring-board-gold' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-4 mb-4">
        <Avatar player={player} size="lg" showToken />
        <div>
          <h3 className="font-semibold text-lg">{player.name}</h3>
          {isCurrentPlayer && (
            <span className="text-xs text-board-gold uppercase tracking-wider">Current Turn</span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Wallet size={16} className="text-board-gold" />
          <span className="text-white/60">Cash:</span>
          <span className="font-semibold text-board-gold">{formatMoney(player.money)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Building2 size={16} className="text-blue-400" />
          <span className="text-white/60">Properties:</span>
          <span className="font-semibold">{player.properties.length}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <MapPin size={16} className="text-green-400" />
          <span className="text-white/60">Net Worth:</span>
          <span className="font-semibold text-green-400">{formatMoney(netWorth)}</span>
        </div>

        {player.inJail && (
          <div className="flex items-center gap-2 text-sm text-red-400">
            <Lock size={16} />
            <span>In Jail (Turn {player.jailTurns + 1}/3)</span>
          </div>
        )}

        {player.getOutOfJailCards > 0 && (
          <div className="text-xs text-yellow-400">
            🃏 Get Out of Jail Free: {player.getOutOfJailCards}
          </div>
        )}
      </div>
    </motion.div>
  );
}
