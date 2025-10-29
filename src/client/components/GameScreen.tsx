// src/client/components/GameScreen.tsx

import { useState } from 'react';
import type { Screen } from '../App';
import useGameState from '../hooks/useGameState';
import {
  getClickValue,
  getPassivePerSecond,
  getAwardChance,
} from '../../shared/helpers/calculations';
import UpgradesModal from './UpgradesModal';
import ShopModal from './ShopModal';
import AchievementsModal from './AchievementsModal';
import '../styles/GameScreen.css';

export default function GameScreen({ goTo }: { goTo: (s: Screen) => void }) {
  const { state, handleClick, buyUpgrade, buyPassive, buyInfinite } = useGameState();
  const [showUpgrades, setShowUpgrades] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  const clickValue = getClickValue(state);
  const passivePerSec = getPassivePerSecond(state);
  const awardChance = (getAwardChance(state) * 100).toFixed(2);

  // Check for active effects
  const activeEffects = state.activeEffects.filter((e) => e.endsAt > Date.now());
  const hasSpam = activeEffects.some((e) => e.type === 'spam');
  const hasBan = activeEffects.some((e) => e.type === 'ban');
  const hasTrending = activeEffects.some((e) => e.type === 'trending');
  const hasAutoclicker = activeEffects.some((e) => e.type === 'autoclicker');

  return (
    <div className="screen game-screen">
      {/* Header */}
      <div className="header">
        <h1>Idle Post RPG</h1>
        <button className="menu-btn" onClick={() => goTo('start')}>
          ☰
        </button>
      </div>

      {/* Stats Display */}
      <div className="stats-panel">
        <div className="stat">
          <span className="label">Karma</span>
          <span className="value">{Math.floor(state.karma).toLocaleString()}</span>
        </div>
        <div className="stat">
          <span className="label">Score</span>
          <span className="value">{Math.floor(state.score).toLocaleString()}</span>
        </div>
        <div className="stat">
          <span className="label">Awards</span>
          <span className="value">{state.awards}</span>
        </div>
        <div className="stat">
          <span className="label">Passive/sec</span>
          <span className="value">{passivePerSec.toLocaleString()}</span>
        </div>
      </div>

      {/* Active Effects */}
      {activeEffects.length > 0 && (
        <div className="active-effects">
          {hasTrending && <div className="effect trending">🔥 TRENDING! 2x Karma</div>}
          {hasBan && <div className="effect ban">🚫 BANNED! 50% Penalty</div>}
          {hasSpam && <div className="effect spam">⚠️ Spam Filter Active</div>}
          {hasAutoclicker && <div className="effect autoclicker">🤖 Autoclicker Active</div>}
        </div>
      )}

      {/* Main Click Button */}
      <div className="click-area">
        <button className="click-btn" onClick={handleClick}>
          <div className="btn-label">Reply</div>
          <div className="btn-value">+{clickValue} Karma</div>
        </button>
        <div className="click-info">
          <span>Award Chance: {awardChance}%</span>
          <span>Total Clicks: {state.stats.totalClicks.toLocaleString()}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="action-btn" onClick={() => setShowUpgrades(true)}>
          <span className="icon">⬆️</span>
          <span>Upgrades</span>
        </button>
        <button className="action-btn" onClick={() => setShowShop(true)}>
          <span className="icon">🏪</span>
          <span>Shop</span>
          {state.awards > 0 && <span className="badge">{state.awards}</span>}
        </button>
        <button className="action-btn" onClick={() => setShowAchievements(true)}>
          <span className="icon">🏆</span>
          <span>Achievements</span>
          <span className="badge">{state.achievements.length}</span>
        </button>
        <button className="action-btn" onClick={() => goTo('leaderboard')}>
          <span className="icon">📊</span>
          <span>Leaderboard</span>
        </button>
      </div>

      {/* Prestige Info */}
      {state.prestige.level > 0 && (
        <div className="prestige-info">
          ⭐ Prestige Level {state.prestige.level} (+{state.prestige.level * 10}% Karma)
        </div>
      )}

      {/* Modals */}
      {showUpgrades && (
        <UpgradesModal
          state={state}
          buyUpgrade={buyUpgrade}
          buyPassive={buyPassive}
          buyInfinite={buyInfinite}
          onClose={() => setShowUpgrades(false)}
        />
      )}

      {showShop && <ShopModal state={state} onClose={() => setShowShop(false)} />}

      {showAchievements && (
        <AchievementsModal state={state} onClose={() => setShowAchievements(false)} />
      )}
    </div>
  );
}
