import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, GameSettings, Player, DiceResult, GameLog, TradeOffer, BoardTile, TurnState, AuctionState, Card, CardAction, ChatMessage, PlayerStats, Achievement, PowerUp, PowerUpType } from '../types';
import { BOARD_TILES, CHANCE_CARDS, COMMUNITY_CHEST_CARDS } from '../data/boardData';
import {
  generateId,
  rollDice,
  calculateNewPosition,
  hasPassedGO,
  getTileAtPosition,
  calculateRent,
  ownsCompleteGroup,
  canBuyHouse,
  canBuyHotel,
  handleCardAction,
  calculateNetWorth,
} from '../game/engine';

const DEFAULT_SETTINGS: GameSettings = {
  startingMoney: 1500,
  goSalary: 200,
  maxPlayers: 4,
  freeParkingReward: false,
  freeParkingAmount: 0,
  auctionEnabled: false,
  turnTimer: 0,
  turnTimerSeconds: 0,
  soundEnabled: true,
  musicEnabled: false,
  animationsEnabled: true,
  doublesInJail: true,
  maxDoublesBeforeJail: 3,
  evenBuild: true,
};

interface GameStore extends GameState {
   chatMessages: ChatMessage[];
   addChatMessage: (message: string, playerId: string) => void;
   isStoreOpen: boolean;
   setStoreOpen: (open: boolean) => void;
  isTradeModalOpen: boolean;
  setTradeModalOpen: (open: boolean) => void;
  lastCard: Card | null;
  setLastCard: (card: Card | null) => void;

  setPhase: (phase: GameState['phase']) => void;
  setRoomCode: (roomCode: string | null) => void;
  setMyPlayerId: (playerId: string | null) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  updatePlayer: (playerId: string, updates: Partial<Player>) => void;
  setCurrentPlayer: (playerId: string) => void;
  rollDiceAction: () => void;
  movePlayer: (playerId: string, spaces: number) => void;
  resolveTile: () => void;
  buyProperty: (playerId: string, tileId: number) => void;
  declinePropertyPurchase: (playerId: string, tileId: number) => void;
  payRent: (fromPlayerId: string, toPlayerId: string, amount: number) => void;
  buyHouse: (playerId: string, tileId: number) => void;
  buyHotel: (playerId: string, tileId: number) => void;
  sellHouses: (playerId: string, tileId: number) => void;
  isPropertyMortgaged: (tileId: number) => boolean;
  triggerDebt: (playerId: string, amount: number, creditorId: string) => void;
  drawChanceCardInternal: () => void;
  drawCommunityChestCardInternal: () => void;
  mortgageProperty: (playerId: string, tileId: number) => void;
  unmortgageProperty: (playerId: string, tileId: number) => void;
  sendToJail: (playerId: string) => void;
  payJailFine: (playerId: string) => void;
  useJailCard: (playerId: string) => void;
  drawChanceCard: () => void;
  drawCommunityChestCard: () => void;
  resolveCard: (card: Card, player: Player) => void;
  endTurn: () => void;
  addLog: (message: string, type?: GameLog['type'], playerId?: string) => void;
  setTrade: (trade: TradeOffer | null) => void;
  proposeTrade: (trade: TradeOffer) => void;
  acceptTrade: () => void;
  rejectTrade: () => void;
  waitTrade: () => void;
  cancelTrade: () => void;
  counterTrade: (tradeId: string, counterOffer: { offeredMoney: number; offeredPropertyIds: number[]; requestedMoney: number; requestedPropertyIds: number[] }) => void;
  startAuction: (tileId: number) => void;
  placeBid: (playerId: string, bidAmount: number) => boolean;
  passBid: (playerId: string) => boolean;
  completeAuction: () => void;
  payDebt: () => void;
  declareBankruptcy: (playerId: string) => void;
  payIncomeTax: (fixed: boolean) => void;
  setWinner: (player: Player) => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  resetGame: () => void;
  startGame: () => void;
  setTurnState: (turnState: Partial<TurnState>) => void;

  playerStats: PlayerStats;
  achievements: Achievement[];
  powerUps: PowerUp[];
  addStat: (key: keyof PlayerStats, amount?: number) => void;
  checkAchievements: () => void;
  collectPowerUp: (type: PowerUpType) => void;
  usePowerUp: (powerUpId: string) => void;
}

const initialState: GameState = {
  gameId: generateId(),
  roomCode: null,
  myPlayerId: null,
  phase: 'SETUP',
  players: [],
  currentPlayerIndex: 0,
  board: BOARD_TILES,
  bankHouses: 32,
  bankHotels: 12,
  mortgagedProperties: [],
  turnNumber: 0,
  dice: null,
   turnState: {
    phase: 'ROLL',
    hasRolled: false,
    canRollAgain: false,
    doublesRolled: 0,
    pendingActionTileId: null,
    debtAmount: 0,
    creditorId: null,
  },
  auction: null,
  winner: null,
  settings: DEFAULT_SETTINGS,
  trade: null,
  tradeNotifications: [],
  logs: [],
  lastAction: null,
  lastCard: null,
  chatMessages: [],
  isStoreOpen: false,
  transactions: [],
};

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-game',
    title: 'First Game',
    description: 'Play your first game',
    icon: '🎮',
    unlocked: false,
    condition: (s) => s.gamesPlayed >= 1,
  },
  {
    id: 'first-win',
    title: 'Winner',
    description: 'Win your first game',
    icon: '🏆',
    unlocked: false,
    condition: (s) => s.gamesWon >= 1,
  },
  {
    id: 'property-mogul',
    title: 'Property Mogul',
    description: 'Purchase 10 properties',
    icon: '🏠',
    unlocked: false,
    condition: (s) => s.propertiesPurchased >= 10,
  },
  {
    id: 'builder',
    title: 'Builder',
    description: 'Build 5 houses',
    icon: '🔨',
    unlocked: false,
    condition: (s) => s.housesBuilt >= 5,
  },
  {
    id: 'hotel-magnate',
    title: 'Hotel Magnate',
    description: 'Build 3 hotels',
    icon: '🏨',
    unlocked: false,
    condition: (s) => s.hotelsBuilt >= 3,
  },
  {
    id: 'trader',
    title: 'Trader',
    description: 'Complete 5 trades',
    icon: '📊',
    unlocked: false,
    condition: (s) => s.tradesMade >= 5,
  },
  {
    id: 'rent-collector',
    title: 'Rent Collector',
    description: 'Collect $1000 in rent',
    icon: '💰',
    unlocked: false,
    condition: (s) => s.rentCollected >= 1000,
  },
  {
    id: 'property-mogul',
    title: 'Property Mogul',
    description: 'Own 10 properties',
    icon: '🏘️',
    unlocked: false,
    condition: (s) => s.propertiesPurchased >= 10,
  },
  {
    id: 'bankrupter',
    title: 'Bankrupter',
    description: 'Send 3 players to bankruptcy',
    icon: '💀',
    unlocked: false,
    condition: (s) => s.bankruptciesCaused >= 3,
  },
  {
    id: 'country-club',
    title: 'Country Club',
    description: 'Complete a full country set',
    icon: '🇺🇳',
    unlocked: false,
    condition: (s) => s.propertiesPurchased >= 2,
  },
  {
    id: 'free-bird',
    title: 'Free Bird',
    description: 'Use 3 Get Out of Jail Free cards',
    icon: '🃏',
    unlocked: false,
    condition: (s) => s.jailFreeCardsUsed >= 3,
  },
  {
    id: 'power-collector',
    title: 'Power Collector',
    description: 'Collect 5 power-ups',
    icon: '⚡',
    unlocked: false,
    condition: (s) => s.powerUpsCollected >= 5,
  },
  {
    id: 'power-user',
    title: 'Power User',
    description: 'Use 3 power-ups',
    icon: '⚡',
    unlocked: false,
    condition: (s) => s.powerUpsUsed >= 3,
  },
  {
    id: 'millionaire',
    title: 'Millionaire',
    description: 'Accumulate $10,000 in lifetime earnings',
    icon: '💎',
    unlocked: false,
    condition: (s) => s.totalMoneyEarned >= 10000,
  },
];

