// src/client/components/Settings.tsx

import type { Screen } from '../App';
import useGameState from '../hooks/useGameState';

export default function Settings({ goTo }: { goTo: (s: Screen) => void }) {
  const { state, changeTheme, toggleAnonymous, resetGame } = useGameState();

  const handleReset = () => {
    if (confirm('Are you sure you want to delete your save? This cannot be undone!')) {
      if (confirm('Really? All progress will be lost forever!')) {
        resetGame();
        goTo('start');
      }
    }
  };

  return (
    <div className="screen settings-screen">
      <div className="header">
        <h2>⚙️ Settings</h2>
        <button className="back-btn" onClick={() => goTo('game')}>
          ← Back
        </button>
      </div>

      {/* Theme Selection */}
      <section className="settings-section">
        <h3>🎨 Theme</h3>
        <div className="theme-grid">
          {state.unlocks.themes.map((theme) => (
            <button
              key={theme}
              onClick={() => changeTheme(theme)}
              className={`theme-btn ${state.settings.theme === theme ? 'active' : ''}`}
            >
              {theme === 'light' && '☀️ Light'}
              {theme === 'dark' && '🌙 Dark'}
              {theme === 'oldschool' && '📰 Old School'}
              {theme === 'terminal' && '💻 Terminal'}
              {theme === 'cherry' && '🌸 Cherry Blossom'}
              {theme === 'win98' && '🖥️ Windows 98'}
              {theme === 'gold' && '✨ Gold'}
            </button>
          ))}
        </div>
        <p className="hint">Unlock more themes in the Award Shop!</p>
      </section>

      {/* Privacy */}
      <section className="settings-section">
        <h3>🔒 Privacy</h3>
        <label className="checkbox-label">
          <input type="checkbox" checked={state.settings.anonymous} onChange={toggleAnonymous} />
          <span>Anonymous Mode (hide from leaderboard)</span>
        </label>
      </section>

      {/* Stats */}
      <section className="settings-section">
        <h3>📊 Stats</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Total Clicks</span>
            <span className="stat-value">{state.stats.totalClicks.toLocaleString()}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Karma Earned</span>
            <span className="stat-value">
              {Math.floor(state.stats.totalKarmaEarned).toLocaleString()}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Time Played</span>
            <span className="stat-value">{formatTime(state.stats.timePlayed)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Prestige Level</span>
            <span className="stat-value">{state.prestige.level}</span>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="settings-section danger-zone">
        <h3>⚠️ Danger Zone</h3>
        <button onClick={handleReset} className="delete-btn">
          Delete Save
        </button>
        <p className="warning">This will permanently delete all your progress!</p>
      </section>
    </div>
  );
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}
