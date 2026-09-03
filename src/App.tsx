import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SetupPage from './pages/SetupPage';
import LobbyPage from './pages/LobbyPage';
import GamePage from './pages/GamePage';
import VictoryPage from './pages/VictoryPage';
import StorePage from './pages/StorePage';
import StatsPage from './pages/StatsPage';
import { useGameStore } from './state/gameStore';
import { socketService } from './services/socketService';
import { useEffect } from 'react';

function AppRoutes() {
  const phase = useGameStore((state) => state.phase);
  const roomCode = useGameStore((state) => state.roomCode);
  const location = useLocation();

  useEffect(() => {
    if (roomCode && location.pathname === '/game') {
      socketService.reconnect(roomCode);
    }
    if (roomCode && location.pathname === '/lobby') {
      socketService.reconnect(roomCode);
    }
  }, [roomCode, location.pathname]);

  const renderSetup = () => {
    if (phase === 'PLAYING') return <Navigate to="/game" replace />;
    if (phase === 'LOBBY') return <Navigate to="/lobby" replace />;
    return <SetupPage />;
  };

  const players = useGameStore((state) => state.players);

  return (
    <Routes>
      <Route path="/" element={renderSetup()} />
      <Route
        path="/lobby"
        element={
          phase === 'PLAYING' ? <Navigate to="/game" replace /> :
          (!roomCode && players.length < 2) ? <Navigate to="/" replace /> :
          <LobbyPage />
        }
      />
      <Route path="/store" element={<StorePage />} />
      <Route path="/stats" element={<StatsPage />} />
      <Route
        path="/game"
        element={
          phase === 'PLAYING' ? <GamePage /> : <Navigate to="/lobby" replace />
        }
      />
      <Route
        path="/victory"
        element={
          phase === 'ENDED' ? <VictoryPage /> : <Navigate to="/" replace />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-board-dark">
      <AppRoutes />
    </div>
  );
}
