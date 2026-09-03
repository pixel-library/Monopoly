// Server-Authoritative Game Engine for Estate Empire (ES Modules)

export const COUNTRIES = [
  { id: 'india', name: 'India', color: '#DC1B1B' },
  { id: 'brazil', name: 'Brazil', color: '#009C39' },
  { id: 'japan', name: 'Japan', color: '#BC0020' },
  { id: 'germany', name: 'Germany', color: '#FF8C00' },
  { id: 'france', name: 'France', color: '#002395' },
  { id: 'korea', name: 'Korea', color: '#C60C30' },
  { id: 'canada', name: 'Canada', color: '#FF0000' },
  { id: 'australia', name: 'Australia', color: '#00205B' },
];

export const CHANCE_CARDS = [
  { id: 'chance-1', type: 'CHANCE', title: 'Advance to GO', description: 'Collect $200', action: { type: 'MOVE_TO', position: 0 } },
  { id: 'chance-2', type: 'CHANCE', title: 'Advance to Marseille', description: 'If you pass GO, collect $200', action: { type: 'MOVE_TO', position: 24 } },
  { id: 'chance-3', type: 'CHANCE', title: 'Advance to Tokyo', description: 'If you pass GO, collect $200', action: { type: 'MOVE_TO', position: 11 } },
  { id: 'chance-4', type: 'CHANCE', title: 'Bank Pays Dividend', description: 'Collect $50', action: { type: 'GAIN_MONEY', amount: 50 } },
  { id: 'chance-5', type: 'CHANCE', title: 'Get Out of Jail Free', description: 'Keep this card until needed', action: { type: 'GET_OUT_OF_JAIL' } },
  { id: 'chance-6', type: 'CHANCE', title: 'Go Back 3 Spaces', description: '', action: { type: 'MOVE_RELATIVE', spaces: -3 } },
  { id: 'chance-7', type: 'CHANCE', title: 'Go to Jail', description: 'Do not pass GO, do not collect $200', action: { type: 'GO_TO_JAIL' } },
  { id: 'chance-8', type: 'CHANCE', title: 'Make General Repairs', description: 'Pay $25 per house, $100 per hotel', action: { type: 'REPAIRS', houseCost: 25, hotelCost: 100 } },
  { id: 'chance-9', type: 'CHANCE', title: 'Speeding Fine', description: 'Pay $15', action: { type: 'LOSE_MONEY', amount: 15 } },
  { id: 'chance-10', type: 'CHANCE', title: 'Advance to Melbourne', description: '', action: { type: 'MOVE_TO', position: 39 } },
  { id: 'chance-11', type: 'CHANCE', title: 'Pay Each Player', description: 'Pay each player $50', action: { type: 'PAY_EACH_PLAYER', amount: 50 } },
  { id: 'chance-12', type: 'CHANCE', title: 'Building Loan Matures', description: 'Collect $150', action: { type: 'GAIN_MONEY', amount: 150 } },
];

export const COMMUNITY_CHEST_CARDS = [
  { id: 'cc-1', type: 'COMMUNITY_CHEST', title: 'Advance to GO', description: 'Collect $200', action: { type: 'MOVE_TO', position: 0 } },
  { id: 'cc-2', type: 'COMMUNITY_CHEST', title: 'Bank Error in Your Favor', description: 'Collect $200', action: { type: 'GAIN_MONEY', amount: 200 } },
  { id: 'cc-3', type: 'COMMUNITY_CHEST', title: "Doctor's Fee", description: 'Pay $50', action: { type: 'LOSE_MONEY', amount: 50 } },
  { id: 'cc-4', type: 'COMMUNITY_CHEST', title: 'From Sale of Stock', description: 'Collect $50', action: { type: 'GAIN_MONEY', amount: 50 } },
  { id: 'cc-5', type: 'COMMUNITY_CHEST', title: 'Get Out of Jail Free', description: 'Keep this card until needed', action: { type: 'GET_OUT_OF_JAIL' } },
  { id: 'cc-6', type: 'COMMUNITY_CHEST', title: 'Go to Jail', description: '', action: { type: 'GO_TO_JAIL' } },
  { id: 'cc-7', type: 'COMMUNITY_CHEST', title: 'Holiday Fund Matures', description: 'Collect $100', action: { type: 'GAIN_MONEY', amount: 100 } },
  { id: 'cc-8', type: 'COMMUNITY_CHEST', title: 'Income Tax Refund', description: 'Collect $20', action: { type: 'GAIN_MONEY', amount: 20 } },
  { id: 'cc-9', type: 'COMMUNITY_CHEST', title: 'Life Insurance Matures', description: 'Collect $100', action: { type: 'GAIN_MONEY', amount: 100 } },
  { id: 'cc-10', type: 'COMMUNITY_CHEST', title: 'Pay Hospital Fees', description: 'Pay $100', action: { type: 'LOSE_MONEY', amount: 100 } },
  { id: 'cc-11', type: 'COMMUNITY_CHEST', title: 'Pay School Fees', description: 'Pay $50', action: { type: 'LOSE_MONEY', amount: 50 } },
  { id: 'cc-12', type: 'COMMUNITY_CHEST', title: 'Receive Consultancy Fee', description: 'Collect $25', action: { type: 'GAIN_MONEY', amount: 25 } },
  { id: 'cc-13', type: 'COMMUNITY_CHEST', title: 'Street Repairs', description: 'Pay $40 per house, $115 per hotel', action: { type: 'REPAIRS', houseCost: 40, hotelCost: 115 } },
  { id: 'cc-14', type: 'COMMUNITY_CHEST', title: 'You Have Won Second Prize', description: 'Collect $100', action: { type: 'GAIN_MONEY', amount: 100 } },
  { id: 'cc-15', type: 'COMMUNITY_CHEST', title: 'You Inherit', description: 'Collect $100', action: { type: 'GAIN_MONEY', amount: 100 } },
];

