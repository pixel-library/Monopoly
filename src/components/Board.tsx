import { Player, BoardTile } from '../types';
import { BOARD_TILES } from '../data/boardData';
import BoardTileComponent from './BoardTile';

interface BoardProps {
  players: Player[];
  onTileClick: (tile: BoardTile) => void;
}

export default function BoardComponent({ players, onTileClick }: BoardProps) {
  // Board layout: 40 tiles arranged in a square
  // Bottom row: positions 0-10 (right to left)
  // Left column: positions 10-20 (bottom to top)
  // Top row: positions 20-30 (left to right)
  // Right column: positions 30-40 (top to bottom)

  const bottomRow = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]; // positions 0-10 reversed for display
  const leftColumn = [11, 12, 13, 14, 15, 16, 17, 18, 19]; // positions 11-19
  const topRow = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]; // positions 20-30
  const rightColumn = [39, 38, 37, 36, 35, 34, 33, 32, 31]; // positions 31-39 reversed

  const getTile = (position: number) => BOARD_TILES[position];

  return (
    <div className="relative">
      {/* Board container */}
      <div className="grid grid-cols-11 gap-0 border-4 border-black bg-board-dark shadow-2xl">
        {/* Top row */}
        {topRow.map((pos) => (
          <BoardTileComponent
            key={`top-${pos}`}
            tile={getTile(pos)}
            players={players}
            onClick={() => onTileClick(getTile(pos))}
            position={pos === 20 || pos === 30 ? 'corner' : 'top'}
          />
        ))}

        {/* Middle section - left column + center + right column */}
        {Array.from({ length: 9 }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="contents">
            {/* Left column tile */}
            <BoardTileComponent
              key={`left-${leftColumn[rowIndex]}`}
              tile={getTile(leftColumn[rowIndex])}
              players={players}
              onClick={() => onTileClick(getTile(leftColumn[rowIndex]))}
              position="left"
            />

            {/* Center area */}
            <div className="col-span-9 bg-board-green border-2 border-black/50 min-h-[200px] md:min-h-[300px] flex items-center justify-center relative overflow-hidden">
              {rowIndex === 4 && (
                <div className="text-center">
                  <h2 className="text-3xl md:text-5xl font-display font-bold text-board-gold opacity-30 select-none">
                    ESTATE EMPIRE
                  </h2>
                </div>
              )}
            </div>

            {/* Right column tile */}
            <BoardTileComponent
              key={`right-${rightColumn[rowIndex]}`}
              tile={getTile(rightColumn[rowIndex])}
              players={players}
              onClick={() => onTileClick(getTile(rightColumn[rowIndex]))}
              position="right"
            />
          </div>
        ))}

        {/* Bottom row */}
        {bottomRow.map((pos) => (
          <BoardTileComponent
            key={`bottom-${pos}`}
            tile={getTile(pos)}
            players={players}
            onClick={() => onTileClick(getTile(pos))}
            position={pos === 10 || pos === 0 ? 'corner' : 'bottom'}
          />
        ))}
      </div>
    </div>
  );
}
