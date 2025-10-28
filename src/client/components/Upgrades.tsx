import type { GameState } from '../hooks/useGameState';
import { UPGRADES, INFINITE_UPGRADES, getCost, getInfiniteCost } from '../hooks/useUpgrades';
import '../styles/GameScreen.css';

interface Props {
  state: GameState;
  buyUpgrade: (key: keyof GameState['upgrades'], baseCost: number, multiplier: number) => void;
  buyInfinite: (key: keyof GameState['infinite'], baseCost: number, multiplier: number) => void;
  onClose: () => void;
}

export default function Upgrades({ state, buyUpgrade, buyInfinite, onClose }: Props) {
  return (
    <div className="upgrades-modal">
      <button className="close-btn" onClick={onClose}>✕</button>
      <h1>Upgrades</h1>

      {/* Standard Upgrades */}
      <section>
        <h2>Upgrades</h2>
        <div className="upgrade-grid">
          {UPGRADES.map(u => {
            const level = state.upgrades[u.key as keyof GameState['upgrades']] ?? 0;
            const cost = getCost(u.baseCost, level, u.multiplier);
            const affordable = state.karma >= cost;
            const maxed = !!(u.maxLevel && level >= u.maxLevel);

            return (
              <div key={u.key} className={`upgrade-card ${affordable ? 'active' : ''}`}>
                <h3>{u.label} (Lvl {level}/{u.maxLevel ?? '∞'})</h3>
                <p>Cost: {cost} karma — {u.effectDesc}</p>
                <button
                  onClick={() =>
                    buyUpgrade(u.key as keyof GameState['upgrades'], u.baseCost, u.multiplier)
                  }
                  disabled={!affordable || maxed}
                >
                  {maxed ? 'MAXED' : `Buy (${cost} karma)`}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Infinite Upgrades */}
      <section>
        <h2>Infinite Upgrades</h2>
        <div className="upgrade-grid">
          {INFINITE_UPGRADES.map(u => {
            const level = state.infinite[u.key as keyof GameState['infinite']] ?? 0;
            const cost = getInfiniteCost(u.baseCost, level, u.multiplier);
            const affordable = state.karma >= cost;

            return (
              <div key={u.key} className={`upgrade-card ${affordable ? 'active' : ''}`}>
                <h3>{u.label} (Lvl {level})</h3>
                <p>Cost: {cost} karma — {u.effectDesc}</p>
                <button
                  onClick={() =>
                    buyInfinite(u.key as keyof GameState['infinite'], u.baseCost, u.multiplier)
                  }
                  disabled={!affordable}
                >
                  Buy ({cost} karma)
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