export function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

export const BOARD_TILES = [
  { id: 0, position: 0, name: 'GO', type: 'GO', color: '#c9a84c' },
  { id: 1, position: 1, name: 'Mumbai', type: 'PROPERTY', price: 60, rent: { base: 2, oneHouse: 10, twoHouses: 30, threeHouses: 90, fourHouses: 160, hotel: 250 }, colorGroup: 'brown', country: 'india', countryName: 'India', color: '#DC1B1B', houseCost: 50, mortgageValue: 30 },
  { id: 2, position: 2, name: 'Community Chest', type: 'COMMUNITY_CHEST', color: '#4a90d9' },
  { id: 3, position: 3, name: 'Delhi', type: 'PROPERTY', price: 60, rent: { base: 4, oneHouse: 20, twoHouses: 60, threeHouses: 180, fourHouses: 320, hotel: 450 }, colorGroup: 'brown', country: 'india', countryName: 'India', color: '#DC1B1B', houseCost: 50, mortgageValue: 30 },
  { id: 4, position: 4, name: 'Income Tax', type: 'TAX', taxAmount: 200, taxType: 'income', color: '#666666' },
  { id: 5, position: 5, name: 'JFK Airport', type: 'RAILROAD', price: 200, rent: { base: 25, oneHouse: 25, twoHouses: 25, threeHouses: 25, fourHouses: 25, hotel: 25 }, color: '#3E2723', mortgageValue: 100 },
  { id: 6, position: 6, name: 'São Paulo', type: 'PROPERTY', price: 100, rent: { base: 6, oneHouse: 30, twoHouses: 90, threeHouses: 270, fourHouses: 400, hotel: 550 }, colorGroup: 'lightblue', country: 'brazil', countryName: 'Brazil', color: '#009C39', houseCost: 50, mortgageValue: 50 },
  { id: 7, position: 7, name: 'Chance', type: 'CHANCE', color: '#ff6b35' },
  { id: 8, position: 8, name: 'Rio de Janeiro', type: 'PROPERTY', price: 100, rent: { base: 6, oneHouse: 30, twoHouses: 90, threeHouses: 270, fourHouses: 400, hotel: 550 }, colorGroup: 'lightblue', country: 'brazil', countryName: 'Brazil', color: '#009C39', houseCost: 50, mortgageValue: 50 },
  { id: 9, position: 9, name: 'Brasília', type: 'PROPERTY', price: 120, rent: { base: 8, oneHouse: 40, twoHouses: 100, threeHouses: 300, fourHouses: 450, hotel: 600 }, colorGroup: 'lightblue', country: 'brazil', countryName: 'Brazil', color: '#009C39', houseCost: 50, mortgageValue: 60 },
  { id: 10, position: 10, name: 'Jail', type: 'JAIL', color: '#ff8c42' },

  { id: 11, position: 11, name: 'Tokyo', type: 'PROPERTY', price: 140, rent: { base: 10, oneHouse: 50, twoHouses: 150, threeHouses: 450, fourHouses: 625, hotel: 750 }, colorGroup: 'pink', country: 'japan', countryName: 'Japan', color: '#BC0020', houseCost: 100, mortgageValue: 70 },
  { id: 12, position: 12, name: 'Tokyo Power', type: 'UTILITY', price: 150, rent: { base: 4, oneHouse: 4, twoHouses: 10, threeHouses: 10, fourHouses: 10, hotel: 10 }, utilityMultiplier: { one: 4, two: 10 }, color: '#ffeb3b', mortgageValue: 75 },
  { id: 13, position: 13, name: 'Osaka', type: 'PROPERTY', price: 140, rent: { base: 10, oneHouse: 50, twoHouses: 150, threeHouses: 450, fourHouses: 625, hotel: 750 }, colorGroup: 'pink', country: 'japan', countryName: 'Japan', color: '#BC0020', houseCost: 100, mortgageValue: 70 },
  { id: 14, position: 14, name: 'Kyoto', type: 'PROPERTY', price: 160, rent: { base: 12, oneHouse: 60, twoHouses: 180, threeHouses: 500, fourHouses: 700, hotel: 900 }, colorGroup: 'pink', country: 'japan', countryName: 'Japan', color: '#BC0020', houseCost: 100, mortgageValue: 80 },
  { id: 15, position: 15, name: 'LAX Airport', type: 'RAILROAD', price: 200, rent: { base: 25, oneHouse: 25, twoHouses: 25, threeHouses: 25, fourHouses: 25, hotel: 25 }, color: '#3E2723', mortgageValue: 100 },
  { id: 16, position: 16, name: 'Berlin', type: 'PROPERTY', price: 180, rent: { base: 14, oneHouse: 70, twoHouses: 200, threeHouses: 550, fourHouses: 750, hotel: 950 }, colorGroup: 'orange', country: 'germany', countryName: 'Germany', color: '#FF8C00', houseCost: 100, mortgageValue: 90 },
  { id: 17, position: 17, name: 'Community Chest', type: 'COMMUNITY_CHEST', color: '#4a90d9' },
  { id: 18, position: 18, name: 'Munich', type: 'PROPERTY', price: 180, rent: { base: 14, oneHouse: 70, twoHouses: 200, threeHouses: 550, fourHouses: 750, hotel: 950 }, colorGroup: 'orange', country: 'germany', countryName: 'Germany', color: '#FF8C00', houseCost: 100, mortgageValue: 90 },
  { id: 19, position: 19, name: 'Hamburg', type: 'PROPERTY', price: 200, rent: { base: 16, oneHouse: 80, twoHouses: 220, threeHouses: 600, fourHouses: 800, hotel: 1000 }, colorGroup: 'orange', country: 'germany', countryName: 'Germany', color: '#FF8C00', houseCost: 100, mortgageValue: 100 },

  { id: 20, position: 20, name: 'Free Parking', type: 'FREE_PARKING', color: '#DC143C' },
  { id: 21, position: 21, name: 'Paris', type: 'PROPERTY', price: 220, rent: { base: 18, oneHouse: 90, twoHouses: 250, threeHouses: 700, fourHouses: 875, hotel: 1050 }, colorGroup: 'red', country: 'france', countryName: 'France', color: '#002395', houseCost: 150, mortgageValue: 110 },
  { id: 22, position: 22, name: 'Chance', type: 'CHANCE', color: '#ff6b35' },
  { id: 23, position: 23, name: 'Lyon', type: 'PROPERTY', price: 220, rent: { base: 18, oneHouse: 90, twoHouses: 250, threeHouses: 700, fourHouses: 875, hotel: 1050 }, colorGroup: 'red', country: 'france', countryName: 'France', color: '#002395', houseCost: 150, mortgageValue: 110 },
  { id: 24, position: 24, name: 'Marseille', type: 'PROPERTY', price: 240, rent: { base: 20, oneHouse: 100, twoHouses: 300, threeHouses: 750, fourHouses: 925, hotel: 1100 }, colorGroup: 'red', country: 'france', countryName: 'France', color: '#002395', houseCost: 150, mortgageValue: 120 },
  { id: 25, position: 25, name: 'CDG Airport', type: 'RAILROAD', price: 200, rent: { base: 25, oneHouse: 25, twoHouses: 25, threeHouses: 25, fourHouses: 25, hotel: 25 }, color: '#3E2723', mortgageValue: 100 },
  { id: 26, position: 26, name: 'Seoul', type: 'PROPERTY', price: 260, rent: { base: 22, oneHouse: 110, twoHouses: 330, threeHouses: 800, fourHouses: 975, hotel: 1150 }, colorGroup: 'yellow', country: 'korea', countryName: 'Korea', color: '#C60C30', houseCost: 150, mortgageValue: 130 },
  { id: 27, position: 27, name: 'Busan', type: 'PROPERTY', price: 260, rent: { base: 22, oneHouse: 110, twoHouses: 330, threeHouses: 800, fourHouses: 975, hotel: 1150 }, colorGroup: 'yellow', country: 'korea', countryName: 'Korea', color: '#C60C30', houseCost: 150, mortgageValue: 130 },
  { id: 28, position: 28, name: 'Seoul Water', type: 'UTILITY', price: 150, rent: { base: 4, oneHouse: 4, twoHouses: 10, threeHouses: 10, fourHouses: 10, hotel: 10 }, utilityMultiplier: { one: 4, two: 10 }, color: '#F5DEB3', mortgageValue: 75 },
  { id: 29, position: 29, name: 'Incheon', type: 'PROPERTY', price: 280, rent: { base: 24, oneHouse: 120, twoHouses: 360, threeHouses: 850, fourHouses: 1025, hotel: 1200 }, colorGroup: 'yellow', country: 'korea', countryName: 'Korea', color: '#C60C30', houseCost: 150, mortgageValue: 140 },
  { id: 30, position: 30, name: 'Go To Jail', type: 'GO_TO_JAIL', color: '#DC143C' },

  { id: 31, position: 31, name: 'Toronto', type: 'PROPERTY', price: 300, rent: { base: 26, oneHouse: 130, twoHouses: 390, threeHouses: 900, fourHouses: 1100, hotel: 1275 }, colorGroup: 'green', country: 'canada', countryName: 'Canada', color: '#FF0000', houseCost: 200, mortgageValue: 150 },
  { id: 32, position: 32, name: 'Vancouver', type: 'PROPERTY', price: 300, rent: { base: 26, oneHouse: 130, twoHouses: 390, threeHouses: 900, fourHouses: 1100, hotel: 1275 }, colorGroup: 'green', country: 'canada', countryName: 'Canada', color: '#FF0000', houseCost: 200, mortgageValue: 150 },
  { id: 33, position: 33, name: 'Community Chest', type: 'COMMUNITY_CHEST', color: '#4a90d9' },
  { id: 34, position: 34, name: 'Montreal', type: 'PROPERTY', price: 320, rent: { base: 28, oneHouse: 150, twoHouses: 450, threeHouses: 1000, fourHouses: 1200, hotel: 1400 }, colorGroup: 'green', country: 'canada', countryName: 'Canada', color: '#FF0000', houseCost: 200, mortgageValue: 160 },
  { id: 35, position: 35, name: 'Tokyo Airport', type: 'RAILROAD', price: 200, rent: { base: 25, oneHouse: 25, twoHouses: 25, threeHouses: 25, fourHouses: 25, hotel: 25 }, color: '#3E2723', mortgageValue: 100 },
  { id: 36, position: 36, name: 'Chance', type: 'CHANCE', color: '#ff6b35' },
  { id: 37, position: 37, name: 'Sydney', type: 'PROPERTY', price: 350, rent: { base: 35, oneHouse: 175, twoHouses: 500, threeHouses: 1100, fourHouses: 1300, hotel: 1500 }, colorGroup: 'darkblue', country: 'australia', countryName: 'Australia', color: '#00205B', houseCost: 200, mortgageValue: 175 },
  { id: 38, position: 38, name: 'Luxury Tax', type: 'TAX', taxAmount: 100, taxType: 'luxury', color: '#666666' },
  { id: 39, position: 39, name: 'Melbourne', type: 'PROPERTY', price: 400, rent: { base: 50, oneHouse: 200, twoHouses: 600, threeHouses: 1400, fourHouses: 1700, hotel: 2000 }, colorGroup: 'darkblue', country: 'australia', countryName: 'Australia', color: '#00205B', houseCost: 200, mortgageValue: 200 },
];

