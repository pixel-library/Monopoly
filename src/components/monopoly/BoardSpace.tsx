import React from 'react';
import { BoardSpace as BoardSpaceType } from '../../data/boardSpaces';

interface BoardSpaceProps {
  space: BoardSpaceType;
  side: 'top' | 'right' | 'bottom' | 'left';
  isCorner: boolean;
  onClick?: (space: BoardSpaceType) => void;
}

export const BoardSpace: React.FC<BoardSpaceProps> = ({ space, side, isCorner, onClick }) => {
  const handleClick = () => {
    if (onClick) onClick(space);
  };

  return (
    <div
      className="board-cell"
      data-space-id={space.id}
      data-side={side}
      data-type={space.type}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`${space.name} at position ${space.id}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="cell-content">
        {/* Space content will be rendered by specialized components */}
      </div>
    </div>
  );
};
