import React from 'react';
import { BoardTile } from '../../types';

interface CornerSpaceProps {
  space: BoardTile;
  onClick?: () => void;
}

const CORNER_ICONS: Record<string, React.ReactNode> = {
  GO: (
    <svg
      className="corner-icon-svg"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20 20 L80 20 L80 80 L20 80 Z" stroke="white" strokeWidth="4" />
      <text x="50%" y="60" textAnchor="middle" fill="white" fontSize="32" fontWeight="bold" fontFamily="Arial Black, sans-serif">GO</text>
    </svg>
  ),
  FREE_PARKING: (
    <svg
      className="corner-icon-svg"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M30 30 L70 30 L70 70 L30 70 Z" stroke="white" strokeWidth="3" />
      <path d="M35 45 L50 55 L65 40" stroke="white" strokeWidth="3" fill="none" />
    </svg>
  ),
  GO_TO_JAIL: (
    <svg
      className="corner-icon-svg"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M30 30 L30 55 L55 55 L55 30 L70 45 L55 70 L55 45 Z" stroke="white" strokeWidth="3" fill="none" />
    </svg>
  ),
  JAIL: (
    <svg
      className="corner-icon-svg"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M30 25 L70 25 L70 75 L30 75 Z" stroke="white" strokeWidth="3" />
      <path d="M30 45 L50 60 L70 45" stroke="white" strokeWidth="3" fill="none" />
      <circle cx="42" cy="42" r="5" fill="white" />
      <circle cx="58" cy="42" r="5" fill="white" />
    </svg>
  ),
};

export const CornerSpace: React.FC<CornerSpaceProps> = ({ space, onClick }) => {
  const icon = CORNER_ICONS[space.type] || CORNER_ICONS.GO;

  return (
    <div
      className="corner-cell"
      data-space-id={space.id}
      data-type={space.type}
      onClick={onClick ? () => onClick() : undefined}
      role="button"
      tabIndex={0}
      aria-label={`${space.name} corner`}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="corner-icon">{icon}</div>
      <span className="corner-name">{space.name}</span>
    </div>
  );
};