import { BoardTile, Player } from '../types';
import { useGameStore } from '../state/gameStore';
import Modal from './Modal';
import { formatMoney } from '../game/engine';
import { X, Home, Hotel } from 'lucide-react';

interface PropertyModalProps {
  tile: BoardTile;
  onClose: () => void;
}

export default function PropertyModal({ tile, onClose }: PropertyModalProps) {
  const { players, currentPlayerIndex, buyHouse, buyHotel } = useGameStore();
  const currentPlayer = players[currentPlayerIndex];

  const owner = players.find(p => p.properties.includes(tile.id));
  const isOwned = !!owner;
  const isOwnedByCurrentPlayer = owner?.id === currentPlayer?.id;

  const handleBuyHouse = () => {
    if (currentPlayer) {
      buyHouse(currentPlayer.id, tile.id);
    }
  };

  const handleBuyHotel = () => {
    if (currentPlayer) {
      buyHotel(currentPlayer.id, tile.id);
    }
  };

  const getRentDisplay = () => {
    if (typeof tile.rent === 'object' && 'base' in tile.rent) {
      return (
        <div className="space-y-1 text-sm">
          <p>Base Rent: <span className="text-board-gold">${tile.rent.base}</span></p>
          <p>With 1 House: <span className="text-board-gold">${tile.rent.oneHouse}</span></p>
          <p>With 2 Houses: <span className="text-board-gold">${tile.rent.twoHouses}</span></p>
          <p>With 3 Houses: <span className="text-board-gold">${tile.rent.threeHouses}</span></p>
          <p>With 4 Houses: <span className="text-board-gold">${tile.rent.fourHouses}</span></p>
          <p>With Hotel: <span className="text-board-gold">${tile.rent.hotel}</span></p>
        </div>
      );
    }
    return <p className="text-board-gold">${tile.rent}</p>;
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={tile.name}>
      <div className="space-y-4">
        {/* Color bar */}
        {tile.color && (
          <div
            className="h-4 rounded-lg"
            style={{ backgroundColor: tile.color }}
          />
        )}

        {/* Price */}
        {tile.price && (
          <div className="flex justify-between items-center">
            <span className="text-white/60">Price:</span>
            <span className="text-xl font-bold text-board-gold">{formatMoney(tile.price)}</span>
          </div>
        )}

        {/* Rent info */}
        {tile.rent && (
          <div className="bg-white/5 p-3 rounded-lg">
            <p className="text-white/60 text-sm mb-2">Rent:</p>
            {getRentDisplay()}
          </div>
        )}

        {/* House cost */}
        {tile.houseCost && (
          <div className="flex justify-between text-sm">
            <span className="text-white/60">House Cost:</span>
            <span>{formatMoney(tile.houseCost)}</span>
          </div>
        )}

        {/* Mortgage value */}
        {tile.mortgageValue && (
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Mortgage Value:</span>
            <span>{formatMoney(tile.mortgageValue)}</span>
          </div>
        )}

        {/* Owner info */}
        {isOwned && (
          <div className="bg-white/5 p-3 rounded-lg">
            <p className="text-white/60 text-sm">Owner:</p>
            <p className="font-semibold">{owner?.name}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          {isOwnedByCurrentPlayer && tile.houseCost && (
            <>
              <button
                onClick={handleBuyHouse}
                className="btn-secondary flex-1 flex items-center justify-center gap-2"
              >
                <Home size={16} />
                Buy House
              </button>
              <button
                onClick={handleBuyHotel}
                className="btn-secondary flex-1 flex items-center justify-center gap-2"
              >
                <Hotel size={16} />
                Buy Hotel
              </button>
            </>
          )}

          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
