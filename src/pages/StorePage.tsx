import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Check, Lock, ShoppingBag, ShieldCheck } from 'lucide-react';

interface CosmeticItem {
  id: string;
  name: string;
  category: 'token' | 'dice' | 'board' | 'avatar';
  price: number;
  preview: string;
  owned?: boolean;
}

const COSMETICS: CosmeticItem[] = [
  { id: 'gold-dice', name: 'Golden Royale Dice', category: 'dice', price: 500, preview: '🎲✨', owned: true },
  { id: 'neon-dice', name: 'Cyberpunk Neon Dice', category: 'dice', price: 1200, preview: '⚡🎲' },
  { id: 'ruby-token', name: 'Imperial Ruby Token', category: 'token', price: 800, preview: '💎' },
  { id: 'dragon-token', name: 'Golden Dragon Token', category: 'token', price: 2500, preview: '🐉' },
  { id: 'dark-board', name: 'Obsidian Velvet Board', category: 'board', price: 3000, preview: '🎨' },
  { id: 'crown-avatar', name: 'Monopoly Emperor Avatar', category: 'avatar', price: 1500, preview: '👑' },
];

export default function StorePage() {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(2500);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'dice' | 'token' | 'board' | 'avatar'>('all');
  const [ownedItems, setOwnedItems] = useState<string[]>(['gold-dice']);

  const filteredItems = COSMETICS.filter(item => selectedCategory === 'all' || item.category === selectedCategory);

  const handleBuy = (item: CosmeticItem) => {
    if (coins < item.price || ownedItems.includes(item.id)) return;
    setCoins(prev => prev - item.price);
    setOwnedItems(prev => [...prev, item.id]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(240,180,41,0.06) 0%, var(--color-surface-0) 60%)' }}>
      {/* Header */}
      <header className="p-4 border-b border-slate-800 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm flex items-center gap-2">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
          <Sparkles className="text-amber-400" size={16} />
          <span className="font-mono font-bold text-amber-400 text-sm">{coins} Coins</span>
        </div>
      </header>

      {/* Hero */}
      <div className="p-8 text-center max-w-xl mx-auto">
        <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-4">
          <ShoppingBag size={28} />
        </div>
        <h1 className="heading-1 mb-2">Cosmetic Emporium</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
          Personalize your tokens, dice animations, and board visuals.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex justify-center gap-2 mb-8">
        {(['all', 'dice', 'token', 'board', 'avatar'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`btn btn-sm capitalize ${selectedCategory === cat ? 'btn-gold' : 'btn-ghost'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Store Grid */}
      <div className="max-w-4xl mx-auto px-4 pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {filteredItems.map(item => {
          const isOwned = ownedItems.includes(item.id);
          const canAfford = coins >= item.price;

          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -4 }}
              className="panel p-5 flex flex-col justify-between"
            >
              <div>
                <div className="h-28 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-4xl mb-4">
                  {item.preview}
                </div>
                <h3 className="font-bold text-sm mb-1">{item.name}</h3>
                <p className="text-xs capitalize text-slate-500 mb-4">{item.category}</p>
              </div>

              <div>
                {isOwned ? (
                  <button disabled className="btn btn-surface btn-sm w-full gap-1.5 text-emerald-400 border-emerald-500/30">
                    <Check size={14} /> Owned
                  </button>
                ) : (
                  <button
                    onClick={() => handleBuy(item)}
                    disabled={!canAfford}
                    className={`btn btn-sm w-full ${canAfford ? 'btn-gold' : 'btn-surface opacity-50'}`}
                  >
                    {!canAfford && <Lock size={13} />}
                    Unlock for {item.price} Coins
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
