import React from 'react';
import { BoardTile, Player } from '../../types';
import { formatMoney } from '../../game/engine';
import { getCountryById } from '../../data/boardData';

const PLAYER_TOKEN_COLORS: Record<string, string> = {
  'token-red': '#e74c3c',
  'token-orange': '#FF8C00',
  'token-blue': '#3b82f6',
  'token-purple': '#a78bfa',
  'token-green': '#22c55e',
  'token-yellow': '#f59e0b',
};

interface PropertySpaceProps {
  space: BoardTile;
  side: 'top' | 'right' | 'bottom' | 'left';
  player?: Player;
  mortgagedProperties: number[];
  onTileClick: (tile: BoardTile) => void;
  currentPlayerId?: string;
  canBuy?: boolean;
  onClick?: () => void;
}

export const PropertySpace: React.FC<PropertySpaceProps> = ({
  space,
  side,
  player: owner,
  mortgagedProperties,
  currentPlayerId,
  onTileClick,
  onClick,
}) => {
  const isMortgaged = mortgagedProperties.includes(space.id);
  const ownerColor = owner ? (PLAYER_TOKEN_COLORS[owner.tokenId] || '#ffffff') : 'transparent';
  const isOwned = !!owner;
  const isCurrentPlayerOwner = owner?.id === currentPlayerId;
  const country = space.country ? getCountryById(space.country) : null;

  const handleClick = () => {
    onClick?.();
    onTileClick(space);
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
      aria-label={`${space.name} property, ${formatMoney(space.price || 0)}`}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {country && (
        <div className="country-flag-badge" aria-label={country.name}>
          <span className="country-flag-emoji">{country.flag}</span>
        </div>
      )}

      <div className={`cell-content ${isMortgaged ? 'mortgaged' : ''}`}>
        <span className="property-name">
          {space.name}
        </span>
        <span className="property-price">${space.price}</span>
      </div>

      {isOwned && (
        <div
          className="owner-indicator"
          style={{ backgroundColor: ownerColor }}
        />
      )}

      {isMortgaged && (
        <div className="mortgage-overlay">
          <span className="mortgage-text">MORTGAGED</span>
        </div>
      )}

      {owner && !isMortgaged && (() => {
        const building = owner.buildings.find(b => b.propertyId === space.id);
        if (!building) return null;
        return (
          <div className="building-indicator">
            {building.hotel ? (
              <span>🏨</span>
            ) : (
              Array.from({ length: building.houses }).map((_, i) => (
                <span key={i}>🏠</span>
              ))
            )}
          </div>
        );
      })()}
    </div>
  );
};

export default PropertySpace;
