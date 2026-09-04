// Room & Multi-Session Manager for Estate Empire (ES Modules)

import { GameEngine } from './gameEngine.js';

class RoomManager {
  constructor() {
    this.rooms = new Map();
    this.socketToPlayer = new Map();
  }

  createRoom(hostPlayer, settings = {}) {
    let roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    let attempts = 0;
    while (this.rooms.has(roomCode) && attempts < 10) {
      roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      attempts++;
    }
    const gameState = GameEngine.createInitialGameState(roomCode, settings);

    hostPlayer.isHost = true;
    hostPlayer.isReady = true;
    hostPlayer.connected = true;
    hostPlayer.isBot = false;
    hostPlayer.doublesCount = 0;

    gameState.players.push(hostPlayer);
    this.rooms.set(roomCode, gameState);
    return { roomCode, gameState };
  }

  getRoom(roomCode) {
    return this.rooms.get(roomCode?.toUpperCase());
  }

  joinRoom(roomCode, player) {
    const gameState = this.getRoom(roomCode);
    if (!gameState) return { success: false, error: 'Room not found' };
    if (gameState.phase !== 'LOBBY') return { success: false, error: 'Game already in progress' };
    if (gameState.players.length >= (gameState.settings.maxPlayers || 4)) return { success: false, error: 'Room is full' };

    if (player.defaultCharacterId && gameState.players.some(p => p.defaultCharacterId === player.defaultCharacterId)) {
      return { success: false, error: 'Selected character avatar already taken in room' };
    }

    player.isHost = false;
    player.isReady = false;
    player.connected = true;
    player.isBot = false;
    player.doublesCount = 0;

    gameState.players.push(player);
    return { success: true, gameState };
  }

  addBot(roomCode) {
    const gameState = this.getRoom(roomCode);
    if (!gameState || gameState.phase !== 'LOBBY') return false;
    if (gameState.players.length >= (gameState.settings.maxPlayers || 4)) return false;

    const botNames = ['Baron AI', 'Duchess Bot', 'Tycoon Bot', 'Vanderbilt AI'];
    const botColors = ['#955436', '#d93a96', '#f7941d', '#ed1b24'];
    const botIndex = gameState.players.filter(p => p.isBot).length;

    const botPlayer = {
      id: `bot_${Math.random().toString(36).substring(2, 7)}`,
      name: botNames[botIndex % botNames.length],
      avatarType: 'default',
      defaultCharacterId: `bot_char_${botIndex}`,
      tokenId: botColors[botIndex % botColors.length],
      money: gameState.settings.startingMoney || 1500,
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
      isHost: false,
      isReady: true,
      isBot: true,
    };

    gameState.players.push(botPlayer);
    return gameState;
  }

  removePlayer(roomCode, playerId) {
    const gameState = this.getRoom(roomCode);
    if (!gameState) return null;

    gameState.players = gameState.players.filter(p => p.id !== playerId);
    if (gameState.players.length === 0) {
      this.rooms.delete(roomCode);
      return null;
    }

    if (!gameState.players.some(p => p.isHost)) {
      const nextHuman = gameState.players.find(p => !p.isBot);
      if (nextHuman) nextHuman.isHost = true;
    }

    return gameState;
  }
}

export default new RoomManager();
