import React, { useEffect, useState } from 'react';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import Leaderboard from './components/Leaderboard';
import Settings from './components/Settings';
import Upgrades from './components/Upgrades';
import useGameState from './hooks/useGameState';

export type Screen = 'start' | 'game' | 'leaderboard' | 'settings' | 'upgrades';

export default function App() {
  const [screen, setScreen] = useState<Screen>('start');
  const { state } = useGameState();

  useEffect(() => {
    document.body.setAttribute('data-theme', state.theme ?? 'light');
  }, [state.theme]);

  switch (screen) {
    case 'game':
      return <GameScreen goTo={setScreen} />;
    case 'leaderboard':
      return <Leaderboard goTo={setScreen} />;
    case 'settings':
      return <Settings goTo={setScreen} />;
    case 'upgrades':
      return <Upgrades goTo={setScreen} />; // ✅ new screen
    default:
      return <StartScreen goTo={setScreen} />;
  }
}
