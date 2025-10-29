// src/client/components/ShopModal.tsx

import type { GameState } from '../../shared/types/game';
import { SHOP_ITEMS } from '../../shared/constants/game';
import useGameState from '../hooks/useGameState';
import { canPrestige, getPrestigeReward } from '../../shared/helpers/calculations';

interface Props {
  state: GameState;
  onClose: () => void;
}

export default function ShopModal({ state, onClose }: Props) {
  const { buyShopItem } = useGameState();

  const themes = SHOP_ITEMS.filter((item) => item.type === 'theme');
  const autoclickers = SHOP_ITEMS.filter((item) => item.type === 'autoclicker');
  const prestigeItem = SHOP_ITEMS.find((item) => item.type === 'prestige');

  const canPrestigeNow = canPrestige(state);
  const prestigeBonus = getPrestigeReward(state);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content shop-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        <h2>Award Shop</h2>
        <p className="currency">
          You have <strong>{state.awards}</strong> awards
        </p>

        {/* Prestige Section */}
        {prestigeItem && (
          <section className="shop-section prestige-section">
            <h3>⭐ Prestige</h3>
            <div className="prestige-card">
              <h4>Reset & Ascend</h4>
              <p>
                Reset all progress for a permanent <strong>+10%</strong> karma multiplier
              </p>
              <p>Current Prestige Level: {state.prestige.level}</p>
              <p>Next Bonus: {(prestigeBonus * 100 - 100).toFixed(0)}%</p>
              <p className="requirement">
                {canPrestigeNow ? '✅ Ready to prestige!' : '❌ Requires 1,000,000 lifetime karma'}
              </p>
              <button
                onClick={() => {
                  if (confirm('Are you sure? This will reset all your progress!')) {
                    buyShopItem(prestigeItem);
                    onClose();
                  }
                }}
                disabled={state.awards < prestigeItem.cost || !canPrestigeNow}
                className="buy-btn prestige-btn"
              >
                Prestige ({prestigeItem.cost} awards)
              </button>
            </div>
          </section>
        )}

        {/* Themes */}
        <section className="shop-section">
          <h3>🎨 Themes</h3>
          <div className="shop-grid">
            {themes.map((item) => {
              const unlocked = state.unlocks.themes.includes(item.value!);
              const canAfford = state.awards >= item.cost;

              return (
                <div
                  key={item.id}
                  className={`shop-card ${unlocked ? 'unlocked' : ''} ${canAfford && !unlocked ? 'affordable' : ''}`}
                >
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                  <button
                    onClick={() => buyShopItem(item)}
                    disabled={!canAfford || unlocked}
                    className="buy-btn"
                  >
                    {unlocked ? '✓ Owned' : `Buy (${item.cost} awards)`}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Autoclickers */}
        <section className="shop-section">
          <h3>🤖 Autoclickers</h3>
          <div className="shop-grid">
            {autoclickers.map((item) => {
              const canAfford = state.awards >= item.cost;

              return (
                <div key={item.id} className={`shop-card ${canAfford ? 'affordable' : ''}`}>
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                  <button
                    onClick={() => {
                      buyShopItem(item);
                      onClose();
                    }}
                    disabled={!canAfford}
                    className="buy-btn"
                  >
                    Buy ({item.cost} awards)
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <p className="shop-tip">💡 Awards are earned randomly from clicking (not passive income)</p>
      </div>
    </div>
  );
}
