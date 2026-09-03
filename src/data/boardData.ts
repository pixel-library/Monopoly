import { BoardTile, CountryInfo, DefaultCharacter } from '../types';

export const COUNTRIES: CountryInfo[] = [
  { id: 'india', name: 'India', flag: '🇮🇳', color: '#DC1B1B', properties: [1, 3] },
  { id: 'brazil', name: 'Brazil', flag: '🇧🇷', color: '#009C39', properties: [6, 8, 9] },
  { id: 'japan', name: 'Japan', flag: '🇯🇵', color: '#BC0020', properties: [11, 13, 14] },
  { id: 'germany', name: 'Germany', flag: '🇩🇪', color: '#FF8C00', properties: [16, 18, 19] },
  { id: 'france', name: 'France', flag: '🇫🇷', color: '#002395', properties: [21, 23, 24] },
  { id: 'korea', name: 'Korea', flag: '🇰🇷', color: '#C60C30', properties: [26, 27, 29] },
  { id: 'canada', name: 'Canada', flag: '🇨🇦', color: '#FF0000', properties: [31, 32, 34] },
  { id: 'australia', name: 'Australia', flag: '🇦🇺', color: '#00205B', properties: [37, 39] },
];

export const getCountryById = (id: string): CountryInfo | undefined =>
  COUNTRIES.find(c => c.id === id);

export const getCountryProperties = (board: BoardTile[], country: string): BoardTile[] =>
  board.filter(t => t.country === country);

export const ownsCompleteCountry = (player: { properties: number[] }, country: string, board: BoardTile[] = BOARD_TILES): boolean => {
  const groupTiles = getCountryProperties(board, country);
  return groupTiles.every(tile => player.properties.includes(tile.id));
};

export const getCountryCompletion = (player: { properties: number[] }, country: string, board: BoardTile[] = BOARD_TILES): number => {
  const groupTiles = getCountryProperties(board, country);
  return groupTiles.filter(tile => player.properties.includes(tile.id)).length;
};

