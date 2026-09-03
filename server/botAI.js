// Server-Side Bot AI Agent Engine for Estate Empire (ES Modules)

import { GameEngine, BOARD_TILES } from './gameEngine.js';

export class BotAI {
  static evaluateBotTurn(state, io, roomCode) {
    if (state.phase !== 'PLAYING') return;

    const currentPlayer = state.players[state.currentPlayerIndex];
    if (!currentPlayer || !currentPlayer.isBot || currentPlayer.bankrupt) return;

    setTimeout(() => {
      BotAI.executeBotAction(state, currentPlayer, io, roomCode);
    }, 800);
  }

  static executeBotAction(state, botPlayer, io, roomCode) {
    if (state.turnState.phase === 'ROLL' && !state.turnState.hasRolled) {
      GameEngine.handleRollDice(state, botPlayer.id);
      io.to(roomCode).emit('GAME_STATE_UPDATE', state);

      if (state.turnState.phase === 'ACTION' || state.turnState.phase === 'DEBT') {
        setTimeout(() => BotAI.executeBotAction(state, botPlayer, io, roomCode), 800);
      }
      return;
    }

    if (state.turnState.phase === 'ACTION') {
      const currentTile = BOARD_TILES[botPlayer.position];

      if (currentTile && (currentTile.type === 'PROPERTY' || currentTile.type === 'RAILROAD' || currentTile.type === 'UTILITY') && currentTile.price) {
        const owner = state.players.find(p => p.properties.includes(currentTile.id));
        if (!owner) {
          if (botPlayer.money >= currentTile.price * 1.15) {
            GameEngine.buyProperty(state, botPlayer.id, currentTile.id);
          } else {
            GameEngine.declinePropertyPurchase(state, botPlayer.id, currentTile.id);
          }
          io.to(roomCode).emit('GAME_STATE_UPDATE', state);
        }
      }

      BotAI.evaluateBuildingStrategy(state, botPlayer);

      if (state.turnState.canRollAgain && !state.turnState.hasRolled) {
        setTimeout(() => BotAI.executeBotAction(state, botPlayer, io, roomCode), 600);
      } else {
        GameEngine.endTurn(state);
        io.to(roomCode).emit('GAME_STATE_UPDATE', state);
        BotAI.evaluateBotTurn(state, io, roomCode);
      }
      return;
    }

    if (state.turnState.phase === 'AUCTION' && state.auction) {
      const tile = BOARD_TILES.find(t => t.id === state.auction.tileId);
      const minBid = state.auction.currentBid + 10;

      if (tile && botPlayer.money >= minBid && minBid <= (tile.price || 100) * 0.9) {
        GameEngine.placeBid(state, botPlayer.id, minBid);
      } else {
        GameEngine.passBid(state, botPlayer.id);
      }
      io.to(roomCode).emit('GAME_STATE_UPDATE', state);
      return;
    }

    if (state.turnState.phase === 'DEBT') {
      let raised = 0;
      for (const propId of botPlayer.properties) {
        if (!state.mortgagedProperties.includes(propId)) {
          state.mortgagedProperties.push(propId);
          const prop = BOARD_TILES.find(t => t.id === propId);
          botPlayer.money += prop?.mortgageValue || 50;
          raised += prop?.mortgageValue || 50;
          if (botPlayer.money >= state.turnState.debtAmount) break;
        }
      }

      if (botPlayer.money >= state.turnState.debtAmount) {
        botPlayer.money -= state.turnState.debtAmount;
        state.turnState.phase = 'ACTION';
      } else {
        GameEngine.declareBankruptcy(state, botPlayer.id);
      }
      io.to(roomCode).emit('GAME_STATE_UPDATE', state);
      BotAI.evaluateBotTurn(state, io, roomCode);
    }
  }

  static evaluateBuildingStrategy(state, botPlayer) {
    for (const propId of botPlayer.properties) {
      const tile = BOARD_TILES.find(t => t.id === propId);
      if (tile && tile.colorGroup && tile.houseCost) {
        if (GameEngine.canBuyHouse(state, botPlayer, tile) && botPlayer.money > tile.houseCost + 200) {
          botPlayer.money -= tile.houseCost;
          const building = botPlayer.buildings.find(b => b.propertyId === tile.id);
          if (building) {
            building.houses += 1;
          } else {
            botPlayer.buildings.push({ propertyId: tile.id, houses: 1, hotel: false });
          }
          state.bankHouses -= 1;
        }
      }
    }
  }
}
