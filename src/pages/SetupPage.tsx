import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Users, ArrowRight, Upload, UserCircle, Shuffle, Store, Info } from 'lucide-react';
import { useGameStore } from '../state/gameStore';
import { socketService } from '../services/socketService';
import { generateId, getInitials } from '../game/engine';
import { TOKEN_COLORS, DEFAULT_CHARACTERS } from '../data/boardData';
import { Player } from '../types';

const PLAYER_COLORS = [
  { id: 'token-red', color: '#e74c3c', label: 'Red' },
  { id: 'token-orange', color: '#FF8C00', label: 'Orange' },
  { id: 'token-blue', color: '#3b82f6', label: 'Blue' },
  { id: 'token-purple', color: '#a78bfa', label: 'Purple' },
];

export default function SetupPage() {
  const navigate = useNavigate();
  const { addPlayer, players, settings, resetGame, setPhase } = useGameStore();

  const [mode, setMode] = useState<'home' | 'create-local' | 'create-online' | 'join'>('home');
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [selectedColor, setSelectedColor] = useState(PLAYER_COLORS[0]);
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const validateName = (v: string) => {
    if (!v.trim() || v.trim().length < 2) return 'Name must be at least 2 characters';
    if (v.trim().length > 18) return 'Name must be 18 characters or less';
    return '';
  };

  const buildPlayer = (): Player => ({
    id: generateId(),
    name: name.trim(),
    avatarType: customImage ? 'custom' : selectedCharId ? 'default' : 'initials',
    avatarUrl: customImage || undefined,
    defaultCharacterId: selectedCharId || undefined,
    tokenId: selectedColor.id,
    money: settings.startingMoney,
    position: 0,
    properties: [],
    buildings: [],
    inJail: false,
    jailTurns: 0,
    getOutOfJailCards: 0,
    bankrupt: false,
    isCurrentPlayer: false,
    connected: true,
    doublesCount: 0,
  });

  const handleCreateOnline = async () => {
    const err = validateName(name);
    if (err) { setNameError(err); return; }
    setIsConnecting(true);
    resetGame();
    const player = buildPlayer();
    addPlayer(player);
    const result = await socketService.createRoom(player, settings);
    setIsConnecting(false);
    if (result.success) navigate('/lobby');
    else setNameError(result.error || 'Connection failed');
  };

  const handleJoinOnline = async () => {
    const err = validateName(name);
    if (err) { setNameError(err); return; }
    if (!joinCode.trim() || joinCode.length < 6) { setJoinError('Enter the 6-character room code'); return; }
    setIsConnecting(true);
    const player = buildPlayer();
    const result = await socketService.joinRoom(joinCode.trim().toUpperCase(), player);
    setIsConnecting(false);
    if (result.success) { addPlayer(player); navigate('/lobby'); }
    else setJoinError(result.error || 'Room not found');
  };

  const handleAddLocal = () => {
    const err = validateName(name);
    if (err) { setNameError(err); return; }
    if (players.length >= settings.maxPlayers) return;
    const p = buildPlayer();
    addPlayer(p);
    const nextColor = PLAYER_COLORS[players.length + 1] || PLAYER_COLORS[0];
    setSelectedColor(nextColor);
    setName('');
    setCustomImage(null);
    setSelectedCharId(null);
  };

      

  const handleStartLocal = () => {
    if (players.length >= 2) {
      setPhase('LOBBY');
      navigate('/lobby');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCustomImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const char = DEFAULT_CHARACTERS.find(c => c.id === selectedCharId);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(240,180,41,0.06) 0%, var(--color-surface-0) 60%)' }}>
      {/* Top Nav */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-black text-sm">E</div>
          <span className="font-display font-bold text-lg tracking-wide" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Estate Empire</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/stats')}
            className="btn btn-ghost btn-sm flex items-center gap-1.5"
          >
            <Globe size={14} />
            <span className="hidden sm:block">Stats</span>
          </button>
          <button
            onClick={() => navigate('/store')}
            className="btn btn-ghost btn-sm flex items-center gap-1.5"
          >
            <Store size={14} />
            <span className="hidden sm:block">Store</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <AnimatePresence mode="wait">

          {/* ── HOME ── */}
          {mode === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="w-full max-w-sm text-center"
            >
              <div className="mb-10">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6" style={{ background: '#D71B1B' }}>
                  <span className="text-4xl">M</span>
                </div>
                <h1 className="heading-1 mb-2">Monopoly</h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 15 }}>Professional multiplayer board game</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => { resetGame(); setMode('create-online'); }}
                  className="btn btn-gold btn-xl w-full"
                >
                  <Globe size={18} />
                  Create Online Game
                </button>
                <button
                  onClick={() => setMode('join')}
                  className="btn btn-surface btn-xl w-full"
                >
                  <ArrowRight size={18} />
                  Join with Room Code
                </button>
                <button
                  onClick={() => { resetGame(); setMode('create-local'); }}
                  className="btn btn-ghost btn-xl w-full"
                >
                  <Users size={18} />
                  Local Hotseat Game
                </button>
              </div>

              <p className="mt-8 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                2–4 players · Ages 8+ · 60–180 min
              </p>
            </motion.div>
          )}

          {/* ── CREATE ONLINE ── */}
          {mode === 'create-online' && (
            <motion.div key="create-online" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="w-full max-w-sm">
              <button onClick={() => setMode('home')} className="btn btn-ghost btn-sm mb-6">← Back</button>
              <h2 className="heading-2 mb-1">Create Game</h2>
              <p className="mb-6" style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>Set up your player profile to host a room.</p>

              <PlayerProfileForm
                name={name} setName={setName} nameError={nameError} setNameError={setNameError}
                selectedColor={selectedColor} setSelectedColor={setSelectedColor}
                selectedCharId={selectedCharId} setSelectedCharId={setSelectedCharId}
                customImage={customImage} setCustomImage={setCustomImage}
                fileRef={fileRef} onImageUpload={handleImageUpload}
              />

              <button
                onClick={handleCreateOnline}
                disabled={isConnecting || !name.trim()}
                className="btn btn-gold btn-lg w-full mt-4"
              >
                {isConnecting ? 'Connecting…' : <>Create Room <ArrowRight size={16} /></>}
              </button>
            </motion.div>
          )}

          {/* ── JOIN ── */}
          {mode === 'join' && (
            <motion.div key="join" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="w-full max-w-sm">
              <button onClick={() => setMode('home')} className="btn btn-ghost btn-sm mb-6">← Back</button>
              <h2 className="heading-2 mb-1">Join Game</h2>
              <p className="mb-6" style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>Enter a room code to join a friend's game.</p>

              <div className="mb-4">
                <label className="label mb-2 block">Room Code</label>
                <input
                  className="input mono text-center text-xl tracking-widest uppercase"
                  value={joinCode}
                  onChange={e => { setJoinCode(e.target.value.toUpperCase()); setJoinError(''); }}
                  placeholder="XXXXXX"
                  maxLength={6}
                />
                {joinError && <p className="text-xs mt-1.5" style={{ color: 'var(--color-red)' }}>{joinError}</p>}
              </div>

              <PlayerProfileForm
                name={name} setName={setName} nameError={nameError} setNameError={setNameError}
                selectedColor={selectedColor} setSelectedColor={setSelectedColor}
                selectedCharId={selectedCharId} setSelectedCharId={setSelectedCharId}
                customImage={customImage} setCustomImage={setCustomImage}
                fileRef={fileRef} onImageUpload={handleImageUpload}
              />

              <button
                onClick={handleJoinOnline}
                disabled={isConnecting || !name.trim() || joinCode.length < 6}
                className="btn btn-gold btn-lg w-full mt-4"
              >
                {isConnecting ? 'Joining…' : <>Join Room <ArrowRight size={16} /></>}
              </button>
            </motion.div>
          )}

          {/* ── LOCAL ── */}
          {mode === 'create-local' && (
            <motion.div key="create-local" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="w-full max-w-md">
              <button onClick={() => { setMode('home'); }} className="btn btn-ghost btn-sm mb-6">← Back</button>
              <h2 className="heading-2 mb-1">Hotseat Game</h2>
              <p className="mb-6" style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>Add 2–4 players on the same device.</p>

              {/* Added players */}
              {players.length > 0 && (
                <div className="mb-5 space-y-2">
                  {players.map((p, i) => {
                    const color = PLAYER_COLORS.find(c => c.id === p.tokenId);
                    return (
                      <div key={p.id} className="flex items-center gap-3 panel p-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: color?.color || '#888' }}>
                          {getInitials(p.name)}
                        </div>
                        <span className="font-semibold text-sm flex-1">{p.name}</span>
                        <span className="label">P{i + 1}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {players.length < settings.maxPlayers && (
                <>
                  <PlayerProfileForm
                    name={name} setName={setName} nameError={nameError} setNameError={setNameError}
                    selectedColor={selectedColor} setSelectedColor={setSelectedColor}
                    selectedCharId={selectedCharId} setSelectedCharId={setSelectedCharId}
                    customImage={customImage} setCustomImage={setCustomImage}
                    fileRef={fileRef} onImageUpload={handleImageUpload}
                    colorHint={`Player ${players.length + 1}`}
                  />
                  <button onClick={handleAddLocal} disabled={!name.trim()} className="btn btn-surface btn-lg w-full mt-3">
                    <Users size={16} /> Add Player {players.length + 1}
                  </button>
                </>
              )}

              {players.length >= 2 && (
                <button onClick={handleStartLocal} className="btn btn-gold btn-lg w-full mt-3">
                  Start Game ({players.length} players) <ArrowRight size={16} />
                </button>
              )}

              {players.length < 2 && (
                <p className="text-center mt-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>Add at least 2 players to start</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Sub-component: Player Profile Form ──
function PlayerProfileForm({
  name, setName, nameError, setNameError,
  selectedColor, setSelectedColor,
  selectedCharId, setSelectedCharId,
  customImage, setCustomImage,
  fileRef, onImageUpload, colorHint,
}: {
  name: string; setName: (v: string) => void; nameError: string; setNameError: (v: string) => void;
  selectedColor: { id: string; color: string; label: string }; setSelectedColor: (v: any) => void;
  selectedCharId: string | null; setSelectedCharId: (v: string | null) => void;
  customImage: string | null; setCustomImage: (v: string | null) => void;
  fileRef: React.RefObject<HTMLInputElement>; onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  colorHint?: string;
}) {
  const PLAYER_COLORS = [
    { id: 'token-red', color: '#e74c3c', label: 'Red' },
    { id: 'token-orange', color: '#FF8C00', label: 'Orange' },
    { id: 'token-blue', color: '#3b82f6', label: 'Blue' },
    { id: 'token-purple', color: '#a78bfa', label: 'Purple' },
  ];

  const avatarBg = selectedColor.color;
  const initials = name.trim() ? getInitials(name) : colorHint?.[0] || '?';

  return (
    <div className="space-y-4">
      {/* Avatar preview + upload */}
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg cursor-pointer overflow-hidden"
            style={{ background: customImage ? 'transparent' : avatarBg }}
            onClick={() => fileRef.current?.click()}
          >
            {customImage
              ? <img src={customImage} className="w-full h-full object-cover" alt="avatar" />
              : initials
            }
          </div>
          {customImage && (
            <button
              onClick={() => setCustomImage(null)}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
            >×</button>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={onImageUpload} className="hidden" />
        </div>
        <div className="flex-1">
          <label className="label mb-1.5 block">Your Name {colorHint && <span style={{ color: 'var(--color-gold)' }}>({colorHint})</span>}</label>
          <input
            className="input"
            value={name}
            onChange={e => { setName(e.target.value); setNameError(''); }}
            onKeyDown={e => e.key === 'Enter' && e.currentTarget.blur()}
            placeholder="Enter your name"
            maxLength={18}
            autoFocus
          />
          {nameError && <p className="text-xs mt-1" style={{ color: 'var(--color-red)' }}>{nameError}</p>}
        </div>
      </div>

      {/* Color picker */}
      <div>
        <label className="label mb-2 block">Token Color</label>
        <div className="flex gap-2">
          {PLAYER_COLORS.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedColor(c)}
              className="w-8 h-8 rounded-full transition-all"
              style={{
                background: c.color,
                boxShadow: selectedColor.id === c.id ? `0 0 0 3px var(--color-surface-1), 0 0 0 5px ${c.color}` : 'none',
                transform: selectedColor.id === c.id ? 'scale(1.15)' : 'scale(1)',
              }}
              title={c.label}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
