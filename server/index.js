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
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

io.on('connection', (socket) => {
  console.log(`[Socket] Connected: ${socket.id}`);

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
    const gameState = roomManager.addBot(upperCode);
    if (gameState) {
      io.to(upperCode).emit('GAME_STATE_UPDATE', gameState);
    }
  });

  socket.on('TOGGLE_READY', ({ roomCode, playerId }) => {
    const upperCode = roomCode.toUpperCase();
    const gameState = roomManager.getRoom(upperCode);
    if (gameState) {
      const player = gameState.players.find(p => p.id === playerId);
      if (player) {
        player.isReady = !player.isReady;
        io.to(upperCode).emit('GAME_STATE_UPDATE', gameState);
      }
    }
  });

  socket.on('START_GAME', ({ roomCode }, callback) => {
    const upperCode = roomCode.toUpperCase();
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

  socket.on('ROLL_DICE', ({ roomCode, playerId }) => {
    const upperCode = roomCode.toUpperCase();
    const gameState = roomManager.getRoom(upperCode);
    if (gameState && gameState.phase === 'PLAYING') {
      const success = GameEngine.handleRollDice(gameState, playerId);
      if (success) {
        io.to(upperCode).emit('GAME_STATE_UPDATE', gameState);
        BotAI.evaluateBotTurn(gameState, io, upperCode);
      }
    }
  });

   socket.on('BUY_PROPERTY', ({ roomCode, playerId, tileId }) => {
     const upperCode = roomCode.toUpperCase();
     const gameState = roomManager.getRoom(upperCode);
     if (gameState) {
       const success = GameEngine.buyProperty(gameState, playerId, tileId);
       if (success) {
         io.to(upperCode).emit('GAME_STATE_UPDATE', gameState);
       }
     }
   });

   socket.on('BUY_HOUSE', ({ roomCode, playerId, tileId }) => {
     const upperCode = roomCode.toUpperCase();
     const gameState = roomManager.getRoom(upperCode);
     if (gameState) {
       const success = GameEngine.buyHouse(gameState, playerId, tileId);
       if (success) {
         io.to(upperCode).emit('GAME_STATE_UPDATE', gameState);
       }
     }
   });

   socket.on('BUY_HOTEL', ({ roomCode, playerId, tileId }) => {
     const upperCode = roomCode.toUpperCase();
     const gameState = roomManager.getRoom(upperCode);
     if (gameState) {
       const success = GameEngine.buyHotel(gameState, playerId, tileId);
       if (success) {
         io.to(upperCode).emit('GAME_STATE_UPDATE', gameState);
       }
     }
   });

   socket.on('DECLINE_PROPERTY', ({ roomCode, playerId, tileId }) => {
     const upperCode = roomCode.toUpperCase();
     const gameState = roomManager.getRoom(upperCode);
     if (gameState) {
       GameEngine.declinePropertyPurchase(gameState, playerId, tileId);
       io.to(upperCode).emit('GAME_STATE_UPDATE', gameState);
       BotAI.evaluateBotTurn(gameState, io, upperCode);
     }
   });

    socket.on('START_AUCTION', ({ roomCode, playerId, tileId }) => {
      const upperCode = roomCode.toUpperCase();
      const gameState = roomManager.getRoom(upperCode);
      if (gameState) {
        GameEngine.startAuction(gameState, tileId, playerId);
        io.to(upperCode).emit('GAME_STATE_UPDATE', gameState);
        BotAI.evaluateBotTurn(gameState, io, upperCode);
      }
    });

   socket.on('PLACE_BID', ({ roomCode, playerId, bidAmount }) => {
     const upperCode = roomCode.toUpperCase();
     const gameState = roomManager.getRoom(upperCode);
     if (gameState) {
       GameEngine.placeBid(gameState, playerId, bidAmount);
       io.to(upperCode).emit('GAME_STATE_UPDATE', gameState);
       BotAI.evaluateBotTurn(gameState, io, upperCode);
     }
   });

   socket.on('PASS_BID', ({ roomCode, playerId }) => {
     const upperCode = roomCode.toUpperCase();
     const gameState = roomManager.getRoom(upperCode);
     if (gameState) {
       GameEngine.passBid(gameState, playerId);
       io.to(upperCode).emit('GAME_STATE_UPDATE', gameState);
       BotAI.evaluateBotTurn(gameState, io, upperCode);
     }
   });

   socket.on('PROPOSE_TRADE', ({ roomCode, tradeData }) => {
     const upperCode = roomCode.toUpperCase();
     const gameState = roomManager.getRoom(upperCode);
     if (gameState) {
       const sender = gameState.players.find(p => p.id === tradeData.senderId);
       const receiver = gameState.players.find(p => p.id === tradeData.receiverId);
       if (!sender || !receiver || sender.id === receiver.id) return;

       const offeredProperties = tradeData.offeredPropertyIds || [];
       const requestedProperties = tradeData.requestedPropertyIds || [];

       const senderOwnsOffered = offeredProperties.every(id => sender.properties.includes(id));
       const receiverOwnsRequested = requestedProperties.every(id => receiver.properties.includes(id));
       if (!senderOwnsOffered || !receiverOwnsRequested) return;

        gameState.trade = {
          id: `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`,
          fromPlayerId: sender.id,
          toPlayerId: receiver.id,
          offeredMoney: tradeData.offeredMoney || 0,
          offeredProperties,
          requestedMoney: tradeData.requestedMoney || 0,
          requestedProperties,
          status: 'pending',
          createdAt: Date.now(),
        };
       GameEngine.addLog(gameState, `${sender.name} proposed a trade deal to ${receiver.name}!`, 'action');
       io.to(upperCode).emit('GAME_STATE_UPDATE', gameState);
     }
   });

    socket.on('END_TURN', ({ roomCode }) => {
     const upperCode = roomCode.toUpperCase();
     const gameState = roomManager.getRoom(upperCode);
     if (gameState) {
       GameEngine.endTurn(gameState);
       io.to(upperCode).emit('GAME_STATE_UPDATE', gameState);
       BotAI.evaluateBotTurn(gameState, io, upperCode);
     }
   });

    socket.on('PAY_JAIL', ({ roomCode, playerId }) => {
      const upperCode = roomCode.toUpperCase();
      const gameState = roomManager.getRoom(upperCode);
      if (gameState && gameState.phase === 'PLAYING') {
        const success = GameEngine.leaveJail(gameState, playerId, true);
        if (success) {
          io.to(upperCode).emit('GAME_STATE_UPDATE', gameState);
        }
      }
    });

    socket.on('USE_JAIL_CARD', ({ roomCode, playerId }) => {
      const upperCode = roomCode.toUpperCase();
      const gameState = roomManager.getRoom(upperCode);
      if (gameState && gameState.phase === 'PLAYING') {
        const player = gameState.players.find(p => p.id === playerId);
        if (player && player.inJail && player.getOutOfJailCards > 0) {
          const success = GameEngine.leaveJail(gameState, playerId, false);
          if (success) {
            io.to(upperCode).emit('GAME_STATE_UPDATE', gameState);
          }
        }
      }
    });

    socket.on('PAY_INCOME_TAX', ({ roomCode, playerId, fixed }) => {
      const upperCode = roomCode.toUpperCase();
      const gameState = roomManager.getRoom(upperCode);
      if (gameState && gameState.phase === 'PLAYING') {
        const player = gameState.players.find(p => p.id === playerId);
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
          io.to(upperCode).emit('GAME_STATE_UPDATE', gameState);
        }
      }
    });

     socket.on('TRADE_RESPONSE', ({ roomCode, playerId, accepted }) => {
       const upperCode = roomCode.toUpperCase();
       const gameState = roomManager.getRoom(upperCode);
       if (gameState && gameState.trade && gameState.trade.status === 'pending') {
         if (accepted) {
           GameEngine.executeTrade(gameState, gameState.trade.id);
           BotAI.evaluateBotTurn(gameState, io, upperCode);
         } else {
           GameEngine.rejectTrade(gameState, gameState.trade.id);
           BotAI.evaluateBotTurn(gameState, io, upperCode);
         }
         io.to(upperCode).emit('GAME_STATE_UPDATE', gameState);
       }
     });

     socket.on('MORTGAGE_PROPERTY', ({ roomCode, playerId, tileId }) => {
       const upperCode = roomCode.toUpperCase();
       const gameState = roomManager.getRoom(upperCode);
       if (gameState && gameState.phase === 'PLAYING') {
         const player = gameState.players.find(p => p.id === playerId);
         if (player && !player.bankrupt && gameState.players[gameState.currentPlayerIndex].id === playerId) {
           if (GameEngine.mortgageProperty(gameState, playerId, tileId)) {
             io.to(upperCode).emit('GAME_STATE_UPDATE', gameState);
           }
         }
       }
     });

     socket.on('UNMORTGAGE_PROPERTY', ({ roomCode, playerId, tileId }) => {
       const upperCode = roomCode.toUpperCase();
       const gameState = roomManager.getRoom(upperCode);
       if (gameState && gameState.phase === 'PLAYING') {
         const player = gameState.players.find(p => p.id === playerId);
         if (player && !player.bankrupt && gameState.players[gameState.currentPlayerIndex].id === playerId) {
           if (GameEngine.unmortgageProperty(gameState, playerId, tileId)) {
             io.to(upperCode).emit('GAME_STATE_UPDATE', gameState);
           }
         }
       }
     });

     socket.on('SELL_HOUSES', ({ roomCode, playerId, tileId }) => {
       const upperCode = roomCode.toUpperCase();
       const gameState = roomManager.getRoom(upperCode);
       if (gameState && gameState.phase === 'PLAYING') {
         const player = gameState.players.find(p => p.id === playerId);
         if (player && !player.bankrupt && gameState.players[gameState.currentPlayerIndex].id === playerId) {
           if (GameEngine.sellHouses(gameState, playerId, tileId)) {
             io.to(upperCode).emit('GAME_STATE_UPDATE', gameState);
           }
         }
       }
     });

     socket.on('RESOLVE_DEBT', ({ roomCode, playerId, action, tileId }) => {
       const upperCode = roomCode.toUpperCase();
       const gameState = roomManager.getRoom(upperCode);
       if (gameState && gameState.phase === 'PLAYING') {
         const player = gameState.players.find(p => p.id === playerId);
         if (player && !player.bankrupt && gameState.players[gameState.currentPlayerIndex].id === playerId) {
           const changed = GameEngine.resolveDebt(gameState, playerId, action, tileId);
           if (changed) {
             io.to(upperCode).emit('GAME_STATE_UPDATE', gameState);
             BotAI.evaluateBotTurn(gameState, io, upperCode);
           }
         }
       }
     });

     socket.on('DECLARE_BANKRUPTCY', ({ roomCode, playerId }) => {
       const upperCode = roomCode.toUpperCase();
       const gameState = roomManager.getRoom(upperCode);
       if (gameState && gameState.phase === 'PLAYING') {
         const player = gameState.players.find(p => p.id === playerId);
         if (player && !player.bankrupt && gameState.players[gameState.currentPlayerIndex].id === playerId) {
           if (GameEngine.declareBankruptcy(gameState, playerId)) {
             io.to(upperCode).emit('GAME_STATE_UPDATE', gameState);
             BotAI.evaluateBotTurn(gameState, io, upperCode);
           }
         }
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