export class GameEngine {
  static createInitialGameState(roomCode, settings = {}) {
    return {
      gameId: generateId(),
      roomCode,
      phase: 'LOBBY',
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
      trade: null,
      logs: [],
      winner: null,
      settings: {
        startingMoney: 1500,
        goSalary: 200,
        turnTimerSeconds: 0,
        auctionEnabled: true,
        evenBuild: true,
        ...settings,
      },
    };
  }

  static addLog(state, message, type = 'info', playerId = null) {
    state.logs.unshift({
      id: generateId(),
      message,
      type,
      timestamp: Date.now(),
      playerId,
    });
    if (state.logs.length > 100) state.logs.pop();
  }

  static rollDice() {
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    return { die1, die2, isDouble: die1 === die2, total: die1 + die2 };
  }

  static getGroupKey(tile) {
    return tile.country || tile.colorGroup;
  }

  static getGroupTiles(groupKey) {
    return BOARD_TILES.filter(t => GameEngine.getGroupKey(t) === groupKey);
  }

  static ownsCompleteColorGroup(player, groupKey) {
    if (!groupKey) return false;
    const groupTiles = GameEngine.getGroupTiles(groupKey);
    return groupTiles.every(tile => player.properties.includes(tile.id));
  }

  static isColorGroupMortgaged(state, groupKey) {
    if (!groupKey) return false;
    const groupTiles = GameEngine.getGroupTiles(groupKey);
    return groupTiles.some(tile => state.mortgagedProperties.includes(tile.id));
  }

