export type TileType =
  | 'GO'
  | 'PROPERTY'
  | 'COMMUNITY_CHEST'
  | 'CHANCE'
  | 'TAX'
  | 'RAILROAD'
  | 'UTILITY'
  | 'JAIL'
  | 'FREE_PARKING'
  | 'GO_TO_JAIL';

export type ColorGroup =
  | 'brown'
  | 'lightblue'
  | 'pink'
  | 'orange'
  | 'red'
  | 'yellow'
  | 'green'
  | 'darkblue';

export type Country = string;

export interface CountryInfo {
  id: string;
  name: string;
  flag: string;
  color: string;
  properties: number[];
}

export interface RentStructure {
  base: number;
  oneHouse: number;
  twoHouses: number;
  threeHouses: number;
  fourHouses: number;
  hotel: number;
}

export type TaxType = 'income' | 'luxury';

export interface BoardTile {
  id: number;
  position: number;
  name: string;
  type: TileType;
  price?: number;
  rent?: number | RentStructure;
  colorGroup?: ColorGroup;
  country?: Country;
  color?: string;
  houseCost?: number;
  hotelCost?: number;
  mortgageValue?: number;
  taxAmount?: number;
  taxType?: TaxType;
  utilityMultiplier?: { one: number; two: number };
  countryName?: string;
}

export interface Building {
  propertyId: number;
  houses: number;
  hotel: boolean;
}

export type AvatarType = 'custom' | 'default' | 'initials';

export interface Player {
  id: string;
  name: string;
  avatarType: AvatarType;
  avatarUrl?: string;
  defaultCharacterId?: string;
  tokenId: string;
  money: number;
  position: number;
  properties: number[];
  buildings: Building[];
  inJail: boolean;
  jailTurns: number;
  getOutOfJailCards: number;
  bankrupt: boolean;
  isCurrentPlayer: boolean;
  connected: boolean;
  doublesCount: number;
  isBot?: boolean;
  isHost?: boolean;
  isReady?: boolean;
  teamId?: string | null;
  timeReserve?: number;
}

export interface DiceResult {
  die1: number;
  die2: number;
  isDouble: boolean;
  total: number;
}

export interface Card {
  id: string;
  type: 'CHANCE' | 'COMMUNITY_CHEST';
  title: string;
  description: string;
  action: CardAction;
}

export type CardAction =
  | { type: 'GAIN_MONEY'; amount: number }
  | { type: 'LOSE_MONEY'; amount: number }
  | { type: 'MOVE_TO'; position: number }
  | { type: 'MOVE_RELATIVE'; spaces: number }
  | { type: 'GO_TO_JAIL' }
  | { type: 'GET_OUT_OF_JAIL' }
  | { type: 'PAY_EACH_PLAYER'; amount: number }
  | { type: 'COLLECT_FROM_EACH_PLAYER'; amount: number }
  | { type: 'REPAIRS'; houseCost: number; hotelCost: number };

export interface TradeOffer {
  id: string;
  fromPlayerId: string;
  toPlayerId: string;
  offeredProperties: number[];
  requestedProperties: number[];
  offeredMoney: number;
  requestedMoney: number;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'expired';
  createdAt: number;
}

export interface AuctionState {
  id: string;
  tileId: number;
  propertyName: string;
  currentBid: number;
  highestBidderId: string | null;
  activeBidders: string[];
  startedBy: string;
  bids: Array<{
    playerId: string;
    amount: number;
    timestamp: number;
  }>;
  status: 'idle' | 'active' | 'completed';
  turnIndex: number;
  startingBid?: number;
  timeLeft?: number;
  winnerId?: string | null;
  winningBid?: number;
}

export interface Transaction {
  id: string;
  fromPlayerId: string | 'BANK';
  toPlayerId: string | 'BANK';
  amount: number;
  reason: string;
  timestamp: number;
}

export interface TradeNotification {
  id: string;
  tradeId: string;
  recipientId: string;
  senderId: string;
  status: 'pending' | 'viewed' | 'responded';
  createdAt: number;
}

export interface GameLog {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'action';
  timestamp: number;
  playerId?: string;
}

export interface ChatMessage {
  id: string;
  playerName: string;
  playerId: string;
  message: string;
  timestamp: number;
  isOwnMessage: boolean;
}

export interface GameSettings {
  startingMoney: number;
  goSalary: number;
  maxPlayers: number;
  freeParkingReward: boolean;
  freeParkingAmount: number;
  auctionEnabled: boolean;
  turnTimer: number;
  turnTimerSeconds?: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  animationsEnabled: boolean;
  doublesInJail: boolean;
  maxDoublesBeforeJail: number;
  evenBuild?: boolean;
  teamsEnabled?: boolean;
  teamCount?: number;
  bankruptcyAutoEliminate?: boolean;
}

export type GamePhase = 'SETUP' | 'LOBBY' | 'PLAYING' | 'ENDED';

export type TurnStateMachine =
  | 'WAITING'
  | 'ROLLING'
  | 'MOVING'
  | 'RESOLVING'
  | 'PROPERTY_ACTION'
  | 'BUILDING'
  | 'TRADING'
  | 'DEBT'
  | 'TAX_DECISION'
  | 'END_TURN'
  | 'GAME_OVER';

export type TurnState = {
  phase:
    | 'ROLL'
    | 'ACTION'
    | 'DEBT'
    | 'BUILDING'
    | 'TRADE'
    | 'TAX_DECISION'
    | 'END_TURN'
    | 'AUCTION';
  hasRolled: boolean;
  canRollAgain: boolean;
  doublesRolled: number;
  pendingActionTileId?: number | null;
  debtAmount?: number | null;
  creditorId?: string | null;
  turnClock?: number;
  turnStartTime?: number;
  stateMachine?: TurnStateMachine;
}

export interface GameState {
  gameId: string;
  roomCode: string | null;
  myPlayerId: string | null;
  phase: GamePhase;
  players: Player[];
  currentPlayerIndex: number;
  board: BoardTile[];
  bankHouses: number;
  bankHotels: number;
  mortgagedProperties: number[];
  turnNumber: number;
  dice: DiceResult | null;
  turnState: TurnState;
  auction: AuctionState | null;
  winner: Player | null;
  settings: GameSettings;
  trade: TradeOffer | null;
  tradeNotifications: TradeNotification[];
  logs: GameLog[];
  lastAction: string | null;
  lastCard: Card | null;
  chatMessages: ChatMessage[];
  isStoreOpen: boolean;
  transactions: Transaction[];
  turnStartTime?: number;
}

export interface DefaultCharacter {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  icon: string;
}

export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  totalMoneyEarned: number;
  propertiesPurchased: number;
  rentCollected: number;
  housesBuilt: number;
  hotelsBuilt: number;
  tradesMade: number;
  bankruptciesCaused: number;
  jailFreeCardsUsed: number;
  powerUpsCollected: number;
  powerUpsUsed: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  condition: (stats: PlayerStats) => boolean;
}

export type PowerUpType = 'extra-turn' | 'double-rent' | 'free-property' | 'steal-cash';

export interface PowerUp {
  id: string;
  type: PowerUpType;
  name: string;
  description: string;
  icon: string;
  collectedAt: number;
  used: boolean;
}
