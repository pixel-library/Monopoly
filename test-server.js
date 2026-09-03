import { io } from 'socket.io-client';
const socket = io('http://localhost:3001', { reconnection: false, timeout: 5000 });

socket.on('connect', () => {
  console.log('CONNECT OK');
  const hostPlayer = {
    id: 'test-host-1',
    name: 'Host',
    avatarType: 'default',
    tokenId: 'token-red',
    money: 1500,
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
  };
  socket.emit('CREATE_ROOM', { hostPlayer, settings: {} }, (resp) => {
    console.log('CREATE_ROOM', JSON.stringify(resp));
    if (resp.success) {
      console.log('ROOM CODE:', resp.roomCode);
      console.log('BOARD TILES:', resp.gameState.board.length);
      console.log('TILE 1:', resp.gameState.board[1]?.name, resp.gameState.board[1]?.country);
    }
    socket.disconnect();
    process.exit(0);
  });
});

socket.on('connect_error', (err) => {
  console.log('ERROR:', err.message);
  process.exit(1);
});