export const BOARD_TILES: BoardTile[] = [
  // Bottom row (0-10) - Right to Left
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

  // Left column (11-19) - Bottom to Top
  { id: 11, position: 11, name: 'Tokyo', type: 'PROPERTY', price: 140, rent: { base: 10, oneHouse: 50, twoHouses: 150, threeHouses: 450, fourHouses: 625, hotel: 750 }, colorGroup: 'pink', country: 'japan', countryName: 'Japan', color: '#BC0020', houseCost: 100, mortgageValue: 70 },
  { id: 12, position: 12, name: 'Tokyo Power', type: 'UTILITY', price: 150, rent: { base: 4, oneHouse: 4, twoHouses: 10, threeHouses: 10, fourHouses: 10, hotel: 10 }, utilityMultiplier: { one: 4, two: 10 }, color: '#ffeb3b', mortgageValue: 75 },
  { id: 13, position: 13, name: 'Osaka', type: 'PROPERTY', price: 140, rent: { base: 10, oneHouse: 50, twoHouses: 150, threeHouses: 450, fourHouses: 625, hotel: 750 }, colorGroup: 'pink', country: 'japan', countryName: 'Japan', color: '#BC0020', houseCost: 100, mortgageValue: 70 },
  { id: 14, position: 14, name: 'Kyoto', type: 'PROPERTY', price: 160, rent: { base: 12, oneHouse: 60, twoHouses: 180, threeHouses: 500, fourHouses: 700, hotel: 900 }, colorGroup: 'pink', country: 'japan', countryName: 'Japan', color: '#BC0020', houseCost: 100, mortgageValue: 80 },
  { id: 15, position: 15, name: 'LAX Airport', type: 'RAILROAD', price: 200, rent: { base: 25, oneHouse: 25, twoHouses: 25, threeHouses: 25, fourHouses: 25, hotel: 25 }, color: '#3E2723', mortgageValue: 100 },
  { id: 16, position: 16, name: 'Berlin', type: 'PROPERTY', price: 180, rent: { base: 14, oneHouse: 70, twoHouses: 200, threeHouses: 550, fourHouses: 750, hotel: 950 }, colorGroup: 'orange', country: 'germany', countryName: 'Germany', color: '#FF8C00', houseCost: 100, mortgageValue: 90 },
  { id: 17, position: 17, name: 'Community Chest', type: 'COMMUNITY_CHEST', color: '#4a90d9' },
  { id: 18, position: 18, name: 'Munich', type: 'PROPERTY', price: 180, rent: { base: 14, oneHouse: 70, twoHouses: 200, threeHouses: 550, fourHouses: 750, hotel: 950 }, colorGroup: 'orange', country: 'germany', countryName: 'Germany', color: '#FF8C00', houseCost: 100, mortgageValue: 90 },
  { id: 19, position: 19, name: 'Hamburg', type: 'PROPERTY', price: 200, rent: { base: 16, oneHouse: 80, twoHouses: 220, threeHouses: 600, fourHouses: 800, hotel: 1000 }, colorGroup: 'orange', country: 'germany', countryName: 'Germany', color: '#FF8C00', houseCost: 100, mortgageValue: 100 },

  // Top row (20-30) - Left to Right
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

  // Right column (31-39) - Top to Bottom
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

export const DEFAULT_CHARACTERS: DefaultCharacter[] = [
  {
    id: 'professor-plum',
    name: 'Professor Plum',
    color: '#9b59b6',
    bgColor: 'bg-purple-600',
    icon: '🎓',
  },
  {
    id: 'mrs-peacock',
    name: 'Mrs. Peacock',
    color: '#3498db',
    bgColor: 'bg-blue-600',
    icon: '🦚',
  },
  {
    id: 'mr-green',
    name: 'Mr. Green',
    color: '#27ae60',
    bgColor: 'bg-green-600',
    icon: '🌿',
  },
  {
    id: 'mrs-white',
    name: 'Mrs. White',
    color: '#ecf0f1',
    bgColor: 'bg-gray-200',
    icon: '🤍',
  },
  {
    id: 'colonel-mustard',
    name: 'Colonel Mustard',
    color: '#f39c12',
    bgColor: 'bg-yellow-600',
    icon: '⭐',
  },
  {
    id: 'miss-scarlet',
    name: 'Miss Scarlet',
    color: '#e74c3c',
    bgColor: 'bg-red-600',
    icon: '🌹',
  },
];

export const TOKEN_COLORS = [
  { id: 'token-red', color: '#e74c3c', name: 'Red' },
  { id: 'token-orange', color: '#FF8C00', name: 'Orange' },
  { id: 'token-blue', color: '#3b82f6', name: 'Blue' },
  { id: 'token-purple', color: '#a78bfa', name: 'Purple' },
];

export const CHANCE_CARDS = [
  {
    id: 'chance-1',
    type: 'CHANCE' as const,
    title: 'Advance to GO',
    description: 'Collect $200',
    action: { type: 'MOVE_TO' as const, position: 0 },
  },
  {
    id: 'chance-2',
    type: 'CHANCE' as const,
    title: 'Advance to Marseille',
    description: 'If you pass GO, collect $200',
    action: { type: 'MOVE_TO' as const, position: 24 },
  },
  {
    id: 'chance-3',
    type: 'CHANCE' as const,
    title: 'Advance to Tokyo',
    description: 'If you pass GO, collect $200',
    action: { type: 'MOVE_TO' as const, position: 11 },
  },
  {
    id: 'chance-4',
    type: 'CHANCE' as const,
    title: 'Bank Pays Dividend',
    description: 'Collect $50',
    action: { type: 'GAIN_MONEY' as const, amount: 50 },
  },
  {
    id: 'chance-5',
    type: 'CHANCE' as const,
    title: 'Get Out of Jail Free',
    description: 'Keep this card until needed',
    action: { type: 'GET_OUT_OF_JAIL' as const },
  },
  {
    id: 'chance-6',
    type: 'CHANCE' as const,
    title: 'Go Back 3 Spaces',
    description: '',
    action: { type: 'MOVE_RELATIVE' as const, spaces: -3 },
  },
  {
    id: 'chance-7',
    type: 'CHANCE' as const,
    title: 'Go to Jail',
    description: 'Do not pass GO, do not collect $200',
    action: { type: 'GO_TO_JAIL' as const },
  },
  {
    id: 'chance-8',
    type: 'CHANCE' as const,
    title: 'Make General Repairs',
    description: 'Pay $25 per house, $100 per hotel',
    action: { type: 'REPAIRS' as const, houseCost: 25, hotelCost: 100 },
  },
  {
    id: 'chance-9',
    type: 'CHANCE' as const,
    title: 'Speeding Fine',
    description: 'Pay $15',
    action: { type: 'LOSE_MONEY' as const, amount: 15 },
  },
  {
    id: 'chance-10',
    type: 'CHANCE' as const,
    title: 'Advance to Melbourne',
    description: '',
    action: { type: 'MOVE_TO' as const, position: 39 },
  },
  {
    id: 'chance-11',
    type: 'CHANCE' as const,
    title: 'Pay Each Player',
    description: 'Pay each player $50',
    action: { type: 'PAY_EACH_PLAYER' as const, amount: 50 },
  },
  {
    id: 'chance-12',
    type: 'CHANCE' as const,
    title: 'Building Loan Matures',
    description: 'Collect $150',
    action: { type: 'GAIN_MONEY' as const, amount: 150 },
  },
];

export const COMMUNITY_CHEST_CARDS = [
  {
    id: 'cc-1',
    type: 'COMMUNITY_CHEST' as const,
    title: 'Advance to GO',
    description: 'Collect $200',
    action: { type: 'MOVE_TO' as const, position: 0 },
  },
  {
    id: 'cc-2',
    type: 'COMMUNITY_CHEST' as const,
    title: 'Bank Error in Your Favor',
    description: 'Collect $200',
    action: { type: 'GAIN_MONEY' as const, amount: 200 },
  },
  {
    id: 'cc-3',
    type: 'COMMUNITY_CHEST' as const,
    title: 'Doctor\'s Fee',
    description: 'Pay $50',
    action: { type: 'LOSE_MONEY' as const, amount: 50 },
  },
  {
    id: 'cc-4',
    type: 'COMMUNITY_CHEST' as const,
    title: 'From Sale of Stock',
    description: 'Collect $50',
    action: { type: 'GAIN_MONEY' as const, amount: 50 },
  },
  {
    id: 'cc-5',
    type: 'COMMUNITY_CHEST' as const,
    title: 'Get Out of Jail Free',
    description: 'Keep this card until needed',
    action: { type: 'GET_OUT_OF_JAIL' as const },
  },
  {
    id: 'cc-6',
    type: 'COMMUNITY_CHEST' as const,
    title: 'Go to Jail',
    description: 'Do not pass GO, do not collect $200',
    action: { type: 'GO_TO_JAIL' as const },
  },
  {
    id: 'cc-7',
    type: 'COMMUNITY_CHEST' as const,
    title: 'Holiday Fund Matures',
    description: 'Collect $100',
    action: { type: 'GAIN_MONEY' as const, amount: 100 },
  },
  {
    id: 'cc-8',
    type: 'COMMUNITY_CHEST' as const,
    title: 'Income Tax Refund',
    description: 'Collect $20',
    action: { type: 'GAIN_MONEY' as const, amount: 20 },
  },
  {
    id: 'cc-9',
    type: 'COMMUNITY_CHEST' as const,
    title: 'Life Insurance Matures',
    description: 'Collect $100',
    action: { type: 'GAIN_MONEY' as const, amount: 100 },
  },
  {
    id: 'cc-10',
    type: 'COMMUNITY_CHEST' as const,
    title: 'Pay Hospital Fees',
    description: 'Pay $100',
    action: { type: 'LOSE_MONEY' as const, amount: 100 },
  },
  {
    id: 'cc-11',
    type: 'COMMUNITY_CHEST' as const,
    title: 'Pay School Fees',
    description: 'Pay $50',
    action: { type: 'LOSE_MONEY' as const, amount: 50 },
  },
  {
    id: 'cc-12',
    type: 'COMMUNITY_CHEST' as const,
    title: 'Receive Consultancy Fee',
    description: 'Collect $25',
    action: { type: 'GAIN_MONEY' as const, amount: 25 },
  },
  {
    id: 'cc-13',
    type: 'COMMUNITY_CHEST' as const,
    title: 'Street Repairs',
    description: 'Pay $40 per house, $115 per hotel',
    action: { type: 'REPAIRS' as const, houseCost: 40, hotelCost: 115 },
  },
  {
    id: 'cc-14',
    type: 'COMMUNITY_CHEST' as const,
    title: 'You Have Won Second Prize',
    description: 'Collect $100',
    action: { type: 'GAIN_MONEY' as const, amount: 100 },
  },
  {
    id: 'cc-15',
    type: 'COMMUNITY_CHEST' as const,
    title: 'You Inherit',
    description: 'Collect $100',
    action: { type: 'GAIN_MONEY' as const, amount: 100 },
  },
];
