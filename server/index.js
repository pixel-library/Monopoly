// Express + Socket.io Server Entry Point for Estate Empire (ES Modules)

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import roomManager from './roomManager.js';
import { GameEngine } from './gameEngine.js';
import { BotAI } from './botAI.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

io.on('connection', (socket) => {
  console.log(`[Socket] Connected: ${socket.id}`);

  const getSocketPlayerId = (socket) => {
    const session = roomManager.socketToPlayer.get(socket.id);
    return session?.playerId || null;
  };

  const getSocketRoomCode = (socket) => {
    const session = roomManager.socketToPlayer.get(socket.id);
    return session?.roomCode || null;
  };

  const authorizeOnlineAction = (socket, roomCode, options = {}) => {
    const upperCode = (roomCode || getSocketRoomCode(socket))?.toUpperCase();
    const gameState = roomManager.getRoom(upperCode);
    const socketPlayerId = getSocketPlayerId(socket);

    if (!upperCode || !gameState || !socketPlayerId) {
      socket.emit('ACTION_REJECTED', { action: options.action, reason: 'INVALID_ROOM_OR_SESSION' });
      return null;
    }

    const roomMembershipValid = Array.from(socket.rooms).some(r => r === upperCode);
    if (!roomMembershipValid) {
      socket.emit('ACTION_REJECTED', { action: options.action, reason: 'NOT_IN_ROOM' });
      return null;
    }

    if (options.requireCurrentTurn) {
      const currentPlayer = gameState.players[gameState.currentPlayerIndex];
      if (!currentPlayer || currentPlayer.id !== socketPlayerId) {
        socket.emit('ACTION_REJECTED', { action: options.action, reason: 'NOT_YOUR_TURN' });
        return null;
      }
    }

    if (options.requirePhase && gameState.phase !== options.requirePhase) {
      socket.emit('ACTION_REJECTED', { action: options.action, reason: 'INVALID_PHASE' });
      return null;
    }

    const player = gameState.players.find(p => p.id === socketPlayerId);
    if (options.requireAlive && (!player || player.bankrupt)) {
      socket.emit('ACTION_REJECTED', { action: options.action, reason: 'PLAYER_NOT_ACTIVE' });
      return null;
    }

    return { gameState, player, socketPlayerId, roomCode: upperCode };
  };

  const isHost = (socket, upperCode) => {
    const gameState = roomManager.getRoom(upperCode);
    const socketPlayerId = getSocketPlayerId(socket);
    if (!gameState || !socketPlayerId) return false;
    return gameState.players.some(p => p.id === socketPlayerId && p.isHost);
  };

  socket.on('CREATE_ROOM', ({ hostPlayer, settings }, callback) => {
    try {
      const { roomCode, gameState } = roomManager.createRoom(hostPlayer, settings);
      socket.join(roomCode);
      roomManager.socketToPlayer.set(socket.id, { roomCode, playerId: hostPlayer.id });

      if (typeof callback === 'function') callback({ success: true, roomCode, gameState });
      io.to(roomCode).emit('GAME_STATE_UPDATE', gameState);
    } catch (err) {
      if (typeof callback === 'function') callback({ success: false, error: err.message });
    }
  });

  socket.on('JOIN_ROOM', ({ roomCode, player }, callback) => {
    try {
      const result = roomManager.joinRoom(roomCode, player);
      if (!result.success) {
        if (typeof callback === 'function') callback(result);
        return;
      }
      const upperCode = roomCode.toUpperCase();
      socket.join(upperCode);
      roomManager.socketToPlayer.set(socket.id, { roomCode: upperCode, playerId: player.id });

      if (typeof callback === 'function') callback({ success: true, gameState: result.gameState });
      io.to(upperCode).emit('GAME_STATE_UPDATE', result.gameState);
    } catch (err) {
      if (typeof callback === 'function') callback({ success: false, error: err.message });
    }
  });

  socket.on('ADD_BOT', ({ roomCode }) => {
    const upperCode = roomCode.toUpperCase();
    if (!isHost(socket, upperCode)) {
      socket.emit('ACTION_REJECTED', { action: 'ADD_BOT', reason: 'NOT_HOST' });
      return;
    }
    const gameState = roomManager.addBot(upperCode);
    if (gameState) {
      io.to(upperCode).emit('GAME_STATE_UPDATE', gameState);
    }
  });

  socket.on('TOGGLE_READY', ({ roomCode, playerId }) => {
    const upperCode = roomCode.toUpperCase();
    const gameState = roomManager.getRoom(upperCode);
    if (!gameState) return;
    const socketPlayerId = getSocketPlayerId(socket);
    const targetId = playerId && gameState.players.some(p => p.id === playerId) ? playerId : socketPlayerId;
    const player = gameState.players.find(p => p.id === targetId);
    if (player) {
      player.isReady = !player.isReady;
      io.to(upperCode).emit('GAME_STATE_UPDATE', gameState);
    }
  });

  socket.on('START_GAME', ({ roomCode }, callback) => {
    const upperCode = roomCode.toUpperCase();
    if (!isHost(socket, upperCode)) {
      if (typeof callback === 'function') callback({ success: false, error: 'Only host can start the game' });
      socket.emit('ACTION_REJECTED', { action: 'START_GAME', reason: 'NOT_HOST' });
      return;
    }
    const gameState = roomManager.getRoom(upperCode);
    if (gameState && gameState.players.length >= 2) {
      gameState.phase = 'PLAYING';
      gameState.currentPlayerIndex = 0;
      gameState.turnNumber = 1;
      gameState.players.forEach((p, i) => {
        p.isCurrentPlayer = i === 0;
      });

      GameEngine.addLog(gameState, 'Game started!', 'success');
      io.to(upperCode).emit('GAME_STATE_UPDATE', gameState);

      BotAI.evaluateBotTurn(gameState, io, upperCode);
      if (typeof callback === 'function') callback({ success: true });
    } else {
      if (typeof callback === 'function') callback({ success: false, error: 'Not enough players to start' });
    }
  });

  socket.on('ROLL_DICE', ({ roomCode }) => {
    const ctx = authorizeOnlineAction(socket, roomCode, { action: 'ROLL_DICE', requireCurrentTurn: true, requirePhase: 'PLAYING', requireAlive: true });
    if (!ctx) return;
    const { gameState, player } = ctx;
    const success = GameEngine.handleRollDice(gameState, player.id);
    if (success) {
      io.to(ctx.roomCode).emit('GAME_STATE_UPDATE', gameState);
      BotAI.evaluateBotTurn(gameState, io, ctx.roomCode);
    }
  });

   socket.on('BUY_PROPERTY', ({ roomCode, tileId }) => {
    const ctx = authorizeOnlineAction(socket, roomCode, { action: 'BUY_PROPERTY', requireCurrentTurn: true, requirePhase: 'PLAYING', requireAlive: true });
    if (!ctx) return;
    const { gameState, player } = ctx;
    const success = GameEngine.buyProperty(gameState, player.id, tileId);
    if (success) {
      io.to(ctx.roomCode).emit('GAME_STATE_UPDATE', gameState);
    }
  });

   socket.on('BUY_HOUSE', ({ roomCode, tileId }) => {
    const ctx = authorizeOnlineAction(socket, roomCode, { action: 'BUY_HOUSE', requireCurrentTurn: true, requirePhase: 'PLAYING', requireAlive: true });
    if (!ctx) return;
    const { gameState, player } = ctx;
    const success = GameEngine.buyHouse(gameState, player.id, tileId);
    if (success) {
      io.to(ctx.roomCode).emit('GAME_STATE_UPDATE', gameState);
    }
  });

   socket.on('BUY_HOTEL', ({ roomCode, tileId }) => {
    const ctx = authorizeOnlineAction(socket, roomCode, { action: 'BUY_HOTEL', requireCurrentTurn: true, requirePhase: 'PLAYING', requireAlive: true });
    if (!ctx) return;
    const { gameState, player } = ctx;
    const success = GameEngine.buyHotel(gameState, player.id, tileId);
    if (success) {
      io.to(ctx.roomCode).emit('GAME_STATE_UPDATE', gameState);
    }
  });

   socket.on('DECLINE_PROPERTY', ({ roomCode, tileId }) => {
    const ctx = authorizeOnlineAction(socket, roomCode, { action: 'DECLINE_PROPERTY', requireCurrentTurn: true, requirePhase: 'PLAYING', requireAlive: true });
    if (!ctx) return;
    const { gameState, player } = ctx;
    GameEngine.declinePropertyPurchase(gameState, player.id, tileId);
    io.to(ctx.roomCode).emit('GAME_STATE_UPDATE', gameState);
    BotAI.evaluateBotTurn(gameState, io, ctx.roomCode);
  });

    socket.on('START_AUCTION', ({ roomCode, tileId }) => {
    const ctx = authorizeOnlineAction(socket, roomCode, { action: 'START_AUCTION', requireCurrentTurn: true, requirePhase: 'PLAYING', requireAlive: true });
    if (!ctx) return;
    const { gameState, player } = ctx;
    const success = GameEngine.startAuction(gameState, tileId, player.id);
    if (!success) {
      socket.emit('ACTION_REJECTED', { action: 'START_AUCTION', reason: 'AUCTION_UNAVAILABLE' });
      return;
    }
    io.to(ctx.roomCode).emit('GAME_STATE_UPDATE', gameState);
    BotAI.evaluateBotTurn(gameState, io, ctx.roomCode);
  });

   socket.on('PLACE_BID', ({ roomCode, bidAmount }) => {
    const ctx = authorizeOnlineAction(socket, roomCode, { action: 'PLACE_BID', requirePhase: 'PLAYING', requireAlive: true });
    if (!ctx) return;
    const { gameState, player } = ctx;
    GameEngine.placeBid(gameState, player.id, bidAmount);
    io.to(ctx.roomCode).emit('GAME_STATE_UPDATE', gameState);
    BotAI.evaluateBotTurn(gameState, io, ctx.roomCode);
  });

   socket.on('PASS_BID', ({ roomCode }) => {
    const ctx = authorizeOnlineAction(socket, roomCode, { action: 'PASS_BID', requirePhase: 'PLAYING', requireAlive: true });
    if (!ctx) return;
    const { gameState, player } = ctx;
    GameEngine.passBid(gameState, player.id);
    io.to(ctx.roomCode).emit('GAME_STATE_UPDATE', gameState);
    BotAI.evaluateBotTurn(gameState, io, ctx.roomCode);
  });

   socket.on('PROPOSE_TRADE', ({ roomCode, tradeData }) => {
    const ctx = authorizeOnlineAction(socket, roomCode, { action: 'PROPOSE_TRADE', requirePhase: 'PLAYING', requireAlive: true });
    if (!ctx) return;
    const { gameState, player: sender } = ctx;
    const receiver = gameState.players.find(p => p.id === tradeData.receiverId);
    if (!receiver || sender.id === receiver.id) return;

    const offeredProperties = tradeData.offeredPropertyIds || [];
    const requestedProperties = tradeData.requestedPropertyIds || [];

    const senderOwnsOffered = offeredProperties.every(id => sender.properties.includes(id));
    const receiverOwnsRequested = requestedProperties.every(id => receiver.properties.includes(id));
    if (!senderOwnsOffered || !receiverOwnsRequested) return;
    
    const offeredMoney = tradeData.offeredMoney || 0;
    const requestedMoney = tradeData.requestedMoney || 0;
    
    if (sender.money < offeredMoney) return;
    if (receiver.money < requestedMoney) return;

      gameState.trade = {
        id: `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`,
        fromPlayerId: sender.id,
        toPlayerId: receiver.id,
        offeredMoney,
        offeredProperties,
        requestedMoney,
        requestedProperties,
        status: 'pending',
        createdAt: Date.now(),
        revision: 1,
      };
    GameEngine.addLog(gameState, `${sender.name} proposed a trade deal to ${receiver.name}!`, 'action');
    io.to(ctx.roomCode).emit('GAME_STATE_UPDATE', gameState);
  });

    socket.on('END_TURN', ({ roomCode }) => {
    const ctx = authorizeOnlineAction(socket, roomCode, { action: 'END_TURN', requireCurrentTurn: true, requirePhase: 'PLAYING', requireAlive: true });
    if (!ctx) return;
    const { gameState } = ctx;
    GameEngine.endTurn(gameState);
    io.to(ctx.roomCode).emit('GAME_STATE_UPDATE', gameState);
    BotAI.evaluateBotTurn(gameState, io, ctx.roomCode);
  });

    socket.on('PAY_JAIL', ({ roomCode }) => {
    const ctx = authorizeOnlineAction(socket, roomCode, { action: 'PAY_JAIL', requireCurrentTurn: true, requirePhase: 'PLAYING', requireAlive: true });
    if (!ctx) return;
    const { gameState, player } = ctx;
    const success = GameEngine.leaveJail(gameState, player.id, true);
    if (success) {
      io.to(ctx.roomCode).emit('GAME_STATE_UPDATE', gameState);
    }
  });

    socket.on('USE_JAIL_CARD', ({ roomCode }) => {
    const ctx = authorizeOnlineAction(socket, roomCode, { action: 'USE_JAIL_CARD', requireCurrentTurn: true, requirePhase: 'PLAYING', requireAlive: true });
    if (!ctx) return;
    const { gameState, player } = ctx;
    if (player.inJail && player.getOutOfJailCards > 0) {
      const success = GameEngine.leaveJail(gameState, player.id, false);
      if (success) {
        io.to(ctx.roomCode).emit('GAME_STATE_UPDATE', gameState);
      }
    }
  });

    socket.on('PAY_INCOME_TAX', ({ roomCode, fixed }) => {
    const ctx = authorizeOnlineAction(socket, roomCode, { action: 'PAY_INCOME_TAX', requireCurrentTurn: true, requirePhase: 'PLAYING', requireAlive: true });
    if (!ctx) return;
    const { gameState, player } = ctx;
    if (player && gameState.turnState.phase === 'TAX_DECISION') {
       if (fixed) {
         player.money -= 200;
         GameEngine.addLog(gameState, `${player.name} paid $200 Income Tax`, 'warning', player.id);
       } else {
         const netWorth = GameEngine.calculateNetWorth(player);
         const percent = Math.round(netWorth * 0.1);
         player.money -= percent;
         GameEngine.addLog(gameState, `${player.name} paid 10% (${percent}) Income Tax`, 'warning', player.id);
       }
      gameState.turnState.phase = 'ACTION';
      io.to(ctx.roomCode).emit('GAME_STATE_UPDATE', gameState);
    }
  });

    socket.on('TRADE_RESPONSE', ({ roomCode, accepted }) => {
    const ctx = authorizeOnlineAction(socket, roomCode, { action: 'TRADE_RESPONSE', requirePhase: 'PLAYING', requireAlive: true });
    if (!ctx) return;
    const { gameState, player } = ctx;
    if (gameState.trade && gameState.trade.status === 'pending' && gameState.trade.toPlayerId === player.id) {
      if (accepted) {
        GameEngine.executeTrade(gameState, gameState.trade.id);
        BotAI.evaluateBotTurn(gameState, io, ctx.roomCode);
      } else {
        GameEngine.rejectTrade(gameState, gameState.trade.id);
        BotAI.evaluateBotTurn(gameState, io, ctx.roomCode);
      }
      io.to(ctx.roomCode).emit('GAME_STATE_UPDATE', gameState);
    }
  });

    socket.on('COUNTER_TRADE', ({ roomCode, tradeId, counterOffer }) => {
    const ctx = authorizeOnlineAction(socket, roomCode, { action: 'COUNTER_TRADE', requirePhase: 'PLAYING', requireAlive: true });
    if (!ctx) return;
    const { gameState, player } = ctx;
    if (gameState.trade && gameState.trade.status === 'pending' && gameState.trade.toPlayerId === player.id && gameState.trade.id === tradeId) {
      const success = GameEngine.counterTrade(gameState, tradeId, counterOffer);
      if (success) {
        io.to(ctx.roomCode).emit('GAME_STATE_UPDATE', gameState);
        BotAI.evaluateBotTurn(gameState, io, ctx.roomCode);
      }
    }
  });

    socket.on('MORTGAGE_PROPERTY', ({ roomCode, tileId }) => {
    const ctx = authorizeOnlineAction(socket, roomCode, { action: 'MORTGAGE_PROPERTY', requireCurrentTurn: true, requirePhase: 'PLAYING', requireAlive: true });
    if (!ctx) return;
    const { gameState, player } = ctx;
    if (GameEngine.mortgageProperty(gameState, player.id, tileId)) {
      io.to(ctx.roomCode).emit('GAME_STATE_UPDATE', gameState);
    }
  });

    socket.on('UNMORTGAGE_PROPERTY', ({ roomCode, tileId }) => {
    const ctx = authorizeOnlineAction(socket, roomCode, { action: 'UNMORTGAGE_PROPERTY', requireCurrentTurn: true, requirePhase: 'PLAYING', requireAlive: true });
    if (!ctx) return;
    const { gameState, player } = ctx;
    if (GameEngine.unmortgageProperty(gameState, player.id, tileId)) {
      io.to(ctx.roomCode).emit('GAME_STATE_UPDATE', gameState);
    }
  });

    socket.on('SELL_HOUSES', ({ roomCode, tileId }) => {
    const ctx = authorizeOnlineAction(socket, roomCode, { action: 'SELL_HOUSES', requireCurrentTurn: true, requirePhase: 'PLAYING', requireAlive: true });
    if (!ctx) return;
    const { gameState, player } = ctx;
    if (GameEngine.sellHouses(gameState, player.id, tileId)) {
      io.to(ctx.roomCode).emit('GAME_STATE_UPDATE', gameState);
    }
  });

    socket.on('RESOLVE_DEBT', ({ roomCode, action, tileId }) => {
    const ctx = authorizeOnlineAction(socket, roomCode, { action: 'RESOLVE_DEBT', requireCurrentTurn: true, requirePhase: 'PLAYING', requireAlive: true });
    if (!ctx) return;
    const { gameState, player } = ctx;
    const changed = GameEngine.resolveDebt(gameState, player.id, action, tileId);
    if (changed) {
      io.to(ctx.roomCode).emit('GAME_STATE_UPDATE', gameState);
      BotAI.evaluateBotTurn(gameState, io, ctx.roomCode);
    }
  });

    socket.on('DECLARE_BANKRUPTCY', ({ roomCode }) => {
    const ctx = authorizeOnlineAction(socket, roomCode, { action: 'DECLARE_BANKRUPTCY', requireCurrentTurn: true, requirePhase: 'PLAYING', requireAlive: true });
    if (!ctx) return;
    const { gameState, player } = ctx;
    if (GameEngine.declareBankruptcy(gameState, player.id)) {
      io.to(ctx.roomCode).emit('GAME_STATE_UPDATE', gameState);
      BotAI.evaluateBotTurn(gameState, io, ctx.roomCode);
    }
  });

    socket.on('disconnect', () => {
     const session = roomManager.socketToPlayer.get(socket.id);
     if (session) {
       const upperCode = session.roomCode.toUpperCase();
       const gameState = roomManager.getRoom(upperCode);
       if (gameState) {
         const player = gameState.players.find(p => p.id === session.playerId);
         if (player) player.connected = false;
         io.to(upperCode).emit('GAME_STATE_UPDATE', gameState);
       }
       roomManager.socketToPlayer.delete(socket.id);
     }
   });

   socket.on('RECONNECT', ({ roomCode, playerId }) => {
     const upperCode = roomCode.toUpperCase();
     const gameState = roomManager.getRoom(upperCode);
     if (gameState) {
       socket.join(upperCode);
       roomManager.socketToPlayer.set(socket.id, { roomCode: upperCode, playerId });

       if (playerId) {
         const player = gameState.players.find(p => p.id === playerId);
         if (player) player.connected = true;
       }

       io.to(upperCode).emit('GAME_STATE_UPDATE', gameState);
     } else {
       socket.emit('ROOM_NOT_FOUND', { roomCode });
     }
   });
 });

 const PORT = process.env.PORT || 3001;
 server.listen(PORT, () => {
   console.log(`[Estate Empire Server] Running on http://localhost:${PORT}`);
 });
