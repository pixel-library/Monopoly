import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Store, Settings, Sparkle, Zap } from 'lucide-react';
import { useGameStore } from '../../state/gameStore';

type TabType = 'trade' | 'store' | 'settings' | 'effects' | 'powerups';

const tabs = [
  { id: 'trade' as TabType, label: 'TRADE', icon: ArrowLeftRight, color: '#D71B1B' },
  { id: 'store' as TabType, label: 'STORE', icon: Store, color: '#3b82f6' },
  { id: 'settings' as TabType, label: 'SETTINGS', icon: Settings, color: '#10b981' },
  { id: 'effects' as TabType, label: 'EFFECTS', icon: Sparkle, color: '#f59e0b' },
  { id: 'powerups' as TabType, label: 'POWER-UPS', icon: Zap, color: '#f97316' },
];

interface TopGameNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TopGameNav: React.FC<TopGameNavProps> = ({ activeTab, onTabChange }) => {
  const { isStoreOpen } = useGameStore();

  return (
    <div className="grid grid-cols-5 border-b border-gray-200">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-1.5 flex flex-col items-center gap-0.5 transition-all ${
              isActive
                ? 'border-b-3 border-red-600 text-red-600'
                : 'border-b-3 border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <Icon size={14} style={{ color: isActive ? tab.color : undefined }} />
            <span className="text-xs font-bold uppercase tracking-wider">
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default TopGameNav;
