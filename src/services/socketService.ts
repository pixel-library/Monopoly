// Socket Service for Estate Empire Client Synchronization

import { io, Socket } from 'socket.io-client';
import { useGameStore } from '../state/gameStore';
import { Player, GameSettings } from '../types';

class SocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private roomCode: string | null = null;

  connect(): Socket {
    if (!this.socket) {
      this.socket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:3001', {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
      });

      this.socket.on('connect', () => {
        this.isConnected = true;
        console.log('[SocketClient] Connected to backend on port 3001');
      });

      this.socket.on('disconnect', () => {
        this.isConnected = false;
        console.log('[SocketClient] Disconnected from server');
      });

      this.socket.on('ROOM_NOT_FOUND', () => {
        console.log('[SocketClient] Room not found on server, resetting state');
        useGameStore.getState().resetGame();
        this.roomCode = null;
        this.socket?.disconnect();
        this.socket = null;
        this.isConnected = false;
      });

      this.socket.on('GAME_STATE_UPDATE', (serverState: any) => {
        if (serverState) {
          const store = useGameStore.getState();
          if (serverState.roomCode && serverState.roomCode !== store.roomCode) {
            store.setRoomCode(serverState.roomCode);
          }
          useGameStore.setState({
            gameId: serverState.gameId ?? store.gameId,
            roomCode: serverState.roomCode ?? store.roomCode,
            phase: serverState.phase,
            players: serverState.players,
            currentPlayerIndex: serverState.currentPlayerIndex,
            turnNumber: serverState.turnNumber,
            dice: serverState.dice,
            turnState: serverState.turnState,
            winner: serverState.winner,
            trade: serverState.trade,
            auction: serverState.auction,
            logs: serverState.logs || [],
            bankHouses: serverState.bankHouses ?? store.bankHouses,
            bankHotels: serverState.bankHotels ?? store.bankHotels,
            mortgagedProperties: serverState.mortgagedProperties || store.mortgagedProperties,
            settings: serverState.settings ?? store.settings,
            lastAction: serverState.lastAction ?? store.lastAction,
          });
        }
      });
    }
    return this.socket;
  }

  createRoom(hostPlayer: Player, settings: Partial<GameSettings>): Promise<{ success: boolean; roomCode?: string; error?: string }> {
    return new Promise((resolve) => {
      const socket = this.connect();
      const timeout = setTimeout(() => {
        resolve({ success: false, error: 'Server unreachable. Is the server running on port 3001?' });
      }, 5000);

      socket.emit('CREATE_ROOM', { hostPlayer, settings }, (response: any) => {
        clearTimeout(timeout);
        if (response.success) {
          this.roomCode = response.roomCode;
          useGameStore.getState().setRoomCode(response.roomCode);
          useGameStore.getState().setMyPlayerId(hostPlayer.id);
          resolve({ success: true, roomCode: response.roomCode });
        } else {
          resolve({ success: false, error: response.error || 'Failed to create room' });
        }
      });
    });
  }

  joinRoom(roomCode: string, player: Player): Promise<{ success: boolean; error?: string }> {
    const socket = this.connect();
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve({ success: false, error: 'Server unreachable. Is the server running on port 3001?' });
      }, 5000);

      socket.emit('JOIN_ROOM', { roomCode, player }, (response: any) => {
        clearTimeout(timeout);
        if (response.success) {
          this.roomCode = roomCode.toUpperCase();
          useGameStore.getState().setRoomCode(roomCode.toUpperCase());
          useGameStore.getState().setMyPlayerId(player.id);
          resolve({ success: true });
        } else {
          resolve({ success: false, error: response.error || 'Room not found' });
        }
      });
    });
  }

  addBot(roomCode: string) {
    if (this.socket) {
      this.socket.emit('ADD_BOT', { roomCode });
    }
  }

  toggleReady(roomCode: string, playerId: string) {
    if (this.socket) {
      this.socket.emit('TOGGLE_READY', { roomCode, playerId });
    }
  }

  startGame(roomCode: string): Promise<{ success: boolean; error?: string }> {
    const socket = this.connect();
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve({ success: false, error: 'Server unreachable. Is the server running on port 3001?' });
      }, 5000);

      socket.emit('START_GAME', { roomCode }, (response: any) => {
        clearTimeout(timeout);
        if (response?.success) {
          resolve({ success: true });
        } else {
          resolve({ success: false, error: response?.error || 'Failed to start game' });
        }
      });
    });
  }

  rollDice(roomCode: string, playerId: string) {
    if (this.socket) {
      this.socket.emit('ROLL_DICE', { roomCode, playerId });
    }
  }

   buyProperty(roomCode: string, playerId: string, tileId: number) {
    if (this.socket) {
      this.socket.emit('BUY_PROPERTY', { roomCode, playerId, tileId });
    }
  }

  buyHouse(roomCode: string, playerId: string, tileId: number) {
    if (this.socket) {
      this.socket.emit('BUY_HOUSE', { roomCode, playerId, tileId });
    }
  }

  buyHotel(roomCode: string, playerId: string, tileId: number) {
    if (this.socket) {
      this.socket.emit('BUY_HOTEL', { roomCode, playerId, tileId });
    }
  }

  declineProperty(roomCode: string, playerId: string, tileId: number) {
    if (this.socket) {
      this.socket.emit('DECLINE_PROPERTY', { roomCode, playerId, tileId });
    }
  }

  startAuction(roomCode: string, playerId: string, tileId: number) {
    if (this.socket) {
      this.socket.emit('START_AUCTION', { roomCode, playerId, tileId });
    }
  }

  placeBid(roomCode: string, playerId: string, bidAmount: number) {
    if (this.socket) {
      this.socket.emit('PLACE_BID', { roomCode, playerId, bidAmount });
    }
  }

  passBid(roomCode: string, playerId: string) {
    if (this.socket) {
      this.socket.emit('PASS_BID', { roomCode, playerId });
    }
  }

  payJail(roomCode: string, playerId: string) {
    if (this.socket) {
      this.socket.emit('PAY_JAIL', { roomCode, playerId });
    }
  }

  useJailCard(roomCode: string, playerId: string) {
    if (this.socket) {
      this.socket.emit('USE_JAIL_CARD', { roomCode, playerId });
    }
  }

  payIncomeTax(roomCode: string, playerId: string, fixed: boolean) {
    if (this.socket) {
      this.socket.emit('PAY_INCOME_TAX', { roomCode, playerId, fixed });
    }
  }

  endTurn(roomCode: string) {
    if (this.socket) {
      this.socket.emit('END_TURN', { roomCode });
    }
  }

   proposeTrade(roomCode: string, tradeData: any) {
    if (this.socket) {
      this.socket.emit('PROPOSE_TRADE', { roomCode, tradeData });
    }
  }

  tradeResponse(roomCode: string, playerId: string, accepted: boolean) {
    if (this.socket) {
      this.socket.emit('TRADE_RESPONSE', { roomCode, playerId, accepted });
    }
  }

  mortgageProperty(roomCode: string, playerId: string, tileId: number) {
    if (this.socket) {
      this.socket.emit('MORTGAGE_PROPERTY', { roomCode, playerId, tileId });
    }
  }

  unmortgageProperty(roomCode: string, playerId: string, tileId: number) {
    if (this.socket) {
      this.socket.emit('UNMORTGAGE_PROPERTY', { roomCode, playerId, tileId });
    }
  }

  sellHouses(roomCode: string, playerId: string, tileId: number) {
    if (this.socket) {
      this.socket.emit('SELL_HOUSES', { roomCode, playerId, tileId });
    }
  }

  resolveDebt(roomCode: string, playerId: string, action: string, tileId?: number) {
    if (this.socket) {
      this.socket.emit('RESOLVE_DEBT', { roomCode, playerId, action, tileId });
    }
  }

  declareBankruptcy(roomCode: string, playerId: string) {
    if (this.socket) {
      this.socket.emit('DECLARE_BANKRUPTCY', { roomCode, playerId });
    }
  }

   getRoomCode(): string | null {
    return this.roomCode;
  }

  reconnect(roomCode: string): void {
    const playerId = useGameStore.getState().myPlayerId;
    this.roomCode = roomCode.toUpperCase();
    useGameStore.getState().setRoomCode(roomCode.toUpperCase());
    const socket = this.connect();
    socket.emit('RECONNECT', { roomCode: roomCode.toUpperCase(), playerId });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.roomCode = null;
    }
  }
}

export const socketService = new SocketService();
