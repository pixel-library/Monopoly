import { BoardTile, ColorGroup } from '../types';

export interface BoardSpace {
  id: number;
  position: number;
  name: string;
  type: string;
  colorGroup?: ColorGroup;
  country?: string;
  countryName?: string;
  color?: string;
  price?: number;
  rent?: number | { base: number; oneHouse: number; twoHouses: number; threeHouses: number; fourHouses: number; hotel: number };
  houseCost?: number;
  mortgageValue?: number;
  taxAmount?: number;
  taxType?: 'income' | 'luxury';
  utilityMultiplier?: { one: number; two: number };
}

export interface GridPosition {
  row: number;
  col: number;
  side: 'top' | 'right' | 'bottom' | 'left';
  special?: 'corner';
}

export const BOARD_SPACES: BoardSpace[] = [
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

export const COLOR_GROUPS: Record<ColorGroup, string> = {
  brown:     '#DC1B1B',
  lightblue: '#009C39',
  pink:      '#BC0020',
  orange:    '#FF8C00',
  red:       '#002395',
  yellow:    '#C60C30',
  green:     '#FF0000',
  darkblue:  '#00205B',
};

export const GRID_POSITIONS: Record<number, GridPosition> = {
  0:  { row: 10, col: 10, side: 'bottom', special: 'corner' },
  1:  { row: 10, col: 9,  side: 'bottom' },
  2:  { row: 10, col: 8,  side: 'bottom' },
  3:  { row: 10, col: 7,  side: 'bottom' },
  4:  { row: 10, col: 6,  side: 'bottom' },
  5:  { row: 10, col: 5,  side: 'bottom' },
  6:  { row: 10, col: 4,  side: 'bottom' },
  7:  { row: 10, col: 3,  side: 'bottom' },
  8:  { row: 10, col: 2,  side: 'bottom' },
  9:  { row: 10, col: 1,  side: 'bottom' },
  10: { row: 10, col: 0, side: 'bottom', special: 'corner' },

  11: { row: 9,  col: 0, side: 'left' },
  12: { row: 8,  col: 0, side: 'left' },
  13: { row: 7,  col: 0, side: 'left' },
  14: { row: 6,  col: 0, side: 'left' },
  15: { row: 5,  col: 0, side: 'left' },
  16: { row: 4,  col: 0, side: 'left' },
  17: { row: 3,  col: 0, side: 'left' },
  18: { row: 2,  col: 0, side: 'left' },
  19: { row: 1,  col: 0, side: 'left' },

  20: { row: 0,  col: 0, side: 'top', special: 'corner' },
  21: { row: 0,  col: 1,  side: 'top' },
  22: { row: 0,  col: 2,  side: 'top' },
  23: { row: 0,  col: 3,  side: 'top' },
  24: { row: 0,  col: 4,  side: 'top' },
  25: { row: 0,  col: 5,  side: 'top' },
  26: { row: 0,  col: 6,  side: 'top' },
  27: { row: 0,  col: 7,  side: 'top' },
  28: { row: 0,  col: 8,  side: 'top' },
  29: { row: 0,  col: 9,  side: 'top' },

  30: { row: 0,  col: 10, side: 'top', special: 'corner' },
  31: { row: 1,  col: 10, side: 'right' },
  32: { row: 2,  col: 10, side: 'right' },
  33: { row: 3,  col: 10, side: 'right' },
  34: { row: 4,  col: 10, side: 'right' },
  35: { row: 5,  col: 10, side: 'right' },
  36: { row: 6,  col: 10, side: 'right' },
  37: { row: 7,  col: 10, side: 'right' },
  38: { row: 8,  col: 10, side: 'right' },
  39: { row: 9,  col: 10, side: 'right' },
};