export const POWER_UP_DEFS: Record<PowerUpType, { name: string; description: string; icon: string }> = {
  'extra-turn': {
    name: 'Extra Turn',
    description: 'Take an additional turn after this one',
    icon: '⏱️',
  },
  'double-rent': {
    name: 'Double Rent',
    description: 'Double the rent collected on your next property visited',
    icon: '💥',
  },
  'free-property': {
    name: 'Free Property',
    description: 'Purchase your next property for $0',
    icon: '🎁',
  },
  'steal-cash': {
    name: 'Steal Cash',
    description: 'Steal $200 from a random opponent',
    icon: '🎴',
  },
};

export const getPowerUpSpace = (): PowerUpType | null => {
  const types: PowerUpType[] = ['extra-turn', 'double-rent', 'free-property', 'steal-cash'];
  return types[Math.floor(Math.random() * types.length)];
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      isTradeModalOpen: false,
      lastCard: null,
      chatMessages: [],
      isStoreOpen: false,
      setLastCard: (card) => set({ lastCard: card }),
      setTradeModalOpen: (open) => set({ isTradeModalOpen: open }),
      setStoreOpen: (open) => set({ isStoreOpen: open }),
      setRoomCode: (roomCode) => set({ roomCode }),
      setMyPlayerId: (playerId) => set({ myPlayerId: playerId }),

  setPhase: (phase) => set({ phase }),

  addPlayer: (player) => set((state) => ({
    players: [...state.players, player],
  })),

  removePlayer: (playerId) => set((state) => ({
    players: state.players.filter(p => p.id !== playerId),
  })),

  updatePlayer: (playerId, updates) => set((state) => ({
    players: state.players.map(p =>
      p.id === playerId ? { ...p, ...updates } : p
    ),
  })),

  setCurrentPlayer: (playerId) => set((state) => ({
    currentPlayerIndex: state.players.findIndex(p => p.id === playerId),
    players: state.players.map(p => ({
      ...p,
      isCurrentPlayer: p.id === playerId,
    })),
  })),

  rollDiceAction: () => {
    const state = get();
    if (state.turnState.hasRolled && !state.turnState.canRollAgain) return;

    const currentPlayer = state.players[state.currentPlayerIndex];
    if (!currentPlayer || currentPlayer.bankrupt) return;

    const dice = rollDice();

    set({
      dice,
      turnState: {
        ...state.turnState,
        hasRolled: true,
        doublesRolled: dice.isDouble ? state.turnState.doublesRolled + 1 : 0,
        canRollAgain: dice.isDouble && (state.turnState.doublesRolled + 1) < state.settings.maxDoublesBeforeJail,
      },
    });

    get().addLog(
      `${currentPlayer.name} rolled ${dice.total} (${dice.die1}.${dice.die2})`,
      'action',
      currentPlayer.id
    );

    if (dice.isDouble && state.turnState.doublesRolled + 1 >= state.settings.maxDoublesBeforeJail) {
      get().addLog(
        `${currentPlayer.name} rolled three consecutive doubles and goes to Jail!`,
        'warning',
        currentPlayer.id
      );
      get().sendToJail(currentPlayer.id);
      get().endTurn();
      return;
    }

    if (currentPlayer.inJail) {
      if (dice.isDouble) {
        get().addLog(
          `${currentPlayer.name} rolled doubles and escapes Jail!`,
          'success',
          currentPlayer.id
        );
        currentPlayer.inJail = false;
        currentPlayer.jailTurns = 0;
        get().movePlayer(currentPlayer.id, dice.total);
      } else {
        currentPlayer.jailTurns += 1;
        if (currentPlayer.jailTurns >= 3) {
          const cost = 50;
          if (currentPlayer.money >= cost) {
            currentPlayer.money -= cost;
            currentPlayer.inJail = false;
            currentPlayer.jailTurns = 0;
            get().addLog(
              `${currentPlayer.name} pays $${cost} to leave Jail and must move ${dice.total}`,
              'warning',
              currentPlayer.id
            );
            get().movePlayer(currentPlayer.id, dice.total);
          } else {
            get().addLog(
              `${currentPlayer.name} cannot afford to pay $${cost} and must raise cash to leave Jail`,
              'warning',
              currentPlayer.id
            );
            const state2 = get();
            state2.turnState = { ...state2.turnState, phase: 'DEBT' };
            state2.turnState.debtAmount = cost;
            state2.turnState.creditorId = 'BANK';
            set({ turnState: state2.turnState });
          }
        } else {
          get().addLog(
            `${currentPlayer.name} stays in Jail (visit ${state.settings.maxDoublesBeforeJail - currentPlayer.jailTurns} more turns)`,
            'info',
            currentPlayer.id
          );
          get().endTurn();
        }
      }
    } else {
      get().movePlayer(currentPlayer.id, dice.total);
    }
  },

   movePlayer: (playerId, spaces) => {
    const state = get();
    const player = state.players.find(p => p.id === playerId);
    if (!player) return;

    const newPosition = calculateNewPosition(player.position, spaces);
    const passedGO = hasPassedGO(player.position, newPosition, spaces);

    if (passedGO && newPosition !== 0) {
      player.money += state.settings.goSalary;
      get().addLog(
        `${player.name} passed GO and collected $${state.settings.goSalary}`,
        'success',
        player.id
      );
    }

    player.position = newPosition;
    set({ players: [...state.players] });

    setTimeout(() => get().resolveTile(), 600);
  },

  resolveTile: () => {
    const state = get();
    const currentPlayer = state.players[state.currentPlayerIndex];
    if (!currentPlayer) return;
    const tile = getTileAtPosition(currentPlayer.position);

    let newPhase: TurnState['phase'] = 'ACTION';

    switch (tile.type) {
      case 'GO':
        currentPlayer.money += state.settings.goSalary;
        if (currentPlayer.id === get().myPlayerId) {
          get().addStat('totalMoneyEarned', state.settings.goSalary);
        }
        get().addLog(
          `${currentPlayer.name} landed on GO and collected $${state.settings.goSalary}`,
          'success',
          currentPlayer.id
        );
        if (Math.random() < 0.1 && currentPlayer.id === get().myPlayerId) {
          const pu = getPowerUpSpace();
          if (pu) get().collectPowerUp(pu);
        }
        break;

      case 'PROPERTY':
      case 'RAILROAD':
      case 'UTILITY':
        if (tile.price) {
          const owner = state.players.find(p => p.properties.includes(tile.id));
          if (!owner) {
            newPhase = 'ACTION';
          } else if (owner.id !== currentPlayer.id) {
            if (get().isPropertyMortgaged(tile.id)) {
              get().addLog(
                `${tile.name} is mortgaged; no rent collected`,
                'info',
                currentPlayer.id
              );
            } else {
              const rent = calculateRent(tile, owner, state.dice?.total || 7, get().mortgagedProperties, get().bankHouses, get().bankHotels);
              if (rent > 0) {
                if (currentPlayer.money >= rent) {
                  currentPlayer.money -= rent;
                  owner.money += rent;
                  get().addLog(
                    `${currentPlayer.name} paid $${rent} rent to ${owner.name}`,
                    'warning',
                    currentPlayer.id
                  );
                } else {
                  get().addLog(
                    `${currentPlayer.name} owes $${rent} to ${owner.name} and must raise cash!`,
                    'warning',
                    currentPlayer.id
                  );
                  set({
                    turnState: {
                      ...state.turnState,
                      phase: 'DEBT',
                      debtAmount: rent,
                      creditorId: owner.id,
                      pendingActionTileId: tile.id,
                    },
                  });
                  return;
                }
              }
            }
            newPhase = 'ACTION';
          } else {
            get().addLog(
              `${currentPlayer.name} landed on their own property`,
              'info',
              currentPlayer.id
            );
            newPhase = 'ACTION';
          }
        }
        break;

      case 'TAX':
        if (tile.taxType === 'income') {
          newPhase = 'TAX_DECISION';
        } else {
          if (tile.taxAmount) {
            if (currentPlayer.money >= tile.taxAmount) {
              currentPlayer.money -= tile.taxAmount;
              get().addLog(
                `${currentPlayer.name} paid $${tile.taxAmount} in taxes`,
                'warning',
                currentPlayer.id
              );
              newPhase = 'ACTION';
            } else {
              get().triggerDebt(currentPlayer.id, tile.taxAmount, 'BANK');
              return;
            }
          }
        }
        break;

      case 'CHANCE':
        get().drawChanceCardInternal();
        return;

      case 'COMMUNITY_CHEST':
        get().drawCommunityChestCardInternal();
        return;

      case 'JAIL':
        get().addLog(
          `${currentPlayer.name} is Just Visiting`,
          'info',
          currentPlayer.id
        );
        newPhase = 'ACTION';
        break;

      case 'FREE_PARKING':
        if (state.settings.freeParkingReward) {
          currentPlayer.money += state.settings.freeParkingAmount;
      get().addLog(
        `${currentPlayer.name} collected $${state.settings.freeParkingAmount} from Free Parking`,
            'success',
            currentPlayer.id
          );
        } else {
          get().addLog(
            `${currentPlayer.name} landed on Free Parking`,
            'info',
            currentPlayer.id
          );
          if (Math.random() < 0.3 && currentPlayer.id === get().myPlayerId) {
            const pu = getPowerUpSpace();
            if (pu) get().collectPowerUp(pu);
          }
        }
        newPhase = 'ACTION';
        break;

      case 'GO_TO_JAIL':
        get().sendToJail(currentPlayer.id);
        newPhase = 'ACTION';
        break;
    }

    set({
      players: [...state.players],
      turnState: {
        ...state.turnState,
        phase: newPhase,
        canRollAgain: !!(state.dice?.isDouble) && !currentPlayer.inJail,
        pendingActionTileId: tile.id,
      },
    });
  },

  buyProperty: (playerId, tileId) => {
    const state = get();
    const player = state.players.find(p => p.id === playerId);
    const tile = BOARD_TILES.find(t => t.id === tileId);

    if (!player || !tile || !tile.price) return;
    if (player.money < tile.price) return;
    if (state.players[state.currentPlayerIndex].id !== playerId) return;
    if (BOARD_TILES[player.position].id !== tileId) return;
    const existingOwner = state.players.find(p => p.properties.includes(tileId));
    if (existingOwner) {
      get().addLog(
        `${tile.name} is already owned by ${existingOwner.name}`,
        'error',
        playerId
      );
      return;
    }

    player.money -= tile.price;
    player.properties.push(tileId);

    get().addLog(
      `${player.name} bought ${tile.name} for $${tile.price}`,
      'success',
      player.id
    );

    set({
      players: [...state.players],
      turnState: {
        ...state.turnState,
        phase: 'ACTION',
        pendingActionTileId: tileId,
      },
    });
    get().addStat('propertiesPurchased', 1);
    get().checkAchievements();
  },

  declinePropertyPurchase: (playerId, tileId) => {
    const state = get();
    const player = state.players.find(p => p.id === playerId);
    const tile = BOARD_TILES.find(t => t.id === tileId);
    if (!tile || !tile.price || !player) return;

    get().addLog(`${player.name} declined to buy ${tile.name}. Property remains unowned.`, 'info', playerId);

    set({
      players: [...state.players],
      turnState: {
        ...state.turnState,
        phase: 'ACTION',
        pendingActionTileId: tileId,
      },
    });
  },

  payRent: (fromPlayerId, toPlayerId, amount) => {
    const state = get();
    const fromPlayer = state.players.find(p => p.id === fromPlayerId);
    const toPlayer = state.players.find(p => p.id === toPlayerId);

    if (!fromPlayer || !toPlayer) return;

    if (fromPlayer.money >= amount) {
      fromPlayer.money -= amount;
      toPlayer.money += amount;
      get().addLog(
        `${fromPlayer.name} paid $${amount} rent to ${toPlayer.name}`,
        'warning',
        fromPlayer.id
      );
    } else {
      get().addLog(
        `${fromPlayer.name} owes $${amount} to ${toPlayer.name} and must raise cash!`,
        'warning',
        fromPlayer.id
      );
      set({
        turnState: {
          ...state.turnState,
          phase: 'DEBT',
          debtAmount: amount,
          creditorId: toPlayerId,
        },
      });
    }

    set({ players: [...state.players] });
     if (toPlayerId === get().myPlayerId && fromPlayer?.money >= amount) {
      get().addStat('rentCollected', amount);
      get().addStat('totalMoneyEarned', amount);
    }
  },

  buyHouse: (playerId, tileId) => {
    const state = get();
    const player = state.players.find(p => p.id === playerId);
    const tile = BOARD_TILES.find(t => t.id === tileId);

    if (!player || !tile || !tile.houseCost || state.bankHouses <= 0) return;
    if (!canBuyHouse(player, tile, state.mortgagedProperties)) return;
    if (player.money < tile.houseCost) return;

    player.money -= tile.houseCost;
    const building = player.buildings.find(b => b.propertyId === tileId);

    if (building) {
      building.houses += 1;
    } else {
      player.buildings.push({ propertyId: tileId, houses: 1, hotel: false });
    }

    set({
      players: [...state.players],
      bankHouses: state.bankHouses - 1,
    });

    get().addLog(
      `${player.name} built a house on ${tile.name}`,
      'success',
      player.id
    );
    get().addStat('housesBuilt', 1);
    get().checkAchievements();
  },

  buyHotel: (playerId, tileId) => {
    const state = get();
    const player = state.players.find(p => p.id === playerId);
    const tile = BOARD_TILES.find(t => t.id === tileId);

    if (!player || !tile || !tile.houseCost || state.bankHotels <= 0) return;
    if (!canBuyHotel(player, tile, state.mortgagedProperties)) return;
    if (player.money < tile.houseCost) return;

    const building = player.buildings.find(b => b.propertyId === tileId);
    if (!building || building.houses !== 4 || building.hotel) return;

    player.money -= tile.houseCost;
    building.houses = 0;
    building.hotel = true;

    set({
      players: [...state.players],
      bankHouses: state.bankHouses + 4,
      bankHotels: state.bankHotels - 1,
    });

    get().addLog(
      `${player.name} built a hotel on ${tile.name}`,
      'success',
      player.id
    );
    get().addStat('hotelsBuilt', 1);
    get().checkAchievements();
  },

  sellHouses: (playerId, tileId) => {
    const state = get();
    const player = state.players.find(p => p.id === playerId);
    const tile = BOARD_TILES.find(t => t.id === tileId);
    if (!player || !tile || !tile.houseCost) return;

    const building = player.buildings.find(b => b.propertyId === tileId);
    if (!building) return;

    if (building.hotel) {
      building.hotel = false;
      building.houses = 4;
      set({ players: [...state.players], bankHotels: state.bankHotels + 1, bankHouses: state.bankHouses - 4 });
      get().addLog(
        `${player.name} sold hotel back from ${tile.name} for $${Math.round(tile.houseCost * 4 / 2)}`,
        'info',
        player.id
      );
    } else if (building.houses > 0) {
      building.houses -= 1;
      set({ players: [...state.players], bankHouses: state.bankHouses + 1 });
      const refund = Math.round(tile.houseCost / 2);
      player.money += refund;
      get().addLog(
        `${player.name} sold a house on ${tile.name} for $${refund}`,
        'info',
        player.id
      );
    }

    set({ players: [...state.players] });
  },

  isPropertyMortgaged: (tileId: number) => {
    return get().mortgagedProperties.includes(tileId);
  },

  mortgageProperty: (playerId, tileId) => {
    const state = get();
    const player = state.players.find(p => p.id === playerId);
    const tile = BOARD_TILES.find(t => t.id === tileId);

    if (!player || !tile || !tile.mortgageValue) return;

    player.money += tile.mortgageValue;
    set({
      players: [...state.players],
      mortgagedProperties: [...state.mortgagedProperties, tileId],
    });

    get().addLog(
      `${player.name} mortgaged ${tile.name} for $${tile.mortgageValue}`,
      'warning',
      player.id
    );
  },

  unmortgageProperty: (playerId, tileId) => {
    const state = get();
    const player = state.players.find(p => p.id === playerId);
    const tile = BOARD_TILES.find(t => t.id === tileId);

    if (!player || !tile || !tile.mortgageValue) return;
    const cost = Math.round(tile.mortgageValue * 1.1);

    if (player.money < cost) return;

    player.money -= cost;
    set({
      players: [...state.players],
      mortgagedProperties: state.mortgagedProperties.filter(id => id !== tileId),
    });

    get().addLog(
      `${player.name} unmortgaged ${tile.name} for $${cost}`,
      'success',
      player.id
    );
  },

  sendToJail: (playerId) => {
    const state = get();
    const player = state.players.find(p => p.id === playerId);
    if (!player) return;

    player.inJail = true;
    player.position = 10;
    player.jailTurns = 0;

    set({ players: [...state.players] });
    get().addLog(`${player.name} was sent to Jail!`, 'warning', playerId);
  },

  payJailFine: (playerId) => {
    const state = get();
    const player = state.players.find(p => p.id === playerId);
    if (!player || !player.inJail || player.money < 50) return;

    player.money -= 50;
    player.inJail = false;
    player.jailTurns = 0;

    set({ players: [...state.players] });
    get().addLog(
      `${player.name} paid $50 to leave Jail`,
      'success',
      playerId
    );
  },

  useJailCard: (playerId) => {
    const state = get();
    const player = state.players.find(p => p.id === playerId);
    if (!player || !player.inJail || player.getOutOfJailCards <= 0) return;

    player.getOutOfJailCards -= 1;
    player.inJail = false;
    player.jailTurns = 0;

    set({ players: [...state.players] });
    get().addLog(
      `${player.name} used a Get Out of Jail Free card`,
      'success',
      playerId
    );
    if (playerId === get().myPlayerId) {
      get().addStat('jailFreeCardsUsed', 1);
    }
  },

  triggerDebt: (playerId: string, amount: number, creditorId: string) => {
    const state = get();
    set({
      turnState: {
        ...state.turnState,
        phase: 'DEBT',
        debtAmount: amount,
        creditorId,
      },
    });
  },

  payDebt: () => {
    const state = get();
    const currentPlayer = state.players[state.currentPlayerIndex];
    if (!currentPlayer || state.turnState.phase !== 'DEBT') return;

    const debt = state.turnState.debtAmount || 0;
    if (currentPlayer.money >= debt) {
      currentPlayer.money -= debt;
      const creditor = state.players.find(p => p.id === state.turnState.creditorId);
      if (creditor) {
        creditor.money += debt;
      }
      get().addLog(
        `${currentPlayer.name} paid $${debt}`,
        'success',
        currentPlayer.id
      );
      set({
        players: [...state.players],
        turnState: { ...state.turnState, phase: 'ACTION', debtAmount: 0, creditorId: null },
      });
    }
  },

   declareBankruptcy: (playerId) => {
    const state = get();
    const player = state.players.find(p => p.id === playerId);
    if (!player) return;

    player.bankrupt = true;
    const creditorId = state.turnState.creditorId;
    const creditor = state.players.find(p => p.id === creditorId);

    get().addLog(`${player.name} has gone bankrupt!`, 'error', player.id);

    if (creditorId !== 'BANK' && creditor) {
      creditor.money += Math.max(0, player.money);
      player.properties.forEach(propId => {
        if (creditor) creditor.properties.push(propId);
        const building = player.buildings.find(b => b.propertyId === propId);
        if (building) {
          if (building.hotel) {
            state.bankHotels += 1;
          } else {
            state.bankHouses += building.houses;
          }
        }
      });
      player.money = 0;
      player.properties = [];
      player.buildings = [];
      get().addLog(
        `All assets of ${player.name} were transferred to ${creditor.name}`,
        'success',
        creditor.id
      );
      set({ players: [...state.players], bankHouses: state.bankHouses, bankHotels: state.bankHotels });
    } else {
      player.properties.forEach(propId => {
        const building = player.buildings.find(b => b.propertyId === propId);
        if (building) {
          if (building.hotel) {
            state.bankHotels += 1;
          } else {
            state.bankHouses += building.houses;
          }
        }
      });
      player.money = 0;
      player.properties = [];
      player.buildings = [];
      get().addLog(
        `${player.name}'s properties were returned to the Bank`,
        'info'
      );
      set({ players: [...state.players], bankHouses: state.bankHouses, bankHotels: state.bankHotels });
    }

    const activePlayers = state.players.filter(p => !p.bankrupt);

     if (activePlayers.length === 1) {
      get().setWinner(activePlayers[0]);
      return;
    }

    get().endTurn();
    if (creditorId !== 'BANK' && creditor?.id === get().myPlayerId) {
      get().addStat('bankruptciesCaused', 1);
    }
    get().checkAchievements();
  },

  payIncomeTax: (fixed) => {
    const state = get();
    const currentPlayer = state.players[state.currentPlayerIndex];
    if (!currentPlayer || state.turnState.phase !== 'TAX_DECISION') return;

    if (fixed) {
      currentPlayer.money -= 200;
      get().addLog(`${currentPlayer.name} paid $200 Income Tax`, 'warning', currentPlayer.id);
    } else {
      const netWorth = calculateNetWorth(currentPlayer);
      const tax = Math.round(netWorth * 0.1);
      currentPlayer.money -= tax;
      get().addLog(`${currentPlayer.name} paid 10% (${tax}) Income Tax`, 'warning', currentPlayer.id);
    }

    set({
      players: [...state.players],
      turnState: { ...state.turnState, phase: 'ACTION' },
    });
  },

  drawChanceCard: () => {
    get().drawChanceCardInternal();
  },

  drawCommunityChestCard: () => {
    get().drawCommunityChestCardInternal();
  },

  drawChanceCardInternal: () => {
    const state = get();
    const currentPlayer = state.players[state.currentPlayerIndex];
    if (!currentPlayer) return;

    const card: Card = CHANCE_CARDS[Math.floor(Math.random() * CHANCE_CARDS.length)];
    get().resolveCard(card, currentPlayer);
  },

  drawCommunityChestCardInternal: () => {
    const state = get();
    const currentPlayer = state.players[state.currentPlayerIndex];
    if (!currentPlayer) return;

    const card: Card = COMMUNITY_CHEST_CARDS[Math.floor(Math.random() * COMMUNITY_CHEST_CARDS.length)];
    get().resolveCard(card, currentPlayer);
  },

  resolveCard: (card: Card, currentPlayer: Player) => {
    const state = get();
    set({ lastCard: card });
    get().addLog(
      `${currentPlayer.name} drew a ${card.type === 'CHANCE' ? 'Chance' : 'Community Chest'} card: "${card.title}"`,
      'action',
      currentPlayer.id
    );

    const oldPos = currentPlayer.position;
    const action = card.action as CardAction;
    handleCardAction(action, currentPlayer, state);

    if (
      action.type === 'MOVE_TO' &&
      currentPlayer.position !== oldPos &&
      currentPlayer.position < oldPos
    ) {
      currentPlayer.money += state.settings.goSalary;
      get().addLog(
        `${currentPlayer.name} passed GO and collected $${state.settings.goSalary}`,
        'success',
        currentPlayer.id
      );
    }

    if (action.type === 'GAIN_MONEY' || action.type === 'COLLECT_FROM_EACH_PLAYER') {
      const collected = action.type === 'GAIN_MONEY'
        ? action.amount
        : action.amount * (state.players.length - 1);
      get().addLog(
        `${currentPlayer.name} collected $${collected}`,
        'success',
        currentPlayer.id
      );
    }

    if (action.type === 'LOSE_MONEY' || action.type === 'PAY_EACH_PLAYER' || action.type === 'REPAIRS') {
      if (currentPlayer.money < 0) {
        const debt = -currentPlayer.money;
        currentPlayer.money = 0;
        get().triggerDebt(currentPlayer.id, debt, 'BANK');
        return;
      }
    }

    if (action.type === 'GO_TO_JAIL') {
      get().sendToJail(currentPlayer.id);
    }

    if (state.turnState.debtAmount && state.turnState.phase === 'DEBT') {
      return;
    }

    if (currentPlayer.money < 0) {
      const debt = -currentPlayer.money;
      currentPlayer.money = 0;
      get().triggerDebt(currentPlayer.id, debt, 'BANK');
      return;
    }

    const tile = BOARD_TILES[currentPlayer.position];
    if (tile.type === 'PROPERTY' || tile.type === 'RAILROAD' || tile.type === 'UTILITY') {
      const owner = state.players.find(p => p.properties.includes(tile.id));
      if (!owner) {
        set({
          players: [...state.players],
          turnState: { ...state.turnState, phase: 'ACTION' },
        });
      } else if (owner.id !== currentPlayer.id) {
        const rent = calculateRent(tile, owner, state.dice?.total || 7, get().mortgagedProperties, get().bankHouses, get().bankHotels);
        if (rent > 0) {
          get().payRent(currentPlayer.id, owner.id, rent);
          return;
        }
        set({
          players: [...state.players],
          turnState: { ...state.turnState, phase: 'ACTION' },
        });
      } else {
        set({
          players: [...state.players],
          turnState: { ...state.turnState, phase: 'ACTION' },
        });
      }
    } else {
      set({
        players: [...state.players],
        turnState: { ...state.turnState, phase: 'ACTION' },
      });
    }
  },

  endTurn: () => {
    const state = get();
    let nextIndex = (state.currentPlayerIndex + 1) % state.players.length;
    let count = 0;

    while (state.players[nextIndex].bankrupt && count < state.players.length) {
      nextIndex = (nextIndex + 1) % state.players.length;
      count++;
    }

    const nextPlayer = state.players[nextIndex];

    set({
      currentPlayerIndex: nextIndex,
      turnNumber: state.turnNumber + 1,
      dice: null,
      turnState: {
        phase: 'ROLL',
        hasRolled: false,
        canRollAgain: false,
        doublesRolled: 0,
        pendingActionTileId: null,
        debtAmount: 0,
        creditorId: null,
      },
      players: state.players.map((p, i) => ({
        ...p,
        isCurrentPlayer: i === nextIndex,
      })),
    });

    get().addLog(`It's now ${nextPlayer.name}'s turn`, 'info', nextPlayer.id);
  },

  addLog: (message, type = 'info', playerId) => {
    const log: GameLog = {
      id: generateId(),
      message,
      type,
      timestamp: Date.now(),
      playerId,
    };
    set((state) => ({
      logs: [log, ...state.logs].slice(0, 100),
      lastAction: message,
    }));
  },

  setTrade: (trade) => set({ trade }),

  proposeTrade: (trade) => {
    const state = get();
    if (state.roomCode === null) {
      const currentPlayer = state.players[state.currentPlayerIndex];
      if (trade.fromPlayerId !== currentPlayer?.id) {
        get().addLog('Only the current player can send a trade', 'error');
        return;
      }
    }

    const validation = validateTrade(trade, state.players);
    if (!validation.valid) {
      get().addLog(validation.error || 'Invalid trade', 'error');
      return;
    }

    const tradeWithMeta = {
      ...trade,
      id: generateId(),
      status: 'pending' as const,
      createdAt: Date.now(),
    };

    set({ trade: tradeWithMeta });

    const notification = {
      id: generateId(),
      tradeId: tradeWithMeta.id,
      recipientId: trade.toPlayerId,
      senderId: trade.fromPlayerId,
      status: 'pending' as const,
      createdAt: Date.now(),
    };

    set((state) => ({
      tradeNotifications: [...state.tradeNotifications, notification],
    }));

    get().addLog('Trade proposed', 'info');
  },

  acceptTrade: () => {
    const state = get();
    const trade = state.trade;
    if (!trade || trade.status !== 'pending') return;

    if (state.roomCode === null) {
      const currentPlayer = state.players[state.currentPlayerIndex];
      if (trade.toPlayerId !== currentPlayer?.id) {
        get().addLog('Only the recipient on their turn can accept a trade', 'error');
        return;
      }
    }

    const fromPlayer = state.players.find(p => p.id === trade.fromPlayerId);
    const toPlayer = state.players.find(p => p.id === trade.toPlayerId);

    if (!fromPlayer || !toPlayer) return;

    if (fromPlayer.money < trade.offeredMoney) {
      get().addLog('Trade failed: sender no longer has enough money', 'error');
      set({ trade: null, tradeNotifications: state.tradeNotifications.filter(n => n.tradeId !== trade.id) });
      return;
    }
    if (toPlayer.money < trade.requestedMoney) {
      get().addLog('Trade failed: recipient no longer has enough money', 'error');
      set({ trade: null, tradeNotifications: state.tradeNotifications.filter(n => n.tradeId !== trade.id) });
      return;
    }

    for (const propId of trade.offeredProperties) {
      if (!fromPlayer.properties.includes(propId)) {
        get().addLog('Trade failed: offered property no longer owned by sender', 'error');
        set({ trade: null, tradeNotifications: state.tradeNotifications.filter(n => n.tradeId !== trade.id) });
        return;
      }
    }

    for (const propId of trade.requestedProperties) {
      if (!toPlayer.properties.includes(propId)) {
        get().addLog('Trade failed: requested property no longer owned by recipient', 'error');
        set({ trade: null, tradeNotifications: state.tradeNotifications.filter(n => n.tradeId !== trade.id) });
        return;
      }
    }

    fromPlayer.money -= trade.offeredMoney;
    fromPlayer.money += trade.requestedMoney;
    toPlayer.money += trade.offeredMoney;
    toPlayer.money -= trade.requestedMoney;

    trade.offeredProperties.forEach(propId => {
      fromPlayer.properties = fromPlayer.properties.filter(id => id !== propId);
      toPlayer.properties.push(propId);

      const building = fromPlayer.buildings.find(b => b.propertyId === propId);
      if (building) {
        const idx = fromPlayer.buildings.findIndex(b => b.propertyId === propId);
        fromPlayer.buildings.splice(idx, 1);
        toPlayer.buildings.push(building);
      }
    });

    trade.requestedProperties.forEach(propId => {
      toPlayer.properties = toPlayer.properties.filter(id => id !== propId);
      fromPlayer.properties.push(propId);

      const building = toPlayer.buildings.find(b => b.propertyId === propId);
      if (building) {
        const idx = toPlayer.buildings.findIndex(b => b.propertyId === propId);
        toPlayer.buildings.splice(idx, 1);
        fromPlayer.buildings.push(building);
      }
    });

    get().addLog(
      `Trade completed: ${fromPlayer.name} and ${toPlayer.name} exchanged assets`,
      'success'
    );
    set({ trade: null, players: [...state.players], tradeNotifications: state.tradeNotifications.filter(n => n.tradeId !== trade.id) });
    get().addStat('tradesMade', 1);
    get().checkAchievements();
  },

  rejectTrade: () => {
    const state = get();
    const trade = state.trade;
    if (!trade) return;

    if (state.roomCode === null) {
      const currentPlayer = state.players[state.currentPlayerIndex];
      if (trade.toPlayerId !== currentPlayer?.id) {
        get().addLog('Only the recipient on their turn can reject a trade', 'error');
        return;
      }
    }

    const sender = state.players.find(p => p.id === trade.fromPlayerId);
    get().addLog(
      trade.toPlayerId === state.players[state.currentPlayerIndex]?.id
        ? 'Trade rejected'
        : `${sender?.name || 'Player'}'s trade was rejected`,
      'info'
    );
    set({ trade: null, tradeNotifications: state.tradeNotifications.filter(n => n.tradeId !== trade.id) });
  },

  waitTrade: () => {
    const state = get();
    const trade = state.trade;
    if (!trade) return;

    if (state.roomCode === null) {
      const currentPlayer = state.players[state.currentPlayerIndex];
      if (trade.toPlayerId !== currentPlayer?.id) {
        get().addLog('Only the recipient on their turn can respond to a trade', 'error');
        return;
      }
    }

    set((state) => ({
      tradeNotifications: state.tradeNotifications.map(n =>
        n.tradeId === trade.id ? { ...n, status: 'viewed' as const } : n
      ),
    }));
  },

  cancelTrade: () => {
    const state = get();
    const trade = state.trade;
    if (trade) {
      get().addLog('Trade cancelled', 'info');
      set({ trade: null, tradeNotifications: state.tradeNotifications.filter(n => n.tradeId !== trade.id) });
    }
  },

  counterTrade: (tradeId, counterOffer) => {
    const state = get();
    const trade = state.trade;
    if (!trade || trade.status !== 'pending' || trade.id !== tradeId) return;

    if (state.roomCode === null) {
      const currentPlayer = state.players[state.currentPlayerIndex];
      if (trade.toPlayerId !== currentPlayer?.id) {
        get().addLog('Only the current recipient can counter a trade', 'error');
        return;
      }
    }

    const currentRecipient = state.players.find(p => p.id === trade.toPlayerId);
    const newSender = state.players.find(p => p.id === trade.fromPlayerId);
    if (!currentRecipient || !newSender) return;

    const offeredProperties = counterOffer.offeredPropertyIds || [];
    const requestedProperties = counterOffer.requestedPropertyIds || [];
    const offeredMoney = counterOffer.offeredMoney || 0;
    const requestedMoney = counterOffer.requestedMoney || 0;

    const recipientOwnsOffered = offeredProperties.every(id => currentRecipient.properties.includes(id));
    const senderOwnsRequested = requestedProperties.every(id => newSender.properties.includes(id));
    if (!recipientOwnsOffered || !senderOwnsRequested) {
      get().addLog('Invalid counter-trade: one player no longer owns offered assets', 'error');
      return;
    }

    if (currentRecipient.money < offeredMoney) {
      get().addLog('Invalid counter-trade: insufficient funds', 'error');
      return;
    }
    if (newSender.money < requestedMoney) {
      get().addLog('Invalid counter-trade: recipient cannot afford requested assets', 'error');
      return;
    }

    const counterTradeOffer = {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`,
      fromPlayerId: currentRecipient.id,
      toPlayerId: newSender.id,
      offeredProperties,
      requestedProperties,
      offeredMoney,
      requestedMoney,
      status: 'pending' as const,
      createdAt: Date.now(),
      revision: (trade.revision || 1) + 1,
      previousTradeId: trade.id,
    };

    set({ trade: counterTradeOffer });
    get().addLog(`${currentRecipient.name} sent a counter-offer to ${newSender.name}`, 'action', currentRecipient.id);
  },

   startAuction: (tileId) => {
     const state = get();
     if (state.auction && state.auction.status === 'active') return;

     const currentPlayer = state.players[state.currentPlayerIndex];
     if (!currentPlayer) return;

     const activePlayers = state.players.filter(p => !p.bankrupt);
     if (activePlayers.length < 3) {
       get().addLog('Auction requires at least 3 active players', 'warning');
       return;
     }

     const activeBidders = state.players.filter(p => !p.bankrupt && p.id !== currentPlayer.id).map(p => p.id);

     set({
       auction: {
         id: generateId(),
         tileId,
         propertyName: BOARD_TILES[tileId]?.name || `Tile ${tileId}`,
         currentBid: 10,
         highestBidderId: null,
         activeBidders,
         startedBy: currentPlayer.id,
         bids: [],
         status: 'active',
         turnIndex: 0,
         timeLeft: 30,
       },
       turnState: { ...state.turnState, phase: 'AUCTION' },
     });
     get().addLog(`Auction started for ${BOARD_TILES[tileId]?.name || `tile ${tileId}`}!`, 'info');
   },

   placeBid: (playerId, bidAmount) => {
     const state = get();
     const auction = state.auction;
     if (!auction || auction.status !== 'active') return false;
     if (auction.startedBy === playerId) return false;

     const player = state.players.find(p => p.id === playerId);
     if (!player || player.money < bidAmount || bidAmount <= auction.currentBid) return false;

     const minBid = auction.currentBid + 10;
     const finalBid = Math.max(bidAmount, minBid);

     set({
       auction: {
         ...auction,
         currentBid: finalBid,
         highestBidderId: playerId,
         bids: [...auction.bids, { playerId, amount: finalBid, timestamp: Date.now() }],
         turnIndex: (auction.activeBidders.indexOf(playerId) + 1) % auction.activeBidders.length,
       },
     });
     get().addLog(`${player.name} bid $${finalBid}`, 'info', player.id);
     return true;
   },

   passBid: (playerId) => {
     const state = get();
     const auction = state.auction;
     if (!auction || auction.status !== 'active') return false;
     const index = auction.activeBidders.indexOf(playerId);
     if (index === -1) return false;

     const newActiveBidders = auction.activeBidders.filter(id => id !== playerId);
     get().addLog(`${state.players.find(p => p.id === playerId)?.name} passed in auction`, 'info', playerId);

     if (newActiveBidders.length === 0) {
       get().completeAuction();
     } else if (newActiveBidders.length === 1 && auction.highestBidderId) {
       get().completeAuction();
     } else {
       set({
         auction: {
           ...auction,
           activeBidders: newActiveBidders,
           turnIndex: auction.turnIndex % newActiveBidders.length,
         },
       });
     }
     return true;
   },

   completeAuction: () => {
     const state = get();
     const auction = state.auction;
     if (!auction || auction.status === 'completed') return;

     const tile = BOARD_TILES.find(t => t.id === auction.tileId);
     const starterId = auction.startedBy;
     const winnerId = auction.highestBidderId;
     const winningBid = auction.currentBid;

     let updatedPlayers = state.players;
     let logMessages: Array<{ message: string; type: GameLog['type']; playerId?: string }> = [];

     if (winnerId && tile && winningBid > 0) {
       const winner = state.players.find(p => p.id === winnerId);
       const starter = state.players.find(p => p.id === starterId);

       if (winner && winner.money >= winningBid) {
         const commission = Math.round(winningBid * 0.05);
         updatedPlayers = state.players.map(p => {
           if (p.id === winnerId && p.id === starterId) {
             return { ...p, money: p.money - winningBid + commission, properties: [...p.properties, tile.id] };
           }
           if (p.id === winnerId) {
             return { ...p, money: p.money - winningBid, properties: [...p.properties, tile.id] };
           }
           if (p.id === starterId) {
             return { ...p, money: p.money + commission };
           }
           return p;
         });
         logMessages.push({ message: `${winner.name} won the auction for ${tile.name} at $${winningBid}!`, type: 'success', playerId: winner.id });
         if (starter) {
           logMessages.push({ message: `${starter.name} received $${commission} commission as auction starter`, type: 'info', playerId: starter.id });
         }
       } else if (winner) {
         logMessages.push({ message: `Winner ${winner.name} cannot afford the bid. Property remains unowned.`, type: 'warning' });
       }
     } else if (winningBid === 0 || !winnerId) {
       logMessages.push({ message: `Auction ended with no bids. Property remains unowned.`, type: 'info' });
     }

     logMessages.forEach(log => get().addLog(log.message, log.type, log.playerId));

      set({
        players: updatedPlayers,
        auction: {
          ...auction,
          status: 'completed',
          winnerId,
          winningBid,
        },
        turnState: { ...state.turnState, phase: 'ACTION' },
      });

      setTimeout(() => {
        const currentState = get();
        if (currentState.auction && currentState.auction.status === 'completed') {
          set({ auction: null });
        }
      }, 5000);
    },

  setWinner: (player) => {
    set({ winner: player, phase: 'ENDED' });
    get().addLog(`${player.name} wins the game!`, 'success', player.id);
    get().addStat('gamesWon', 1);
    get().checkAchievements();
  },

  updateSettings: (settings) => set((state) => ({
    settings: { ...state.settings, ...settings },
  })),

  resetGame: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('estate-empire-storage');
    }
    set({
      ...initialState,
      gameId: generateId(),
      roomCode: null,
      myPlayerId: null,
      settings: get().settings,
      chatMessages: [],
      isStoreOpen: false,
    });
  },

  startGame: () => {
    const state = get();
    if (state.players.length < 2) return;

    set({
      phase: 'PLAYING',
      currentPlayerIndex: 0,
      turnNumber: 1,
      players: state.players.map((p, i) => ({
        ...p,
        isCurrentPlayer: i === 0,
      })),
      playerStats: { ...state.playerStats, gamesPlayed: state.playerStats.gamesPlayed + 1 },
    });

    get().addLog('Game started!', 'success');
    get().checkAchievements();
  },

   setTurnState: (turnState) => set((state) => ({
    turnState: { ...state.turnState, ...turnState },
  })),

  playerStats: {
    gamesPlayed: 0,
    gamesWon: 0,
    totalMoneyEarned: 0,
    propertiesPurchased: 0,
    rentCollected: 0,
    housesBuilt: 0,
    hotelsBuilt: 0,
    tradesMade: 0,
    bankruptciesCaused: 0,
    jailFreeCardsUsed: 0,
    powerUpsCollected: 0,
    powerUpsUsed: 0,
  },
  achievements: DEFAULT_ACHIEVEMENTS,
  powerUps: [],

  addStat: (key, amount = 1) => set((state) => ({
    playerStats: { ...state.playerStats, [key]: state.playerStats[key] + amount },
  })),

  checkAchievements: () => set((state) => {
    const stats = state.playerStats;
    const updated = state.achievements.map(a => {
      if (!a.unlocked && a.condition(stats)) {
        return { ...a, unlocked: true, unlockedAt: Date.now() };
      }
      return a;
    });
    return { achievements: updated };
  }),

  collectPowerUp: (type) => set((state) => {
    const def = POWER_UP_DEFS[type];
    const newPowerUp: PowerUp = {
      id: generateId(),
      type,
      name: def.name,
      description: def.description,
      icon: def.icon,
      collectedAt: Date.now(),
      used: false,
    };
    return {
      powerUps: [...state.powerUps, newPowerUp],
      playerStats: { ...state.playerStats, powerUpsCollected: state.playerStats.powerUpsCollected + 1 },
    };
  }),

  usePowerUp: (powerUpId) => {
    set((state) => ({
      powerUps: state.powerUps.map(p => p.id === powerUpId ? { ...p, used: true } : p),
      playerStats: { ...state.playerStats, powerUpsUsed: state.playerStats.powerUpsUsed + 1 },
    }));
    get().checkAchievements();
  },

  addChatMessage: (message, playerId) => {
    const player = get().players.find(p => p.id === playerId);
    const newMessage: ChatMessage = {
      id: generateId(),
      playerName: player?.name || 'Unknown',
      playerId,
      message,
      timestamp: Date.now(),
      isOwnMessage: playerId === 'you',
    };
    set((state) => ({
      chatMessages: [newMessage, ...state.chatMessages],
    }));
  },
  }),
  {
    name: 'estate-empire-storage',
    partialize: (state) => ({
      roomCode: state.roomCode,
      myPlayerId: state.myPlayerId,
      playerStats: state.playerStats,
      achievements: state.achievements,
      powerUps: state.powerUps,
    }),
  }
));

function validateTrade(trade: TradeOffer, players: Player[]): { valid: boolean; error?: string } {
  const fromPlayer = players.find(p => p.id === trade.fromPlayerId);
  const toPlayer = players.find(p => p.id === trade.toPlayerId);

  if (!fromPlayer || !toPlayer) {
    return { valid: false, error: 'Player not found' };
  }

  if (trade.offeredMoney > fromPlayer.money) {
    return { valid: false, error: 'Insufficient funds for offered money' };
  }

  if (trade.requestedMoney > toPlayer.money) {
    return { valid: false, error: 'Target player cannot afford requested money' };
  }

  for (const propId of trade.offeredProperties) {
    if (!fromPlayer.properties.includes(propId)) {
      return { valid: false, error: 'Offered property not owned by sender' };
    }
  }

  for (const propId of trade.requestedProperties) {
    if (!toPlayer.properties.includes(propId)) {
      return { valid: false, error: 'Requested property not owned by target' };
    }
  }

  return { valid: true };
}
