import React from 'react';
import type { Screen } from '../App';

export default function StartScreen({ goTo }: { goTo: (s: Screen) => void }) {
  return (
    <div className="screen">
      <h1>Idle Post RPG</h1>
      <button onClick={() => goTo('game')}>Start Game</button>
      <button onClick={() => goTo('leaderboard')}>Leaderboards</button>
      <button onClick={() => goTo('settings')}>Settings</button>
    </div>
  );
}
