import React from 'react';
import { Train, Zap, HelpCircle, Landmark } from 'lucide-react';
import { BoardTile } from '../../types';

interface SpecialSpaceProps {
  space: BoardTile;
  side: 'top' | 'right' | 'bottom' | 'left';
  onClick?: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  CHANCE: <HelpCircle className="special-icon-svg" />,
  COMMUNITY_CHEST: <Landmark className="special-icon-svg" />,
  RAILROAD: <Train className="special-icon-svg" />,
  UTILITY: <Zap className="special-icon-svg" />,
  TAX: <span className="special-icon-svg" style={{ fontSize: '1.5em', fontWeight: 'bold' }}>&#8353;</span>,
};

export const SpecialSpace: React.FC<SpecialSpaceProps> = ({ space, side, onClick }) => {
  const icon = iconMap[space.type] || null;

  return (
    <div
      className="special-cell"
      data-space-id={space.id}
      data-side={side}
      data-type={space.type}
      onClick={onClick ? () => onClick() : undefined}
      role="button"
      tabIndex={0}
      aria-label={`${space.name} (${space.type})`}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {icon && <div className="special-icon">{icon}</div>}
      <span className="special-name">{space.name}</span>
      {space.price && <span className="special-price">${space.price}</span>}
      {space.taxAmount && <span className="special-price">${space.taxAmount}</span>}
    </div>
  );
};