import { motion } from 'framer-motion';
import { DiceResult } from '../types';

interface Dice3DProps {
  dice: DiceResult | null;
  rolling: boolean;
  onRoll?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_MAP = { sm: 38, md: 50, lg: 64 };

const FACE_ROTATIONS: Record<number, { x: number; y: number }> = {
  1: { x: -90, y: 0 },
  2: { x: 0, y: 0 },
  3: { x: 0, y: -90 },
  4: { x: 0, y: 90 },
  5: { x: 180, y: 0 },
  6: { x: 90, y: 0 },
};

const FACE_TRANSFORMS: Record<number, (px: number) => string> = {
  1: (px) => `translateZ(${px / 2}px)`,
  6: (px) => `rotateY(180deg) translateZ(${px / 2}px)`,
  3: (px) => `rotateY(90deg) translateZ(${px / 2}px)`,
  4: (px) => `rotateY(-90deg) translateZ(${px / 2}px)`,
  2: (px) => `rotateX(90deg) translateZ(${px / 2}px)`,
  5: (px) => `rotateX(-90deg) translateZ(${px / 2}px)`,
};

function DieFace({ value, size }: { value: number; size: 'sm' | 'md' | 'lg' }) {
  const px = SIZE_MAP[size];
  const dotBase = size === 'lg' ? 'w-3.5 h-3.5' : size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5';

  const positions: Record<number, { left: string; top: string }[]> = {
    1: [{ left: '50%', top: '50%' }],
    2: [{ left: '25%', top: '25%' }, { left: '75%', top: '75%' }],
    3: [{ left: '25%', top: '25%' }, { left: '50%', top: '50%' }, { left: '75%', top: '75%' }],
    4: [{ left: '25%', top: '25%' }, { left: '75%', top: '25%' }, { left: '25%', top: '75%' }, { left: '75%', top: '75%' }],
    5: [{ left: '25%', top: '25%' }, { left: '75%', top: '25%' }, { left: '50%', top: '50%' }, { left: '25%', top: '75%' }, { left: '75%', top: '75%' }],
    6: [{ left: '25%', top: '22%' }, { left: '75%', top: '22%' }, { left: '25%', top: '50%' }, { left: '75%', top: '50%' }, { left: '25%', top: '78%' }, { left: '75%', top: '78%' }],
  };

  const dots = positions[value] || positions[1];
  const transform = FACE_TRANSFORMS[value] ? FACE_TRANSFORMS[value](px) : `translateZ(${px / 2}px)`;

  return (
    <div
      className="absolute bg-white"
      style={{
        width: px,
        height: px,
        backfaceVisibility: 'hidden',
        transform,
        border: '1.5px solid #000',
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {dots.map((pos, i) => (
        <div
          key={i}
          className={`absolute ${dotBase} bg-black rounded-full`}
          style={{
            left: pos.left,
            top: pos.top,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
}

function Die3D({ value, rolling, size = 'md' }: { value: number; rolling?: boolean; size?: 'sm' | 'md' | 'lg' }) {
  const px = SIZE_MAP[size];
  const target = FACE_ROTATIONS[value] || FACE_ROTATIONS[1];

  const spinX = rolling ? [0, 720 + Math.random() * 360, target.x] : target.x;
  const spinY = rolling ? [0, 720 + Math.random() * 360, target.y] : target.y;

  return (
    <div
      className="relative"
      style={{
        width: px,
        height: px,
        perspective: 800,
      }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{
          rotateX: spinX,
          rotateY: spinY,
        }}
        transition={
          rolling
            ? {
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1],
              }
            : { duration: 0 }
        }
      >
        <DieFace value={1} size={size} />
        <DieFace value={6} size={size} />
        <DieFace value={3} size={size} />
        <DieFace value={4} size={size} />
        <DieFace value={2} size={size} />
        <DieFace value={5} size={size} />
      </motion.div>
    </div>
  );
}

export default function Dice3D({ dice, rolling, onRoll, disabled, size = 'md' }: Dice3DProps) {
  const die1 = dice?.die1 || 1;
  const die2 = dice?.die2 || 1;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center justify-center gap-3">
        <Die3D value={die1} rolling={rolling} size={size} />
        <Die3D value={die2} rolling={rolling} size={size} />
      </div>

      {!rolling && dice && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span
            className="font-bold font-mono"
            style={{
              color: dice.isDouble ? '#D71B1B' : '#151515',
              fontSize: size === 'lg' ? '1.1rem' : size === 'sm' ? '0.8rem' : '0.9rem',
            }}
          >
            {dice.total}
          </span>
          {dice.isDouble && (
            <span className="ml-1 text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full">
              DOUBLES!
            </span>
          )}
        </motion.div>
      )}

      {onRoll && (
        <motion.button
          whileHover={!disabled && !rolling ? { scale: 1.03 } : {}}
          whileTap={!disabled && !rolling ? { scale: 0.97 } : {}}
          onClick={onRoll}
          disabled={disabled || rolling}
          className={`font-bold rounded-lg transition-all flex items-center justify-center ${
            disabled || rolling
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 text-white'
          } ${size === 'lg' ? 'px-5 py-2.5 text-sm' : size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2 text-xs'}`}
        >
          {rolling ? 'Rolling...' : 'Roll'}
        </motion.button>
      )}
    </div>
  );
}
