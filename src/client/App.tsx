// src/client/App.tsx

import { useEffect, useState } from 'react';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import Leaderboard from './components/Leaderboard';
import Settings from './components/Settings';
import useGameState from './hooks/useGameState';

export type Screen = 'start' | 'game' | 'leaderboard' | 'settings';
export type GameStateHook = ReturnType<typeof useGameState>;

export default function App() {
  const [screen, setScreen] = useState<Screen>('start');
  const gameState = useGameState(); // Keep state at App level!

  // Apply theme to document
  useEffect(() => {
    document.body.setAttribute('data-theme', gameState.state.settings.theme);
  }, [gameState.state.settings.theme]);

  // Render current screen (pass gameState as prop)
  switch (screen) {
    case 'game':
      return <GameScreen goTo={setScreen} gameState={gameState} />;
    case 'leaderboard':
      return <Leaderboard goTo={setScreen} gameState={gameState} />;
    case 'settings':
      return <Settings goTo={setScreen} gameState={gameState} />;
    default:
      return <StartScreen goTo={setScreen} gameState={gameState} />;
  }
}
