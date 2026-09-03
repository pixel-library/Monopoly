import React from 'react';
import { GRID_POSITIONS } from '../../data/boardSpaces';
import { Player, BoardTile, DiceResult, GameLog } from '../../types';
import { BOARD_TILES } from '../../data/boardData';
import { useGameStore } from '../../state/gameStore';
import { PropertySpace } from './PropertySpace';
import { SpecialSpace } from './SpecialSpace';
import { CornerSpace } from './CornerSpace';
import { BoardCenter } from './BoardCenter';
import { PlayerToken } from './PlayerToken';
import '../../styles/monopoly-board.css';

interface MonopolyBoardProps {
  players: Player[];
  onTileClick?: (tile: BoardTile) => void;
  dice: DiceResult | null;
  rolling: boolean;
  onRoll?: () => void;
  canRoll: boolean;
  showRollAgain: boolean;
  messages?: GameLog[];
}

const GRID_SIZE = 11;

export const MonopolyBoard: React.FC<MonopolyBoardProps> = ({
  players,
  onTileClick,
  dice,
  rolling,
  onRoll,
  canRoll,
  showRollAgain,
  messages = [],
}) => {
  const { mortgagedProperties } = useGameStore.getState();
  const currentPlayer = players.find(p => p.isCurrentPlayer);
  const spaces = BOARD_TILES.map((tile) => {
    const gridPos = GRID_POSITIONS[tile.position];
    if (!gridPos) return null;

    const isCorner = gridPos.special === 'corner';
    const side = gridPos.side;

    const handleClick = () => {
      if (onTileClick) onTileClick(tile);
    };

    let content: React.ReactNode;

    if (isCorner) {
      content = <CornerSpace space={tile} onClick={handleClick} />;
    } else if (tile.type === 'PROPERTY' || tile.type === 'RAILROAD' || tile.type === 'UTILITY') {
      const owner = players.find((p) => p.properties.includes(tile.id));
      content = (
        <PropertySpace
          space={tile}
          side={side}
          player={owner}
          mortgagedProperties={mortgagedProperties}
          currentPlayerId={currentPlayer?.id}
          onTileClick={onTileClick || (() => {})}
          onClick={handleClick}
        />
      );
    } else {
      content = <SpecialSpace space={tile} side={side} onClick={handleClick} />;
    }

    return (
      <div
        key={`space-${tile.position}`}
        className="space-wrapper"
        style={{
          gridColumn: gridPos.col + 1,
          gridRow: gridPos.row + 1,
        }}
      >
        {content}
      </div>
    );
  });

  return (
    <div className="monopoly-board-container">
      <div className="monopoly-board" data-board-root>
        {spaces}
        <BoardCenter
          dice={dice}
          rolling={rolling}
          onRoll={onRoll}
          canRoll={canRoll}
          showRollAgain={showRollAgain}
          messages={messages}
        />
        <div className="token-layer">
          {players
            .filter((p) => !p.bankrupt)
            .reduce((acc, player) => {
              const pos = GRID_POSITIONS[player.position];
              if (!pos) return acc;
              const existing = acc.find((item) => item.position.top === pos.row && item.position.left === pos.col);
              if (existing) {
                const idx = acc.indexOf(existing);
                acc[idx] = { ...existing, count: existing.count + 1 };
              } else {
                acc.push({
                  id: `token-${player.id}`,
                  player,
                  position: {
                    top: ((pos.row + 0.5) / GRID_SIZE) * 100,
                    left: ((pos.col + 0.5) / GRID_SIZE) * 100,
                  },
                  count: 0,
                });
              }
              return acc;
            }, [] as Array<{ id: string; player: Player; position: { top: number; left: number }; count: number }>)
            .map((item) => (
              <PlayerToken
                key={item.id}
                player={item.player}
                position={item.position}
                offsetIndex={item.count}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default MonopolyBoard;