  static calculateRent(state, tile, owner, diceTotal = 7) {
    if (!tile.rent) return 0;
    if (state.mortgagedProperties.includes(tile.id)) return 0;

    if (tile.type === 'RAILROAD') {
      const railroadCount = owner.properties.filter(id => {
        const prop = BOARD_TILES.find(t => t.id === id);
        return prop?.type === 'RAILROAD' && !state.mortgagedProperties.includes(id);
      }).length;
      const rentLevels = [25, 50, 100, 200];
      return rentLevels[Math.min(railroadCount - 1, 3)] || 25;
    }

    if (tile.type === 'UTILITY') {
      const utilityCount = owner.properties.filter(id => {
        const prop = BOARD_TILES.find(t => t.id === id);
        return prop?.type === 'UTILITY' && !state.mortgagedProperties.includes(id);
      }).length;
      const multiplier = utilityCount === 2 ? 10 : 4;
      return diceTotal * multiplier;
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

      const ownsAll = GameEngine.ownsCompleteColorGroup(owner, GameEngine.getGroupKey(tile));
      return ownsAll ? rentStructure.base * 2 : rentStructure.base;
    }

    return typeof tile.rent === 'number' ? tile.rent : 0;
  }

  static canBuyHouse(state, player, tile) {
    const groupKey = GameEngine.getGroupKey(tile);
    if (!groupKey || !tile.houseCost) return false;
    if (!GameEngine.ownsCompleteColorGroup(player, groupKey)) return false;
    if (GameEngine.isColorGroupMortgaged(state, groupKey)) return false;
    if (state.bankHouses <= 0) return false;

    const building = player.buildings.find(b => b.propertyId === tile.id);
    const currentHouses = building?.houses || 0;

    if (building?.hotel) return false;
    if (currentHouses >= 4) return false;

    if (state.settings.evenBuild) {
      const groupTiles = GameEngine.getGroupTiles(groupKey);
      const minHouses = Math.min(
        ...groupTiles.map(t => {
          const b = player.buildings.find(b => b.propertyId === t.id);
          return b?.hotel ? 5 : (b?.houses || 0);
        })
      );
      if (currentHouses > minHouses) return false;
    }

    return player.money >= tile.houseCost;
  }

  static canBuyHotel(state, player, tile) {
    const groupKey = GameEngine.getGroupKey(tile);
    if (!groupKey || !tile.houseCost) return false;
    if (!GameEngine.ownsCompleteColorGroup(player, groupKey)) return false;
    if (GameEngine.isColorGroupMortgaged(state, groupKey)) return false;
    if (state.bankHotels <= 0) return false;

    const building = player.buildings.find(b => b.propertyId === tile.id);
     return building?.houses === 4 && !building.hotel && player.money >= tile.houseCost;
  }

