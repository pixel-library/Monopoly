import { DiceResult, Player, BoardTile, GameLog, Card, TradeOffer, CardAction } from '../types';
import { BOARD_TILES } from '../data/boardData';

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function rollDice(): DiceResult {
  const die1 = Math.floor(Math.random() * 6) + 1;
  const die2 = Math.floor(Math.random() * 6) + 1;
  return {
    die1,
    die2,
    isDouble: die1 === die2,
    total: die1 + die2,
  };
}

export function calculateNewPosition(currentPosition: number, spaces: number): number {
  return (currentPosition + spaces) % 40;
}

export function hasPassedGO(currentPosition: number, newPosition: number, spaces?: number): boolean {
  if (spaces !== undefined) {
    return (currentPosition + spaces) >= 40;
  }
  return newPosition < currentPosition;
}

export function getTileAtPosition(position: number): BoardTile {
  return BOARD_TILES[position];
}

export function calculateRent(
  tile: BoardTile,
  owner: Player,
  diceTotal?: number,
  mortgagedProperties?: number[],
  bankHouses?: number,
  bankHotels?: number
): number {
  if (!tile.rent) return 0;

  const isMortgaged = mortgagedProperties?.includes(tile.id) ?? false;
  if (isMortgaged) return 0;

  if (tile.type === 'RAILROAD') {
    const railroadCount = owner.properties.filter(id => {
      const prop = BOARD_TILES.find(t => t.id === id);
      return prop?.type === 'RAILROAD' && !(mortgagedProperties?.includes(id) ?? false);
    }).length;
    const rentLevels = [25, 50, 100, 200];
    return rentLevels[Math.min(railroadCount - 1, 3)] || 25;
  }

  if (tile.type === 'UTILITY') {
    const utilityCount = owner.properties.filter(id => {
      const prop = BOARD_TILES.find(t => t.id === id);
      return prop?.type === 'UTILITY' && !(mortgagedProperties?.includes(id) ?? false);
    }).length;
    const multiplier = utilityCount === 2 ? 10 : 4;
    return (diceTotal || 7) * multiplier;
  }

  if (typeof tile.rent === 'object' && 'base' in tile.rent) {
    const rentStructure = tile.rent;
    const building = owner.buildings.find(b => b.propertyId === tile.id);

    if (building?.hotel) return rentStructure.hotel;
    if (building && building.houses > 0) {
      const houseRents = [
        rentStructure.oneHouse,
        rentStructure.twoHouses,
        rentStructure.threeHouses,
        rentStructure.fourHouses,
      ];
      return houseRents[Math.min(building.houses - 1, 3)];
    }

    const ownsAll = ownsCompleteGroup(owner, tile);
    return ownsAll ? rentStructure.base * 2 : rentStructure.base;
  }

  return typeof tile.rent === 'number' ? tile.rent : 0;
}

export function getGroupKey(tile: BoardTile): string | undefined {
  return tile.country || tile.colorGroup;
}

export function ownsCompleteColorGroup(player: Player, colorGroup: string): boolean {
  const groupTiles = BOARD_TILES.filter(t => t.colorGroup === colorGroup);
  return groupTiles.every(tile => player.properties.includes(tile.id));
}

export function ownsCompleteCountry(player: Player, country: string, board: BoardTile[] = BOARD_TILES): boolean {
  const groupTiles = board.filter(t => t.country === country);
  return groupTiles.every(tile => player.properties.includes(tile.id));
}

export function ownsCompleteGroup(player: Player, tile: BoardTile, board: BoardTile[] = BOARD_TILES): boolean {
  return tile.country
    ? ownsCompleteCountry(player, tile.country, board)
    : tile.colorGroup ? ownsCompleteColorGroup(player, tile.colorGroup) : false;
}

export function getCountryProperties(country: string, board: BoardTile[] = BOARD_TILES): BoardTile[] {
  return board.filter(t => t.country === country);
}

export function getCountryCompletion(player: Player, country: string, board: BoardTile[] = BOARD_TILES): number {
  const groupTiles = getCountryProperties(country, board);
  return groupTiles.filter(tile => player.properties.includes(tile.id)).length;
}

