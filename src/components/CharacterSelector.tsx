import { motion } from 'framer-motion';
import { DefaultCharacter } from '../types';
import { DEFAULT_CHARACTERS } from '../data/boardData';
import { Check, Crown } from 'lucide-react';

interface CharacterSelectorProps {
  selectedCharacterId?: string;
  takenCharacterIds: string[];
  onSelect: (characterId: string) => void;
}

export default function CharacterSelector({
  selectedCharacterId,
  takenCharacterIds,
  onSelect,
}: CharacterSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {DEFAULT_CHARACTERS.map((character, index) => {
        const isSelected = selectedCharacterId === character.id;
        const isTaken = takenCharacterIds.includes(character.id) && !isSelected;

        return (
          <motion.button
            key={character.id}
            onClick={() => !isTaken && onSelect(character.id)}
            disabled={isTaken}
            className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
              isSelected
                ? 'border-board-gold bg-board-gold/10 shadow-lg shadow-board-gold/20'
                : isTaken
                ? 'border-white/5 bg-white/5 opacity-50 cursor-not-allowed'
                : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={!isTaken ? { scale: 1.02 } : {}}
            whileTap={!isTaken ? { scale: 0.98 } : {}}
          >
            {/* Character avatar */}
            <div
              className="w-12 h-12 md:w-16 md:h-16 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl md:text-3xl"
              style={{ backgroundColor: character.color }}
            >
              {character.icon}
            </div>

            {/* Character name */}
            <p className={`text-sm font-medium text-center ${
              isSelected ? 'text-board-gold' : 'text-white/80'
            }`}>
              {character.name}
            </p>

            {/* Color indicator */}
            <div
              className="w-4 h-4 rounded-full mx-auto mt-2"
              style={{ backgroundColor: character.color }}
            />

            {/* Selected checkmark */}
            {isSelected && (
              <motion.div
                className="absolute top-2 right-2 w-6 h-6 bg-board-gold rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500 }}
              >
                <Check size={14} className="text-board-dark" />
              </motion.div>
            )}

            {/* Taken indicator */}
            {isTaken && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                <div className="bg-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Taken
                </div>
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
