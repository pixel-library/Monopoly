import { motion } from 'framer-motion';
import { BoardTile, Player } from '../types';
import { formatMoney, ownsCompleteGroup, canBuyHouse, canBuyHotel } from '../game/engine';
import { X, Building, Home, Hammer, TrendingUp } from 'lucide-react';
import { useGameStore } from '../state/gameStore';
import { socketService } from '../services/socketService';

interface PropertyDrawerProps {
  tile: BoardTile;
  players: Player[];
  onClose: () => void;
  onTrade?: () => void;
  onBuild?: () => void;
  currentPlayer: Player;
  roomCode?: string | null;
}

const COLOR_GROUP_LABELS: Record<string, string> = {
  brown: 'Brown',
  lightblue: 'Light Blue',
  pink: 'Pink',
  orange: 'Orange',
  red: 'Red',
  yellow: 'Yellow',
  green: 'Green',
  darkblue: 'Dark Blue',
};

export default function PropertyDrawer({ tile, players, onClose, onTrade, onBuild, currentPlayer, roomCode }: PropertyDrawerProps) {
  const { mortgagedProperties, mortgageProperty, unmortgageProperty, sellHouses, bankHouses, bankHotels, buyHouse, buyHotel } = useGameStore();
  const owner = players.find(p => p.properties.includes(tile.id));
  const isMortgaged = mortgagedProperties.includes(tile.id);
  const isOwner = owner?.id === currentPlayer?.id;

  const rentObj = typeof tile.rent === 'object' ? tile.rent : null;
  const hasGroup = ownsCompleteGroup(currentPlayer, tile);
  const groupLabel = tile.countryName || (tile.colorGroup ? COLOR_GROUP_LABELS[tile.colorGroup] || tile.colorGroup : '');
  const building = isOwner ? currentPlayer.buildings.find(b => b.propertyId === tile.id) : null;
  const currentHouses = building?.houses || 0;
  const hasHotel = building?.hotel || false;
  const canBuildHouse = isOwner && !hasHotel && currentHouses < 4 && canBuyHouse(currentPlayer, tile, mortgagedProperties);
  const canBuildHotel = isOwner && !hasHotel && currentHouses === 4 && canBuyHotel(currentPlayer, tile, mortgagedProperties);

  const handleBuyHouse = () => {
    if (roomCode) {
      socketService.buyHouse(roomCode, tile.id);
    } else {
      buyHouse(currentPlayer.id, tile.id);
    }
  };

  const handleBuyHotel = () => {
    if (roomCode) {
      socketService.buyHotel(roomCode, tile.id);
    } else {
      buyHotel(currentPlayer.id, tile.id);
    }
  };

  const handleMortgage = () => {
    if (roomCode) {
      socketService.mortgageProperty(roomCode, tile.id);
    } else {
      mortgageProperty(currentPlayer.id, tile.id);
    }
  };

  const handleUnmortgage = () => {
    if (roomCode) {
      socketService.unmortgageProperty(roomCode, tile.id);
    } else {
      unmortgageProperty(currentPlayer.id, tile.id);
    }
  };

  const handleSellHouse = () => {
    if (roomCode) {
      socketService.sellHouses(roomCode, tile.id);
    } else {
      sellHouses(currentPlayer.id, tile.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed inset-x-0 bottom-0 z-40 max-w-lg mx-auto bg-white border-t border-x border-gray-200 rounded-t-2xl p-4 shadow-xl text-gray-800"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          {tile.color && (
            <div className="w-4 h-4 rounded-md" style={{ background: tile.color }} />
          )}
          <div>
            <h3 className="font-extrabold text-sm tracking-wide text-gray-800">{tile.name}</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">{tile.type}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
          <X size={16} />
        </button>
      </div>

      {/* Details */}
      <div className="space-y-3">
        {/* Ownership banner */}
        <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200 flex items-center justify-between">
          <span className="text-[10px] text-gray-500 font-semibold">OWNER</span>
          {owner ? (
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-red-700">{owner.name}</span>
              {isOwner && <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.25 rounded font-bold">YOU</span>}
            </div>
          ) : (
            <span className="text-xs font-bold text-red-700">UNOWNED (${tile.price || 0})</span>
          )}
        </div>

        {/* Rent Schedule */}
        {rentObj && (
          <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200 space-y-1 text-[10px]">
            <div className="flex justify-between text-gray-500 pb-0.5 border-b border-gray-300">
              <span>Base Rent</span>
              <span className="font-mono text-gray-800">${rentObj.base}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>1 House</span>
              <span className="font-mono text-gray-800">${rentObj.oneHouse}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>2 Houses</span>
              <span className="font-mono text-gray-800">${rentObj.twoHouses}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>3 Houses</span>
              <span className="font-mono text-gray-800">${rentObj.threeHouses}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>4 Houses</span>
              <span className="font-mono text-gray-800">${rentObj.fourHouses}</span>
            </div>
            <div className="flex justify-between text-red-700 font-bold pt-0.5 border-t border-gray-300">
              <span>Hotel</span>
              <span className="font-mono">${rentObj.hotel}</span>
            </div>
          </div>
        )}

        {/* Financial Info */}
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          {tile.houseCost && (
            <div className="bg-gray-50 p-2 rounded-xl border border-gray-200">
              <p className="text-gray-500 font-semibold mb-0.5">House Cost</p>
              <p className="font-mono font-bold text-gray-800">${tile.houseCost}</p>
            </div>
          )}
          {tile.mortgageValue && (
            <div className="bg-gray-50 p-2 rounded-xl border border-gray-200">
              <p className="text-gray-500 font-semibold mb-0.5">Mortgage Value</p>
              <p className="font-mono font-bold text-gray-800">${tile.mortgageValue}</p>
            </div>
          )}
        </div>

        {/* Building section */}
        {tile.type === 'PROPERTY' && tile.houseCost && (
          <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200 text-[10px]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-gray-500 font-semibold">Construction</span>
              <div className="flex items-center gap-1">
                <span className="text-xs">🏠 {currentHouses}/4</span>
                {hasHotel && <span className="text-xs">🏨</span>}
                <span className="text-xs text-gray-400">| 🏦{bankHouses} 🏨{bankHotels}</span>
              </div>
            </div>

            {isOwner ? (
              hasGroup ? (
                <div className="space-y-1.5">
                  {!hasHotel && currentHouses < 4 && (
                    <button
                      onClick={handleBuyHouse}
                      disabled={!canBuildHouse || (currentPlayer.money < tile.houseCost!)}
                      className={`w-full flex items-center justify-center gap-1 py-1.5 rounded-lg font-bold text-xs transition-all ${
                        canBuildHouse && currentPlayer.money >= tile.houseCost!
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Home size={11} />
                      Build House (${tile.houseCost})
                    </button>
                  )}

                  {!hasHotel && currentHouses === 4 && (
                    <button
                      onClick={handleBuyHotel}
                      disabled={!canBuildHotel || (currentPlayer.money < tile.houseCost!)}
                      className={`w-full flex items-center justify-center gap-1 py-1.5 rounded-lg font-bold text-xs transition-all ${
                        canBuildHotel && currentPlayer.money >= tile.houseCost!
                          ? 'bg-purple-600 hover:bg-purple-700 text-white'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Building size={11} />
                      Build Hotel (${tile.houseCost})
                    </button>
                  )}

                  {(hasHotel || currentHouses > 0) && (
                    <button
                      onClick={handleSellHouse}
                      className="w-full flex items-center justify-center gap-1 py-1.5 rounded-lg font-bold text-xs bg-amber-600 hover:bg-amber-700 text-white transition-all"
                    >
                      <TrendingUp size={11} />
                      {hasHotel ? 'Sell Hotel' : 'Sell House'} (${Math.round(tile.houseCost! / 2)})
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-1.5">
                  <p className="text-xs text-gray-500">
                    Own the complete <span className="font-bold">{groupLabel}</span> group to build.
                  </p>
                </div>
              )
            ) : (
              <div className="text-xs text-gray-400 text-center py-1">
                Not the owner
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          {isOwner && tile.mortgageValue && (
            isMortgaged ? (
              <button
                onClick={handleUnmortgage}
                className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded-lg text-xs shadow-md transition-all"
              >
                Unmortgage (${Math.round(tile.mortgageValue * 1.1)})
              </button>
            ) : (
              <button
                onClick={handleMortgage}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 rounded-lg text-xs shadow-md transition-all"
              >
                Mortgage (${tile.mortgageValue})
              </button>
            )
          )}

          {!isOwner && owner && (
            <button
              onClick={() => { onTrade?.(); onClose(); }}
              className="flex-1 border border-gray-200 text-gray-700 font-semibold py-2 rounded-lg text-xs hover:bg-gray-50 transition-all"
            >
              Propose Trade
            </button>
          )}

          {isOwner && tile.type === 'PROPERTY' && tile.houseCost && onBuild && (
            <button
              onClick={() => { onBuild(); onClose(); }}
              className="flex-1 border border-gray-200 text-gray-700 font-semibold py-2 rounded-lg text-xs hover:bg-gray-50 transition-all"
            >
              <Hammer size={11} className="mr-1" />
              Build Panel
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
