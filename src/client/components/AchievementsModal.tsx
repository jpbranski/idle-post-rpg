// src/client/components/AchievementsModal.tsx

import type { GameState } from '../../shared/types/game';
import { ACHIEVEMENTS } from '../../shared/constants/game';

interface Props {
  state: GameState;
  onClose: () => void;
}

export default function AchievementsModal({ state, onClose }: Props) {
  const unlockedAchievements = ACHIEVEMENTS.filter(a => state.achievements.includes(a.id));
  const lockedAchievements = ACHIEVEMENTS.filter(a => !state.achievements.includes(a.id) && !a.hidden);
  const progress = (unlockedAchievements.length / ACHIEVEMENTS.filter(a => !a.hidden).length * 100).toFixed(0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content achievements-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>Achievements</h2>
        <p className="progress-text">
          {unlockedAchievements.length} / {ACHIEVEMENTS.filter(a => !a.hidden).length} Unlocked ({progress}%)
        </p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <section className="achievement-section">
            <h3>✅ Unlocked</h3>
            <div className="achievement-grid">
              {unlockedAchievements.map(achievement => (
                <div key={achievement.id} className="achievement-card unlocked">
                  <div className="achievement-icon">🏆</div>
                  <div className="achievement-info">
                    <h4>{achievement.name}</h4>
                    <p>{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Locked Achievements */}
        {lockedAchievements.length > 0 && (
          <section className="achievement-section">
            <h3>🔒 Locked</h3>
            <div className="achievement-grid">
              {lockedAchievements.map(achievement => (
                <div key={achievement.id} className="achievement-card locked">
                  <div className="achievement-icon">❓</div>
                  <div className="achievement-info">
                    <h4>{achievement.name}</h4>
                    <p>{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}