import { Player, BoardTile } from '../types';
import { useGameStore } from '../state/gameStore';
import { socketService } from '../services/socketService';
import { COUNTRIES } from '../data/boardData';
import { X, Hammer, TrendingUp } from 'lucide-react';

interface BuildPanelProps {
  currentPlayer: Player;
  board: BoardTile[];
  onClose: () => void;
}

export default function BuildPanel({ currentPlayer, board, onClose }: BuildPanelProps) {
  const { buyHouse, buyHotel, sellHouses, bankHouses, bankHotels } = useGameStore();
  const roomCode = socketService.getRoomCode();

  const ownedGroups = COUNTRIES.filter(c => {
    const countryTiles = board.filter(t => t.country === c.id);
    return countryTiles.length > 0 && countryTiles.every(t => currentPlayer.properties.includes(t.id));
  });

  const handleBuyHouse = (tileId: number) => {
    if (roomCode) {
      socketService.buyHouse(roomCode, currentPlayer.id, tileId);
    } else {
      buyHouse(currentPlayer.id, tileId);
    }
  };

   const handleBuyHotel = (tileId: number) => {
    if (roomCode) {
      socketService.buyHotel(roomCode, currentPlayer.id, tileId);
    } else {
      buyHotel(currentPlayer.id, tileId);
    }
  };

  const handleSellHouse = (tileId: number) => {
    if (roomCode) {
      socketService.sellHouses(roomCode, currentPlayer.id, tileId);
    } else {
      sellHouses(currentPlayer.id, tileId);
    }
  };

  return (
    <div className="h-full flex flex-col p-3 text-gray-800 overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <h3 className="font-bold text-sm flex items-center gap-1.5 text-red-700">
          <Hammer size={16} /> Construction
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-3 space-y-4 scrollbar-thin">
        {ownedGroups.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-xs">
            <p className="mb-2">No complete country sets owned.</p>
            <p>Monopolize all properties of a single country to unlock building!</p>
          </div>
        ) : (
          ownedGroups.map((group) => {
            const groupTiles = board.filter(t => t.country === group.id);
            return (
              <div key={group.id} className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: group.color }} />
                  <span className="font-bold text-xs text-gray-800">{group.name} Set</span>
                </div>

                <div className="space-y-2">
                  {groupTiles.map((tile) => {
                    const building = currentPlayer.buildings.find(b => b.propertyId === tile.id);
                    const houses = building?.houses || 0;
                    const isHotel = building?.hotel || false;
                    const houseCost = tile.houseCost || 0;

                    return (
                      <div key={tile.id} className="bg-white p-2 rounded-lg border border-gray-200 flex items-center justify-between text-xs">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-800 truncate">{tile.name}</p>
                          <p className="text-[10px] text-gray-500">
                            {isHotel ? '🏨 Hotel' : houses > 0 ? `🏠 ${houses} house(s)` : 'No buildings'}
                          </p>
                        </div>

                        <div className="flex gap-1 ml-2">
                          {!isHotel && houses < 4 && (
                            <button
                              onClick={() => handleBuyHouse(tile.id)}
                              disabled={currentPlayer.money < houseCost || bankHouses <= 0}
                              className="bg-red-100 text-red-700 hover:bg-red-200 px-2 py-1 rounded text-[10px] font-bold border border-red-200 disabled:opacity-30 transition-colors"
                            >
                              +House (${houseCost})
                            </button>
                          )}

                            {!isHotel && houses === 4 && (
                              <button
                                onClick={() => handleBuyHotel(tile.id)}
                                disabled={currentPlayer.money < houseCost || bankHotels <= 0}
                                className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-2 py-1 rounded text-[10px] font-bold border border-purple-200 disabled:opacity-30 transition-colors"
                              >
                                +Hotel (${houseCost})
                              </button>
                            )}

                            {(isHotel || houses > 0) && (
                              <button
                                onClick={() => handleSellHouse(tile.id)}
                                className="bg-amber-100 text-amber-700 hover:bg-amber-200 px-2 py-1 rounded text-[10px] font-bold border border-amber-200 transition-colors"
                              >
                                <TrendingUp size={10} />
                                {isHotel ? 'Sell 🏨' : `Sell 🏠`}
                              </button>
                            )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
