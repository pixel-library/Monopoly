import { useGameStore } from '../../state/gameStore';
import { POWER_UP_DEFS } from '../../state/gameStore';
import { Zap, X } from 'lucide-react';

export default function PowerUpsPanel() {
  const { powerUps, usePowerUp } = useGameStore();

  const activePowerUps = powerUps.filter(p => !p.used);

  return (
    <div className="h-full flex flex-col p-3 text-gray-800 overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <h3 className="font-bold text-sm flex items-center gap-1.5 text-amber-700">
          <Zap size={16} /> Power-ups
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto py-3">
        {activePowerUps.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-xs">
            <p className="mb-2">No active power-ups.</p>
            <p>Land on Free Parking or GO to collect them!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {activePowerUps.map(p => {
              const def = POWER_UP_DEFS[p.type];
              return (
                <div
                  key={p.id}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{def.icon}</span>
                    <div>
                      <div className="font-medium text-xs text-gray-800">{def.name}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{def.description}</div>
                      <div className="text-[9px] text-gray-400 mt-1">
                        Collected {new Date(p.collectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => usePowerUp(p.id)}
                    className="text-xs px-2 py-1 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded border border-amber-200 transition-colors font-bold"
                    title={`Use ${def.name}`}
                  >
                    Use
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
