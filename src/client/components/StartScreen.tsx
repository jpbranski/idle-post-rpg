// src/client/components/StartScreen.tsx

import type { Screen } from '../App';
import useGameState from '../hooks/useGameState';
import { calculateOfflineProgress } from '../../shared/helpers/calculations';

export default function StartScreen({ goTo }: { goTo: (s: Screen) => void }) {
  const { state } = useGameState();

  // Calculate offline gains
  const offlineKarma = calculateOfflineProgress(state);
  const hasProgress = state.score > 0;

  return (
    <div className="screen start-screen">
      <div className="title-card">
        <h1>🎮 Idle Post RPG</h1>
        <p className="subtitle">Farm that karma!</p>
      </div>

      {/* Offline Progress Notification */}
      {offlineKarma > 0 && (
        <div className="offline-gains">
          <h3>Welcome Back!</h3>
          <p>
            You earned <strong>{offlineKarma.toLocaleString()}</strong> karma while you were away
          </p>
        </div>
      )}

      {/* Main Menu Buttons */}
      <div className="menu-buttons">
        <button className="menu-btn-large" onClick={() => goTo('game')}>
          {hasProgress ? 'Continue' : 'Start Game'}
        </button>
        <button className="menu-btn-secondary" onClick={() => goTo('leaderboard')}>
          📊 Leaderboard
        </button>
        <button className="menu-btn-secondary" onClick={() => goTo('settings')}>
          ⚙️ Settings
        </button>
      </div>

      {/* Stats Preview */}
      {hasProgress && (
        <div className="stats-preview">
          <h3>Your Progress</h3>
          <div className="preview-grid">
            <div className="preview-stat">
              <span className="preview-label">Total Score</span>
              <span className="preview-value">{Math.floor(state.score).toLocaleString()}</span>
            </div>
            <div className="preview-stat">
              <span className="preview-label">Awards</span>
              <span className="preview-value">{state.awards}</span>
            </div>
            <div className="preview-stat">
              <span className="preview-label">Prestige</span>
              <span className="preview-value">Lvl {state.prestige.level}</span>
            </div>
            <div className="preview-stat">
              <span className="preview-label">Achievements</span>
              <span className="preview-value">{state.achievements.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="start-footer">
        <p>A Reddit Devvit Game</p>
      </footer>
    </div>
  );
}