export function getColorGroupTiles(colorGroup: string): BoardTile[] {
  return BOARD_TILES.filter(t => t.colorGroup === colorGroup);
}

export function canBuyHouse(
  player: Player,
  tile: BoardTile,
  mortgagedProperties: number[] = []
): boolean {
  if (!tile.houseCost) return false;
  if (!ownsCompleteGroup(player, tile)) return false;

  const groupTiles = tile.country
    ? getCountryProperties(tile.country)
    : getColorGroupTiles(tile.colorGroup!);
  if (groupTiles.some(t => mortgagedProperties.includes(t.id))) return false;

  const building = player.buildings.find(b => b.propertyId === tile.id);
  const currentHouses = building?.houses || 0;

  if (building?.hotel) return false;
  if (currentHouses >= 4) return false;

  const minHouses = Math.min(
    ...groupTiles.map(t => {
      const b = player.buildings.find(b => b.propertyId === t.id);
      return b?.hotel ? 5 : (b?.houses || 0);
    })
  );

  return currentHouses <= minHouses;
}

export function canBuyHotel(
  player: Player,
  tile: BoardTile,
  mortgagedProperties: number[] = []
): boolean {
  if (!tile.houseCost) return false;
  if (!ownsCompleteGroup(player, tile)) return false;

  const groupTiles = tile.country
    ? getCountryProperties(tile.country)
    : getColorGroupTiles(tile.colorGroup!);
  if (groupTiles.some(t => mortgagedProperties.includes(t.id))) return false;

  const building = player.buildings.find(b => b.propertyId === tile.id);
  return building?.houses === 4 && !building.hotel;
}

export function calculateNetWorth(player: Player): number {
  let worth = player.money;

  for (const propId of player.properties) {
    const tile = BOARD_TILES.find(t => t.id === propId);
    if (tile?.price) {
      worth += tile.price;
      const building = player.buildings.find(b => b.propertyId === propId);
      if (building) {
        worth += building.houses * (tile.houseCost || 0);
        if (building.hotel) worth += tile.houseCost || 0;
      }
    }
  }

  return worth;
}

export function createLog(message: string, type: GameLog['type'] = 'info', playerId?: string): GameLog {
  return {
    id: generateId(),
    message,
    type,
    timestamp: Date.now(),
    playerId,
  };
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function drawCard(cards: Card[]): Card {
  return cards[Math.floor(Math.random() * cards.length)];
}

export function validateTrade(trade: TradeOffer, players: Player[]): { valid: boolean; error?: string } {
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

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function handleCardAction(
  action: CardAction,
  currentPlayer: Player,
  state: { players: Player[]; board: BoardTile[] }
): void {
  switch (action.type) {
    case 'GAIN_MONEY':
      currentPlayer.money += action.amount;
      break;
    case 'LOSE_MONEY':
      currentPlayer.money -= action.amount;
      break;
    case 'MOVE_TO':
      currentPlayer.position = action.position;
      break;
    case 'MOVE_RELATIVE':
      currentPlayer.position = calculateNewPosition(currentPlayer.position, action.spaces);
      break;
    case 'GO_TO_JAIL':
      currentPlayer.inJail = true;
      currentPlayer.position = 10;
      currentPlayer.jailTurns = 0;
      break;
    case 'GET_OUT_OF_JAIL':
      currentPlayer.getOutOfJailCards += 1;
      break;
    case 'PAY_EACH_PLAYER': {
      const payAmount = action.amount * (state.players.length - 1);
      currentPlayer.money -= payAmount;
      state.players.forEach(p => {
        if (p.id !== currentPlayer.id) p.money += action.amount;
      });
      break;
    }
    case 'COLLECT_FROM_EACH_PLAYER': {
      const collectAmount = action.amount * (state.players.length - 1);
      currentPlayer.money += collectAmount;
      state.players.forEach(p => {
        if (p.id !== currentPlayer.id) p.money -= action.amount;
      });
      break;
    }
    case 'REPAIRS': {
      let repairCost = 0;
      currentPlayer.buildings.forEach(b => {
        repairCost += b.houses * action.houseCost;
        if (b.hotel) repairCost += action.hotelCost;
      });
      currentPlayer.money -= repairCost;
      break;
    }
  }
}
