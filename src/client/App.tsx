// src/client/App.tsx

import { useEffect, useState } from 'react';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import Leaderboard from './components/Leaderboard';
import Settings from './components/Settings';
import useGameState from './hooks/useGameState';

export type Screen = 'start' | 'game' | 'leaderboard' | 'settings';

export default function App() {
  const [screen, setScreen] = useState<Screen>('start');
  const { state } = useGameState();

  // Apply theme to document
  useEffect(() => {
    document.body.setAttribute('data-theme', state.settings.theme);
  }, [state.settings.theme]);

  // Render current screen
  switch (screen) {
    case 'game':
      return <GameScreen goTo={setScreen} />;
    case 'leaderboard':
      return <Leaderboard goTo={setScreen} />;
    case 'settings':
      return <Settings goTo={setScreen} />;
    default:
      return <StartScreen goTo={setScreen} />;
  }
}