  static calculateNetWorth(player) {
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

  static mortgageProperty(state, playerId, tileId) {
    const player = state.players.find(p => p.id === playerId);
    const tile = BOARD_TILES.find(t => t.id === tileId);
    if (!player || !tile || !tile.mortgageValue) return false;

    if (!player.properties.includes(tileId)) return false;
    if (state.mortgagedProperties.includes(tileId)) return false;

    player.money += tile.mortgageValue;
    state.mortgagedProperties.push(tileId);
    GameEngine.addLog(state, `${player.name} mortgaged ${tile.name} for $${tile.mortgageValue}`, 'warning', player.id);
    return true;
  }

  static unmortgageProperty(state, playerId, tileId) {
    const player = state.players.find(p => p.id === playerId);
    const tile = BOARD_TILES.find(t => t.id === tileId);
    if (!player || !tile || !tile.mortgageValue) return false;

    if (!player.properties.includes(tileId)) return false;
    if (!state.mortgagedProperties.includes(tileId)) return false;

    const unmortgageCost = Math.round(tile.mortgageValue * 1.1);
    if (player.money < unmortgageCost) return false;

    player.money -= unmortgageCost;
    state.mortgagedProperties = state.mortgagedProperties.filter(id => id !== tileId);
    GameEngine.addLog(state, `${player.name} unmortgaged ${tile.name} for $${unmortgageCost}`, 'success', player.id);
    return true;
  }

  static sellHouses(state, playerId, tileId) {
    const player = state.players.find(p => p.id === playerId);
    const tile = BOARD_TILES.find(t => t.id === tileId);
    if (!player || !tile || !tile.houseCost) return false;

    const building = player.buildings.find(b => b.propertyId === tileId);
    if (!building) return false;

    if (building.hotel) {
      building.hotel = false;
      building.houses = 4;
      state.bankHotels += 1;
      state.bankHouses -= 4;
      const refund = Math.round(tile.houseCost * 4 / 2);
      player.money += refund;
      GameEngine.addLog(state, `${player.name} sold hotel back from ${tile.name} for $${refund}`, 'info', player.id);
    } else if (building.houses > 0) {
      building.houses -= 1;
      state.bankHouses += 1;
      const refund = Math.round(tile.houseCost / 2);
      player.money += refund;
      GameEngine.addLog(state, `${player.name} sold a house on ${tile.name} for $${refund}`, 'info', player.id);
    }
    return true;
  }

  static resolveDebt(state, playerId, action, tileId) {
    const player = state.players.find(p => p.id === playerId);
    if (!player || state.turnState.phase !== 'DEBT') return false;

    const debt = state.turnState.debtAmount || 0;

    if (action === 'mortgage' && tileId !== undefined) {
      return GameEngine.mortgageProperty(state, playerId, tileId);
    }

    if (action === 'sellHouse' && tileId !== undefined) {
      return GameEngine.sellHouses(state, playerId, tileId);
    }

    if (action === 'pay') {
      if (player.money >= debt) {
        player.money -= debt;
        const creditorId = state.turnState.creditorId;
        const creditor = creditorId !== 'BANK' ? state.players.find(p => p.id === creditorId) : null;
        if (creditor) creditor.money += debt;
        GameEngine.addLog(state, `${player.name} paid $${debt} debt`, 'success', player.id);
        state.turnState.phase = 'ACTION';
        state.turnState.debtAmount = 0;
        state.turnState.creditorId = null;
        return true;
      }
      return false;
    }

    if (action === 'bankrupt') {
      return GameEngine.declareBankruptcy(state, playerId);
    }

    return false;
  }

  static declareBankruptcy(state, playerId) {
    const player = state.players.find(p => p.id === playerId);
    if (!player) return false;

    player.bankrupt = true;
    const creditorId = state.turnState.creditorId;
    const creditor = state.players.find(p => p.id === creditorId);

    GameEngine.addLog(state, `${player.name} went bankrupt!`, 'error', player.id);

    if (creditorId !== 'BANK' && creditor) {
      creditor.money += Math.max(0, player.money);
      player.properties.forEach(propId => {
        creditor.properties.push(propId);
      });
      player.money = 0;
      player.properties = [];
      player.buildings = [];
      GameEngine.addLog(state, `All assets of ${player.name} were transferred to ${creditor.name}`, 'success', creditor.id);
    } else {
      GameEngine.addLog(state, `${player.name}'s properties were returned to the Bank`, 'info');
      player.money = 0;
      player.properties = [];
      player.buildings = [];
    }

    const activePlayers = state.players.filter(p => !p.bankrupt);
    if (activePlayers.length === 1) {
      state.winner = activePlayers[0];
      state.phase = 'ENDED';
      GameEngine.addLog(state, `${state.winner.name} won Estate Empire!`, 'success', state.winner.id);
    } else {
      GameEngine.endTurn(state);
    }
    return true;
  }

  static handleRollDice(state, playerId) {
    const playerIndex = state.players.findIndex(p => p.id === playerId);
    if (playerIndex !== state.currentPlayerIndex) return false;
    if (state.turnState.hasRolled) return false;
    if (state.turnState.phase !== 'ROLL') return false;

    const player = state.players[playerIndex];
    const dice = GameEngine.rollDice();
    state.dice = dice;
    state.turnState.hasRolled = true;

    if (dice.isDouble) {
      state.turnState.doublesRolled += 1;
    } else {
      state.turnState.doublesRolled = 0;
    }

    GameEngine.addLog(state, `${player.name} rolled ${dice.total} (${dice.die1},${dice.die2})`, 'action', player.id);

    if (state.turnState.doublesRolled >= 3 && dice.isDouble) {
      GameEngine.addLog(state, `${player.name} rolled three doubles and is sent to Jail!`, 'warning', player.id);
      GameEngine.sendToJail(state, player.id);
      GameEngine.endTurn(state);
      return true;
    }

    if (player.inJail) {
      if (dice.isDouble) {
        GameEngine.addLog(state, `${player.name} rolled doubles and escaped Jail!`, 'success', player.id);
        player.inJail = false;
        player.jailTurns = 0;
        GameEngine.movePlayer(state, player.id, dice.total);
      } else {
        player.jailTurns += 1;
        if (player.jailTurns >= 3) {
          GameEngine.addLog(state, `${player.name} completed 3 turns in Jail and must pay $50`, 'warning', player.id);
          if (player.money >= 50) {
            player.money -= 50;
            player.inJail = false;
            player.jailTurns = 0;
            GameEngine.movePlayer(state, player.id, dice.total);
          } else {
            GameEngine.triggerDebt(state, player.id, 50, 'BANK');
          }
        } else {
          GameEngine.addLog(state, `${player.name} stays in Jail`, 'info', player.id);
          GameEngine.endTurn(state);
        }
      }
    } else {
      GameEngine.movePlayer(state, player.id, dice.total);
    }
    return true;
  }

  static movePlayer(state, playerId, spaces) {
    const player = state.players.find(p => p.id === playerId);
    if (!player) return;

    const oldPos = player.position;
    const newPos = (oldPos + spaces) % 40;

    if (newPos < oldPos && newPos !== 0) {
      player.money += state.settings.goSalary;
      GameEngine.addLog(state, `${player.name} passed GO and collected $${state.settings.goSalary}`, 'success', player.id);
    }

    player.position = newPos;
    GameEngine.resolveTileLanding(state, player);
  }

  static resolveTileLanding(state, player) {
    const tile = BOARD_TILES[player.position];
    state.turnState.pendingActionTileId = tile.id;

    switch (tile.type) {
      case 'GO':
        player.money += state.settings.goSalary;
        GameEngine.addLog(state, `${player.name} landed on GO and collected $${state.settings.goSalary}`, 'success', player.id);
        state.turnState.phase = 'ACTION';
        break;

      case 'PROPERTY':
      case 'RAILROAD':
      case 'UTILITY':
        {
          const owner = state.players.find(p => p.properties.includes(tile.id));
          if (!owner) {
            state.turnState.phase = 'ACTION';
          } else if (owner.id !== player.id) {
            const rent = GameEngine.calculateRent(state, tile, owner, state.dice?.total || 7);
            if (rent > 0) {
              if (player.money >= rent) {
                player.money -= rent;
                owner.money += rent;
                GameEngine.addLog(state, `${player.name} paid $${rent} rent to ${owner.name}`, 'warning', player.id);
                state.turnState.phase = 'ACTION';
              } else {
                GameEngine.triggerDebt(state, player.id, rent, owner.id);
              }
            } else {
              GameEngine.addLog(state, `${tile.name} is mortgaged; no rent collected`, 'info', player.id);
              state.turnState.phase = 'ACTION';
            }
          } else {
            GameEngine.addLog(state, `${player.name} landed on their own property`, 'info', player.id);
            state.turnState.phase = 'ACTION';
          }
        }
        break;

      case 'TAX':
        if (tile.taxType === 'income') {
          state.turnState.phase = 'TAX_DECISION';
        } else if (tile.taxAmount) {
          if (player.money >= tile.taxAmount) {
            player.money -= tile.taxAmount;
            GameEngine.addLog(state, `${player.name} paid $${tile.taxAmount} in taxes`, 'warning', player.id);
            state.turnState.phase = 'ACTION';
          } else {
            GameEngine.triggerDebt(state, player.id, tile.taxAmount, 'BANK');
          }
        }
        break;

      case 'JAIL':
        GameEngine.addLog(state, `${player.name} is Just Visiting`, 'info', player.id);
        state.turnState.phase = 'ACTION';
        break;

      case 'FREE_PARKING':
        GameEngine.addLog(state, `${player.name} landed on Free Parking`, 'info', player.id);
        state.turnState.phase = 'ACTION';
        break;

      case 'GO_TO_JAIL':
        GameEngine.sendToJail(state, player.id);
        state.turnState.phase = 'ACTION';
        break;

      case 'CHANCE':
        GameEngine.drawChanceCard(state, player.id);
        return;

      case 'COMMUNITY_CHEST':
        GameEngine.drawCommunityChestCard(state, player.id);
        return;
    }

    state.turnState.canRollAgain = state.dice?.isDouble && !player.inJail;
  }

  static buyProperty(state, playerId, tileId) {
    const player = state.players.find(p => p.id === playerId);
    const tile = BOARD_TILES.find(t => t.id === tileId);

    if (!player || !tile || !tile.price) return false;
    if (player.money < tile.price) return false;
    const existingOwner = state.players.find(p => p.properties.includes(tileId));
    if (existingOwner) return false;
    if (state.players[state.currentPlayerIndex].id !== playerId) return false;
    if (!state.turnState.hasRolled) return false;
    if (BOARD_TILES[player.position].id !== tileId) return false;

    player.money -= tile.price;
    player.properties.push(tileId);
    GameEngine.addLog(state, `${player.name} bought ${tile.name} for $${tile.price}`, 'success', player.id);
    state.turnState.phase = 'ACTION';
    return true;
  }

  static buyHouse(state, playerId, tileId) {
    const player = state.players.find(p => p.id === playerId);
    if (!player) return false;
    if (state.players[state.currentPlayerIndex].id !== playerId) return false;
    if (state.turnState.phase !== 'ACTION' && state.turnState.phase !== 'PAYMENT_REQUIRED') return false;

    const tile = BOARD_TILES.find(t => t.id === tileId);
    if (!tile || !tile.houseCost) return false;

    if (!GameEngine.canBuyHouse(state, player, tile)) return false;
    if (state.bankHouses <= 0) return false;
    if (player.money < tile.houseCost) return false;

    player.money -= tile.houseCost;
    state.bankHouses -= 1;

    let building = player.buildings.find(b => b.propertyId === tileId);
    if (building) {
      building.houses += 1;
    } else {
      building = { propertyId: tileId, houses: 1, hotel: false };
      player.buildings.push(building);
    }

    GameEngine.addLog(state, `${player.name} built a house on ${tile.name}`, 'success', player.id);
    return true;
  }

  static buyHotel(state, playerId, tileId) {
    const player = state.players.find(p => p.id === playerId);
    if (!player) return false;
    if (state.players[state.currentPlayerIndex].id !== playerId) return false;
    if (state.turnState.phase !== 'ACTION' && state.turnState.phase !== 'PAYMENT_REQUIRED') return false;

    const tile = BOARD_TILES.find(t => t.id === tileId);
    if (!tile || !tile.houseCost) return false;

    if (!GameEngine.canBuyHotel(state, player, tile)) return false;
    if (state.bankHotels <= 0) return false;

    if (player.money < tile.houseCost) return false;

    const building = player.buildings.find(b => b.propertyId === tileId);
    if (!building || building.houses !== 4 || building.hotel) return false;

    player.money -= tile.houseCost;
    state.bankHotels -= 1;
    state.bankHouses += 4;
    building.houses = 0;
    building.hotel = true;

    GameEngine.addLog(state, `${player.name} built a hotel on ${tile.name}`, 'success', player.id);
    return true;
  }

  static declinePropertyPurchase(state, playerId, tileId) {
    const tile = BOARD_TILES.find(t => t.id === tileId);
    if (!tile || !tile.price) return false;

    GameEngine.addLog(state, `${state.players[state.currentPlayerIndex].name} declined to buy ${tile.name}. Property remains unowned.`, 'info');
    return true;
  }

  static startAuction(state, tileId, startedBy) {
    const activeBidders = state.players.filter(p => !p.bankrupt && p.id !== startedBy).map(p => p.id);
    if (activeBidders.length === 0) return;

    state.auction = {
      id: generateId(),
      tileId,
      propertyName: BOARD_TILES[tileId]?.name || `Tile ${tileId}`,
      currentBid: 10,
      highestBidderId: null,
      activeBidders,
      startedBy,
      bids: [],
      status: 'active',
      turnIndex: 0,
    };
    state.turnState.phase = 'AUCTION';
    GameEngine.addLog(state, `Auction started for ${BOARD_TILES[tileId]?.name || `tile ${tileId}`}!`, 'info');
  }

  static placeBid(state, playerId, bidAmount) {
    if (!state.auction || state.auction.status !== 'active') return false;
    if (state.auction.startedBy === playerId) return false;

    const player = state.players.find(p => p.id === playerId);
    if (!player || player.money < bidAmount || bidAmount <= state.auction.currentBid) return false;

    state.auction.currentBid = bidAmount;
    state.auction.highestBidderId = playerId;
    state.auction.bids.push({
      playerId,
      amount: bidAmount,
      timestamp: Date.now(),
    });
    GameEngine.addLog(state, `${player.name} bid $${bidAmount}`, 'info', player.id);

    const bidderIndex = state.auction.activeBidders.indexOf(playerId);
    if (bidderIndex !== -1) {
      state.auction.turnIndex = (bidderIndex + 1) % state.auction.activeBidders.length;
    }
    return true;
  }

  static passBid(state, playerId) {
    if (!state.auction || state.auction.status !== 'active') return false;
    const index = state.auction.activeBidders.indexOf(playerId);
    if (index === -1) return false;

    state.auction.activeBidders.splice(index, 1);
    GameEngine.addLog(state, `${state.players.find(p => p.id === playerId)?.name} passed in auction`, 'info', playerId);

    if (state.auction.activeBidders.length === 0) {
      GameEngine.addLog(state, `Auction ended with no bids`, 'info');
      state.auction = null;
      state.turnState.phase = 'ACTION';
    } else if (state.auction.activeBidders.length === 1 && state.auction.highestBidderId) {
      const winner = state.players.find(p => p.id === state.auction.highestBidderId);
      const tile = BOARD_TILES.find(t => t.id === state.auction.tileId);

      if (winner && tile && winner.money >= state.auction.currentBid) {
        winner.money -= state.auction.currentBid;
        winner.properties.push(tile.id);
        GameEngine.addLog(state, `${winner.name} won the auction for ${tile.name} at $${state.auction.currentBid}!`, 'success', winner.id);
      } else if (winner && tile) {
        GameEngine.addLog(state, `Winner ${winner.name} cannot afford the bid. Property remains unowned.`, 'warning');
      }
      state.auction = null;
      state.turnState.phase = 'ACTION';
    } else {
      state.auction.turnIndex = state.auction.turnIndex % state.auction.activeBidders.length;
    }
    return true;
  }

  static triggerDebt(state, playerId, amount, creditorId) {
    state.turnState.phase = 'DEBT';
    state.turnState.debtAmount = amount;
    state.turnState.creditorId = creditorId;

    const player = state.players.find(p => p.id === playerId);
    const creditorName = creditorId === 'BANK' ? 'the Bank' : state.players.find(p => p.id === creditorId)?.name;
    GameEngine.addLog(state, `${player.name} owes $${amount} to ${creditorName} and must raise cash!`, 'warning', playerId);
  }

  static sendToJail(state, playerId) {
    const player = state.players.find(p => p.id === playerId);
    if (!player) return;
    player.inJail = true;
    player.position = 10;
    player.jailTurns = 0;
    GameEngine.addLog(state, `${player.name} was sent to Jail!`, 'warning', playerId);
  }

  static leaveJail(state, playerId, pay = false) {
    const player = state.players.find(p => p.id === playerId);
    if (!player || !player.inJail) return false;

    if (pay) {
      if (player.money < 50) return false;
      player.money -= 50;
    } else if (player.getOutOfJailCards > 0) {
      player.getOutOfJailCards -= 1;
    } else {
      return false;
    }

    player.inJail = false;
    player.jailTurns = 0;
    GameEngine.addLog(state, `${player.name} is out of Jail`, 'success', playerId);
    return true;
  }

  static executeTrade(state, tradeId) {
    const trade = state.trade;
    if (!trade || trade.status !== 'pending') return false;

    const sender = state.players.find(p => p.id === trade.fromPlayerId);
    const receiver = state.players.find(p => p.id === trade.toPlayerId);
    if (!sender || !receiver) return false;

    if (sender.money < trade.offeredMoney) return false;
    if (receiver.money < trade.requestedMoney) return false;

    sender.money -= trade.offeredMoney;
    receiver.money += trade.offeredMoney;

    receiver.money -= trade.requestedMoney;
    sender.money += trade.requestedMoney;

    trade.offeredProperties.forEach(propId => {
      const idx = sender.properties.indexOf(propId);
      if (idx !== -1) {
        sender.properties.splice(idx, 1);
        receiver.properties.push(propId);
      }
      const building = sender.buildings.find(b => b.propertyId === propId);
      if (building) {
        const bIdx = sender.buildings.indexOf(building);
        if (bIdx !== -1) {
          sender.buildings.splice(bIdx, 1);
          receiver.buildings.push(building);
        }
      }
    });

    trade.requestedProperties.forEach(propId => {
      const idx = receiver.properties.indexOf(propId);
      if (idx !== -1) {
        receiver.properties.splice(idx, 1);
        sender.properties.push(propId);
      }
      const building = receiver.buildings.find(b => b.propertyId === propId);
      if (building) {
        const bIdx = receiver.buildings.indexOf(building);
        if (bIdx !== -1) {
          receiver.buildings.splice(bIdx, 1);
          sender.buildings.push(building);
        }
      }
    });

     trade.status = 'accepted';
    GameEngine.addLog(state, `Trade completed: ${sender.name} and ${receiver.name} exchanged assets`, 'success');
    return true;
  }

  static rejectTrade(state, tradeId) {
    const trade = state.trade;
    if (!trade || trade.status !== 'pending') return false;

    const sender = state.players.find(p => p.id === trade.fromPlayerId);
    const receiver = state.players.find(p => p.id === trade.toPlayerId);
    GameEngine.addLog(state, `${receiver?.name || 'Unknown'} rejected the trade proposal from ${sender?.name || 'Unknown'}`, 'info', receiver?.id);
    trade.status = 'rejected';
    state.trade = null;
    return true;
  }

  static endTurn(state) {
    let nextIndex = (state.currentPlayerIndex + 1) % state.players.length;
    let count = 0;

    while (state.players[nextIndex].bankrupt && count < state.players.length) {
      nextIndex = (nextIndex + 1) % state.players.length;
      count++;
    }

    state.currentPlayerIndex = nextIndex;
    state.turnNumber += 1;
    state.dice = null;
    state.turnState = {
      phase: 'ROLL',
      hasRolled: false,
      canRollAgain: false,
      doublesRolled: 0,
      pendingActionTileId: null,
      debtAmount: 0,
      creditorId: null,
    };
    state.auction = null;
    state.trade = null;
    state.players.forEach((p, i) => {
      p.isCurrentPlayer = i === nextIndex;
    });
  }

  static drawChanceCard(state, playerId) {
    if (!CHANCE_CARDS.length) return;
    const card = CHANCE_CARDS[Math.floor(Math.random() * CHANCE_CARDS.length)];
    const player = state.players.find(p => p.id === playerId);
    if (!player) return;

    GameEngine.addLog(state, `${player.name} drew a Chance card: "${card.title}"`, 'action', playerId);
    GameEngine.handleCardAction(state, card.action, player);

    if (card.action.type === 'MOVE_TO' || card.action.type === 'MOVE_RELATIVE' || card.action.type === 'GO_TO_JAIL') {
      const tile = BOARD_TILES[player.position];
      if (tile) {
        state.turnState.pendingActionTileId = tile.id;
        GameEngine.resolveTileLanding(state, player);
      }
    }

    state.turnState.phase = 'ACTION';
  }

  static drawCommunityChestCard(state, playerId) {
    if (!COMMUNITY_CHEST_CARDS.length) return;
    const card = COMMUNITY_CHEST_CARDS[Math.floor(Math.random() * COMMUNITY_CHEST_CARDS.length)];
    const player = state.players.find(p => p.id === playerId);
    if (!player) return;

    GameEngine.addLog(state, `${player.name} drew a Community Chest card: "${card.title}"`, 'action', playerId);
    GameEngine.handleCardAction(state, card.action, player);

    state.turnState.phase = 'ACTION';
  }

  static handleCardAction(state, action, player) {
    switch (action.type) {
      case 'GAIN_MONEY':
        player.money += action.amount;
        GameEngine.addLog(state, `${player.name} gained $${action.amount}`, 'success', player.id);
        break;
      case 'LOSE_MONEY':
        player.money -= action.amount;
        GameEngine.addLog(state, `${player.name} lost $${action.amount}`, 'warning', player.id);
        if (player.money < 0) {
          GameEngine.triggerDebt(state, player.id, -player.money, 'BANK');
        }
        break;
      case 'MOVE_TO':
        player.position = action.position;
        GameEngine.addLog(state, `${player.name} moved to ${BOARD_TILES[action.position]?.name}`, 'info', player.id);
        break;
      case 'MOVE_RELATIVE': {
        const newPos = (player.position + action.spaces + 40) % 40;
        if (newPos < player.position && action.spaces > 0) {
          player.money += state.settings.goSalary;
          GameEngine.addLog(state, `${player.name} passed GO and collected $${state.settings.goSalary}`, 'success', player.id);
        }
        player.position = newPos;
        GameEngine.addLog(state, `${player.name} moved to ${BOARD_TILES[newPos]?.name}`, 'info', player.id);
        break;
      }
      case 'GO_TO_JAIL':
        GameEngine.sendToJail(state, player.id);
        break;
      case 'GET_OUT_OF_JAIL':
        player.getOutOfJailCards = (player.getOutOfJailCards || 0) + 1;
        GameEngine.addLog(state, `${player.name} received a Get Out of Jail Free card`, 'success', player.id);
        break;
      case 'PAY_EACH_PLAYER': {
        const others = state.players.filter(p => p.id !== player.id);
        const total = action.amount * others.length;
        player.money -= total;
        others.forEach(p => p.money += action.amount);
        GameEngine.addLog(state, `${player.name} paid each player $${action.amount}`, 'warning', player.id);
        break;
      }
      case 'COLLECT_FROM_EACH_PLAYER': {
        const others = state.players.filter(p => p.id !== player.id);
        const total = action.amount * others.length;
        player.money += total;
        others.forEach(p => p.money -= action.amount);
        GameEngine.addLog(state, `${player.name} collected $${action.amount} from each player`, 'success', player.id);
        break;
      }
      case 'REPAIRS': {
        let cost = 0;
        player.buildings.forEach(b => {
          cost += b.houses * action.houseCost;
          if (b.hotel) cost += action.hotelCost;
        });
        player.money -= cost;
        GameEngine.addLog(state, `${player.name} paid $${cost} for repairs`, 'warning', player.id);
        break;
      }
    }
  }
}
